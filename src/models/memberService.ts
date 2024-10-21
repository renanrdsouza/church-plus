import { Prisma } from "@prisma/client";
import prisma from "../infrastructure/database";
import { Status } from "@/utils/enums";
import { validateNewMember, validateUpdateMember } from "./validations";
import { IMember, IMemberPutRequest } from "./modelsInterfaces";

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

export async function create(newMember: IMember, userId: string) {
  const parsedBirthDate = new Date(newMember.birth_date).toISOString();
  const parsedBaptismDate = new Date(newMember.baptism_date).toISOString();
  validateNewMember(newMember);
  const existingMember = await prisma.member.findFirst({
    where: {
      cpf: newMember.cpf,
    },
  });

  if (existingMember) {
    throw new Error("Member already exists");
  }

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
      user_id: userId,
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

export async function getMember(id: string, userId: string) {
  /* 
    If findUniqueOrThrow does not found a member, 
    it throws an error with the following message: "No Member Found" 
  */
  const member = await prisma.member.findUniqueOrThrow({
    where: {
      id,
      user_id: userId,
    },
    include: {
      address_list: true,
      phone_list: true,
      financial_contributions: true,
    },
  });

  return member;
}

export async function getAllMembers(userId: string) {
  const allMembers = await prisma.member.findMany({
    where: {
      status: Status.ACTIVE,
      user_id: userId,
    },
    include: {
      address_list: true,
      phone_list: true,
      financial_contributions: true,
    },
  });

  return allMembers;
}

export async function updateMember(
  id: string,
  updateRequest: IMemberPutRequest,
  userId: string,
) {
  const existingMember = await prisma.member.findUniqueOrThrow({
    where: {
      id,
      user_id: userId,
    },
    include: {
      address_list: true,
      phone_list: true,
    },
  });

  validateUpdateMember(updateRequest);
  console.log(existingMember);
  console.log(updateRequest);

  const updatedMember = await prisma.member.update({
    where: {
      id,
      user_id: userId,
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
            id: existingMember.address_list[0].id,
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
            id: existingMember.phone_list[0].id,
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

export async function deleteMember(id: string, userId: string) {
  const memberToDelete = await prisma.member.findUniqueOrThrow({
    where: {
      id: id,
      user_id: userId,
    },
  });

  await prisma.member.update({
    where: {
      id: memberToDelete.id,
    },
    data: {
      status: Status.INACTIVE,
    },
  });
}

export async function getMemberLike(name: string) {
  const members = await prisma.member.findMany({
    where: {
      name: {
        contains: name,
      },
    },
    include: {
      address_list: true,
      phone_list: true,
      financial_contributions: true,
    },
  });

  return members;
}
