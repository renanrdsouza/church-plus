import { saveFinancialContribution } from "../../models/financialContribution";
import prisma from "../../infrastructure/database";
import { validateFinancialContribution } from "../../models/validations";
import { FinancialContributionType } from "@/utils/enums";

jest.mock("../../infrastructure/database", () => ({
  financialContribuition: {
    create: jest.fn(),
  },
}));

jest.mock("../../models/validations", () => ({
  validateFinancialContribution: jest.fn(),
}));

describe("saveFinancialContribution", () => {
  const mockFinancialContribution: IFinancialContribuition = {
    type: "Tithe",
    value: 100,
    member_id: "1",
    created_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should save a financial contribution successfully", async () => {
    (prisma.financialContribuition.create as jest.Mock).mockResolvedValue(
      mockFinancialContribution,
    );
    const result = await saveFinancialContribution(mockFinancialContribution);

    expect(validateFinancialContribution).toHaveBeenCalledWith(
      mockFinancialContribution,
    );
    expect(prisma.financialContribuition.create).toHaveBeenCalledWith({
      data: {
        ...mockFinancialContribution,
        type: FinancialContributionType.TITHE,
      },
    });
    expect(result).toEqual(mockFinancialContribution);
  });

  it("should throw an error when validation fails", async () => {
    (validateFinancialContribution as jest.Mock).mockImplementation(() => {
      throw new Error("Validation failed");
    });

    await expect(
      saveFinancialContribution(mockFinancialContribution),
    ).rejects.toThrow("Validation failed");
  });

  it("should handle database errors gracefully", async () => {
    (validateFinancialContribution as jest.Mock).mockImplementation(() => {});

    (prisma.financialContribuition.create as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    await expect(
      saveFinancialContribution(mockFinancialContribution),
    ).rejects.toThrow("Database error");
  });
});
