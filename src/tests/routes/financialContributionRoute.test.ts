import { POST } from "@/app/api/v1/financial-contributions/route";
import { saveFinancialContribution } from "@/models/financialContribution";
import { NextResponse } from "next/server";

jest.mock("../../models/financialContribution", () => ({
  saveFinancialContribution: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe("POST financial contribution", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should save financial contribution and return 201 status", async () => {
    const mockBody = { member_id: "123", amount: 100 };
    const request = new Request(
      "http://localhost:3000/api/v1/financial-contributions",
      {
        method: "POST",
        body: JSON.stringify(mockBody),
      },
    );
    const mockSavedData = { id: "1", ...mockBody };

    (saveFinancialContribution as jest.Mock).mockResolvedValue(mockSavedData);

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { savedFinancialContribution: mockSavedData },
      { status: 201 },
    );
  });

  it("should return 400 status on foreign key constraint failure", async () => {
    const mockBody = { member_id: "invalid", amount: 100 };
    const request = new Request(
      "http://localhost:3000/api/v1/financial-contributions",
      {
        method: "POST",
        body: JSON.stringify(mockBody),
      },
    );
    const mockError = new Error(
      "Foreign key constraint failed on the field: `FinancialContribuition_member_id_fkey (index)`",
    );

    (saveFinancialContribution as jest.Mock).mockRejectedValue(mockError);

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Invalid member_id" },
      { status: 400 },
    );
  });

  it("should return 500 status on other errors", async () => {
    const mockBody = { member_id: "123", amount: 100 };
    const request = new Request(
      "http://localhost:3000/api/v1/financial-contributions",
      {
        method: "POST",
        body: JSON.stringify(mockBody),
      },
    );
    const mockError = new Error("Unexpected error");

    (saveFinancialContribution as jest.Mock).mockRejectedValue(mockError);

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Unexpected error" },
      { status: 500 },
    );
  });
});
