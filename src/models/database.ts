import { Prisma } from "@prisma/client";
import prisma from "./db";
import {
  validateNewMember,
  validateUpdateMember
} from "./validations";

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

export async function updateMember(
  id: string,
  updateRequest: IMemberPutRequest,
) {
  const existingMember = await prisma.member.findUniqueOrThrow({
    where: {
      id
    }
  })

  validateUpdateMember(updateRequest);

  const updatedMember = await prisma.member.update({
    where: {
      id,
    },
    data: {
      name: updateRequest.name || existingMember.name,
      birth_date: updateRequest.birth_date
        ? new Date(updateRequest.birth_date).toISOString()
        : existingMember.birth_date,
      email: updateRequest.email || existingMember.email,
      baptism_date: updateRequest.baptism_date
        ? new Date(updateRequest.baptism_date).toISOString()
        : existingMember.baptism_date,
      father_name: updateRequest.father_name || existingMember.father_name,
      mother_name: updateRequest.mother_name || existingMember.mother_name,
      education: updateRequest.education || existingMember.education,
      profession: updateRequest.profession || existingMember.profession,
      address_list: {
        update: updateRequest.address_list?.map((address) => ({
          where: {
            id: address.id,
          },
          data: {
            zip_code: address.zip_code,
            number: address.number,
            street: address.street,
            neighborhood: address.neighborhood,
            complement: address.complement,
            uf: address.uf,
            city: address.city,
          },
        })),
      },
      phone_list: {
        update: updateRequest.phone_list?.map((phone) => ({
          where: {
            id: phone.id,
          },
          data: {
            phone_number: phone.phone_number,
          },
        })),
      },
    },
  });

  return updatedMember;
}
