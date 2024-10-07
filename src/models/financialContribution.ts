import prisma from "../infrastructure/database";
import { validateFinancialContribution } from "./validations";
import {
  IFinancialContribuition,
  IFinancialContributionPutRequest,
} from "./modelsInterfaces";
import { typeToEnum } from "@/utils/typeToEnum";

export async function saveFinancialContribution(
  newFinancialContribution: IFinancialContribuition,
  userId: string,
): Promise<IFinancialContribuition> {
  const financialContributionTypeFormated = typeToEnum(
    newFinancialContribution.type,
  );
  newFinancialContribution.type = financialContributionTypeFormated;
  validateFinancialContribution(newFinancialContribution);

  const savedFinancialContribution = await prisma.financialContribuition.create(
    {
      data: { ...newFinancialContribution, user_id: userId },
    },
  );

  return savedFinancialContribution;
}

export async function getMemberContributions(
  id: string,
  userId: string,
): Promise<IFinancialContribuition[]> {
  const contributions = await prisma.financialContribuition.findMany({
    where: {
      member_id: id,
      user_id: userId,
    },
  });

  return contributions;
}

export async function updateFinancialContribution(
  id: string,
  putRequest: IFinancialContributionPutRequest,
  userId: string,
) {
  const financialContributionTypeFormated = typeToEnum(putRequest.type);

  if (
    !id.match(/[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/)
  ) {
    throw new Error("Malformed financial contribution id");
  }

  const updatedFinancialContribution =
    await prisma.financialContribuition.update({
      where: {
        id,
        user_id: userId,
      },
      data: {
        value: putRequest.value,
        type: financialContributionTypeFormated,
      },
    });

  return updatedFinancialContribution;
}

export async function getContributionsByMonthAndYear(
  fromDate: string,
  toDate: string,
  userId: string,
) {
  const contributions = await prisma.financialContribuition.findMany({
    where: {
      created_at: {
        gte: new Date(`${fromDate}`),
        lte: new Date(`${toDate}`),
      },
      user_id: userId,
    },
  });

  return contributions;
}

export async function deleteFinancialContribution(id: string, userId: string) {
  if (
    !id.match(/[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/)
  ) {
    throw new Error("Malformed financial contribution id");
  }

  await prisma.financialContribuition.delete({
    where: {
      id,
      user_id: userId,
    },
  });
}

export async function getFinancialContributionById(id: string, userId: string) {
  if (
    !id.match(/[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/)
  ) {
    throw new Error("Malformed financial contribution id");
  }

  const contribution = await prisma.financialContribuition.findUnique({
    where: {
      id,
      user_id: userId,
    },
  });

  return contribution;
}
