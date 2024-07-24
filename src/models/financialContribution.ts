import { FinancialContributionType } from "@/utils/enums";
import prisma from "../infrastructure/database";
import { validateFinancialContribution } from "./validations";

export async function saveFinancialContribution(
  newFinancialContribution: IFinancialContribuition,
): Promise<IFinancialContribuition> {
  const financialContributionFormated = typeToEnum(newFinancialContribution);
  validateFinancialContribution(newFinancialContribution);

  const savedFinancialContribution = await prisma.financialContribuition.create(
    {
      data: financialContributionFormated,
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

function typeToEnum(
  financialContribution: IFinancialContribuition,
): IFinancialContribuition {
  const typeMap: { [key: string]: string } = {
    Tithe: FinancialContributionType.TITHE,
    Offering: FinancialContributionType.OFFERING,
    Donation: FinancialContributionType.DONATION,
    Other: FinancialContributionType.OTHER,
  };

  financialContribution.type =
    typeMap[financialContribution.type] || typeMap.Other;

  return financialContribution;
}
