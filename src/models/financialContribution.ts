import prisma from "../infrastructure/database";
import { validateFinancialContribution } from "./validations";
import {
  IFinancialContribuition,
  IFinancialContributionPutRequest,
} from "./modelsInterfaces";
import { typeToEnum } from "@/utils/typeToEnum";

export async function saveFinancialContribution(
  newFinancialContribution: IFinancialContribuition,
): Promise<IFinancialContribuition> {
  const financialContributionTypeFormated = typeToEnum(
    newFinancialContribution.type,
  );
  newFinancialContribution.type = financialContributionTypeFormated;
  validateFinancialContribution(newFinancialContribution);

  const savedFinancialContribution = await prisma.financialContribuition.create(
    {
      data: newFinancialContribution,
    },
  );

  return savedFinancialContribution;
}

export async function getMemberContributions(
  id: string,
): Promise<IFinancialContribuition[]> {
  const contributions = await prisma.financialContribuition.findMany({
    where: {
      member_id: id,
    },
  });

  return contributions;
}

export async function updateFinancialContribution(
  id: string,
  putRequest: IFinancialContributionPutRequest,
) {
  const financialContributionTypeFormated = typeToEnum(putRequest.type);

  const updatedFinancialContribution =
    await prisma.financialContribuition.update({
      where: { id },
      data: {
        value: putRequest.value,
        type: financialContributionTypeFormated,
      },
    });

  return updateFinancialContribution;
}

export async function getContributionsByMonthAndYear(
  year: string,
  month: string,
) {
  const contributions = await prisma.financialContribuition.findMany({
    where: {
      created_at: {
        gte: new Date(`${year}-${month}-01`),
        lte: new Date(`${year}-${month}-31`),
      },
    },
  });

  return contributions;
}
