import {
  getMemberContributions,
  saveFinancialContribution,
  getContributionsByMonthAndYear,
  updateFinancialContribution,
} from "../../models/financialContribution";
import prisma from "../../infrastructure/database";
import { validateFinancialContribution } from "../../models/validations";
import { FinancialContributionType } from "@/utils/enums";
import { prismaMock } from "../singleton";
import {
  IFinancialContribuition,
  IFinancialContributionPutRequest,
} from "@/models/modelsInterfaces";

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

describe("getContributionsByMonthAndYear", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should query contributions correctly for a given month and year", async () => {
    const mockContributions = [{ id: 1, amount: 100 }];
    (prisma.financialContribuition.findMany as jest.Mock).mockResolvedValue(
      mockContributions,
    );

    const year = "2023";
    const month = "04";
    const contributions = await getContributionsByMonthAndYear(year, month);

    expect(contributions).toEqual(mockContributions);
    expect(prisma.financialContribuition.findMany).toHaveBeenCalledWith({
      where: {
        created_at: {
          gte: new Date("2023-04-01"),
          lte: new Date("2023-04-31"),
        },
      },
    });
  });

  it("should handle empty results", async () => {
    (prisma.financialContribuition.findMany as jest.Mock).mockResolvedValue([]);

    const year = "2023";
    const month = "05";
    const contributions = await getContributionsByMonthAndYear(year, month);

    expect(contributions).toEqual([]);
    expect(prisma.financialContribuition.findMany).toHaveBeenCalledWith({
      where: {
        created_at: {
          gte: new Date("2023-05-01"),
          lte: new Date("2023-05-31"),
        },
      },
    });
  });

  it("should handle errors gracefully", async () => {
    (prisma.financialContribuition.findMany as jest.Mock).mockRejectedValue(
      new Error("Test error"),
    );

    await expect(getContributionsByMonthAndYear("2023", "04")).rejects.toThrow(
      "Test error",
    );
  });
});

describe("updateFinancialContribution", () => {
  const id = "test-id";
  const putRequest: IFinancialContributionPutRequest = {
    value: 100,
    type: FinancialContributionType.DONATION, // Adjust this value based on your actual enum or expected types
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update financial contribution successfully", async () => {
    (prisma.financialContribuition.update as jest.Mock).mockResolvedValue({
      id,
      ...putRequest,
      type: FinancialContributionType.DONATION, // Replace 'ENUM_VALUE' with the expected enum value after conversion
    });

    const result = await updateFinancialContribution(id, putRequest);

    expect(prisma.financialContribuition.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        value: putRequest.value,
        type: FinancialContributionType.DONATION, // Replace 'ENUM_VALUE' with the expected enum value after conversion
      },
    });
    expect(result).toBeDefined();
  });

  it("should handle errors gracefully", async () => {
    (prisma.financialContribuition.update as jest.Mock).mockRejectedValue(
      new Error("Update failed"),
    );

    await expect(updateFinancialContribution(id, putRequest)).rejects.toThrow(
      "Update failed",
    );
  });
});
