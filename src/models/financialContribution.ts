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
