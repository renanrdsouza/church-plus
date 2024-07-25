import { FinancialContributionType } from "./enums";

export function typeToEnum(financialContributionType: string): string {
  const typeMap: { [key: string]: string } = {
    Tithe: FinancialContributionType.TITHE,
    Offering: FinancialContributionType.OFFERING,
    Donation: FinancialContributionType.DONATION,
    Other: FinancialContributionType.OTHER,
  };

  financialContributionType =
    typeMap[financialContributionType] || typeMap.Other;

  return financialContributionType;
}
