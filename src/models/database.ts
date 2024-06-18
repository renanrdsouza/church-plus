import { Prisma } from "@prisma/client";
import prisma from "./db";

export async function query(query: string) {
  const preparedQuery = Prisma.sql([query]);

  try {
    const result = await prisma.$queryRaw(preparedQuery);
    return result;
  } catch (error) {
    console.error("An error occurred during query execution: ", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function create(newMember: IMember) {
  const parsedBirthDate = new Date(newMember.birth_date).toISOString();
  const parsedBaptismDate = new Date(newMember.baptism_date).toISOString();

  const existingMember = await prisma.member.findFirst({
    where: {
      cpf: newMember.cpf,
    },
  });

  if (existingMember) {
    throw new Error("Member already exists");
  }

  validateNewMember(newMember);

  const savedMember = await prisma.member.create({
    data: {
      name: newMember.name,
      cpf: newMember.cpf,
      birth_date: parsedBirthDate,
      email: newMember.email,
      baptism_date: parsedBaptismDate,
      father_name: newMember.father_name,
      mother_name: newMember.mother_name,
      education: newMember.education,
      profession: newMember.profession,
      financial_contributions: {
        create: [],
      },
      phone_list: {
        create: newMember.phone_list?.map((phone) => ({
          phone_number: phone.phone_number,
        })),
      },
      address_list: {
        create: newMember.address_list.map((address) => ({
          zip_code: address.zip_code,
          number: address.number,
          street: address.street,
          neighborhood: address.neighborhood,
          complement: address.complement,
          uf: address.uf,
          city: address.city,
        })),
      },
    },
  });

  return savedMember;
}

export async function getMember(id: string) {
  /* 
    If findUniqueOrThrow does not found a member, 
    it throws an error with the following message: "No Member Found" 
  */
  const member = await prisma.member.findUniqueOrThrow(
    {
      where: {
        id,
      },
      include: {
        address_list: true,
        phone_list: true,
        financial_contributions: true,
      },
    },
  );

  return member;
}

export async function getAllMembers() {
  const members = await prisma.member.findMany({
    include: {
      address_list: true,
      phone_list: true,
      financial_contributions: true,
    },
  });

  return members;
}

function validateNewMember(newMember: IMember) {
  [newMember.name, newMember.father_name, newMember.mother_name].forEach(
    validateName,
  );
  validateCPF(newMember.cpf);
  [newMember.birth_date, newMember.baptism_date].forEach(validateDate);
  validateEmail(newMember.email);
  validateProfession(newMember.profession);
  validateAddressList(newMember.address_list || []);
  validatePhoneList(newMember.phone_list || []);
}

function validateCPF(cpf: string): boolean {
  const cpfRegex = /^[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}$/;

  if (!cpfRegex.test(cpf) || cpf === "000.000.000-00" || cpf.trim() === "") {
    throw new Error("Invalid CPF");
  }

  const formattedCpf = cpf.split(".").join("").split("-").join("");
  let rest = 0;
  let sum = 0;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(formattedCpf.substring(i - 1, i)) * (11 - i);
  }

  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(formattedCpf.substring(9, 10))) {
    throw new Error("Invalid CPF");
  }

  sum = 0;

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(formattedCpf.substring(i - 1, i)) * (12 - i);
  }

  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(formattedCpf.substring(10, 11))) {
    throw new Error("Invalid CPF");
  }

  return true;
}

function validateDate(date: Date): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(date.toString())) {
    throw new Error("Invalid date");
  }

  return true;
}

function validateName(name: string): boolean {
  const nameRegex =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

  if (!nameRegex.test(name) || name.trim() === "") {
    throw new Error("Invalid name");
  }

  return true;
}

function validateEmail(email: string): boolean {
  const emailRegex = /\S+@\w+\.\w{2,}(\.\w{2})?/gm;

  if (!emailRegex.test(email) || email.trim() === "") {
    throw new Error("Invalid email");
  }

  return true;
}

function validateProfession(profession: string): boolean {
  const professionRegex = /^[a-zA-Z\s]{3,}$/;

  if (!professionRegex.test(profession) || profession.trim() === "") {
    throw new Error("Invalid profession");
  }

  return true;
}

function validateAddressList(addressList: IAddress[]): boolean {
  if (addressList.length === 0) {
    throw new Error("Address list cannot be empty");
  }

  return true;
}

function validatePhoneList(phoneList: IPhone[]): boolean {
  if (phoneList.length === 0) {
    throw new Error("Phone list cannot be empty");
  }

  phoneList.forEach((phone) => {
    const phoneRegex = /(\(\d{2}\)\s?)?\d{4,5}-\d{4}/g;

    if (
      !phoneRegex.test(phone.phone_number) ||
      phone.phone_number.trim() === ""
    ) {
      throw new Error("Invalid phone number");
    }
  });

  return true;
}
