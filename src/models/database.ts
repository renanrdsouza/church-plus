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

export async function saveMember(member: IMember) {
  const parsedBirthDate = new Date(member.birth_date).toISOString();
  console.log(parsedBirthDate);
  const parsedBaptismDate = new Date(member.baptism_date).toISOString();
  console.log(parsedBaptismDate);

  const existingMember = await prisma.member.findFirst({
    where: {
      cpf: member.cpf,
    },
  });

  if (existingMember) {
    throw new Error("Member already exists");
  }

  const savedMember = await prisma.member.create({
    data: {
      name: member.name,
      cpf: member.cpf,
      birth_date: parsedBirthDate,
      email: member.email,
      baptism_date: parsedBaptismDate,
      father_name: member.father_name,
      mother_name: member.mother_name,
      education: member.education,
      profession: member.profession,
      financial_contributions: {
        create: [],
      },
      phone_list: {
        create: member.phone_list?.map((phone) => ({
          phone_number: phone.phone_number,
        }))
      },
      address_list: {
        create: member.address_list?.map((address) => ({
          zip_code: address.zip_code,
          number: address.number,
          street: address.street,
          neighborhood: address.neighborhood,
          complement: address.complement,
          uf: address.uf,
          city: address.city,
        }))
      },
    },
  });

  return savedMember;
}
