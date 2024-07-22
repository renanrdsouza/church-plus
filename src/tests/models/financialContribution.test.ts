import {
  getMemberContributions,
  saveFinancialContribution,
} from "../../models/financialContribution";
import prisma from "../../infrastructure/database";
import { validateFinancialContribution } from "../../models/validations";
import { FinancialContributionType } from "@/utils/enums";
import { prismaMock } from "../singleton";

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

describe("getMemberContributions", () => {
  test("should fetch contributions for a given member ID", async () => {
    const memberID = "123";
    const mockContributions = [
      {
        id: "contribution1",
        member_id: memberID,
        amount: 100,
        date: new Date("2023-01-01"),
      },
      {
        id: "contribution2",
        member_id: memberID,
        amount: 200,
        date: new Date("2023-02-01"),
      },
    ];

    (prisma.financialContribuition.findMany as jest.Mock).mockResolvedValue(
      mockContributions,
    );

    const contributions = await getMemberContributions(memberID);

    expect(contributions).toEqual(mockContributions);
    expect(prisma.financialContribuition.findMany).toHaveBeenCalledWith({
      where: {
        member_id: memberID,
      },
    });
  });

  test("should return an empty array if no contributions found", async () => {
    const memberID = "nonexistent";
    (prismaMock.financialContribuition.findMany as jest.Mock).mockResolvedValue(
      [],
    );

    const contributions = await getMemberContributions(memberID);

    expect(contributions).toEqual([]);
    expect(prismaMock.financialContribuition.findMany).toHaveBeenCalledWith({
      where: {
        member_id: memberID,
      },
    });
  });
});
