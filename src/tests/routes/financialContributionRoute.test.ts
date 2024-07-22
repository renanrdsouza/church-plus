import { POST } from "@/app/api/v1/financial-contributions/route";
import { GET } from "@/app/api/v1/financial-contributions/[id]/route";
import {
  getMemberContributions,
  saveFinancialContribution,
} from "@/models/financialContribution";
import { NextResponse } from "next/server";

jest.mock("../../models/financialContribution", () => ({
  saveFinancialContribution: jest.fn(),
  getMemberContributions: jest.fn(),
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

describe("GET", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return member contributions when id is provided", async () => {
    const mockContributions = [
      {
        id: "contribution1",
        member_id: "1",
        amount: 100,
        date: new Date("2023-01-01"),
      },
      {
        id: "contribution2",
        member_id: "1",
        amount: 200,
        date: new Date("2023-02-01"),
      },
    ];

    const request = new Request(
      "http://localhost:3000/api/v1/financial-contributions/1",
      {
        method: "GET",
      },
    );

    (getMemberContributions as jest.Mock).mockResolvedValue(mockContributions);

    await GET(request, { params: { id: "1" } });

    expect(getMemberContributions).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { contributions: mockContributions },
      { status: 200 },
    );
  });

  it("should return an error response when id is missing", async () => {
    const request = new Request(
      "http://localhost:3000/api/v1/financial-contributions/1",
      {
        method: "GET",
      },
    );
    const mockErrorResponse = { error: "Missing member_id" };

    await GET(request, { params: { id: "" } });

    expect(NextResponse.json).toHaveBeenCalledWith(mockErrorResponse, {
      status: 400,
    });
  });

  it("should return an error response when an internal server error occurs", async () => {
    const request = new Request(
      "http://localhost:3000/api/v1/financial-contributions/1",
      {
        method: "GET",
      },
    );

    (getMemberContributions as jest.Mock).mockRejectedValue(
      new Error("Internal Server Error"),
    );

    await GET(request, { params: { id: "1" } });

    expect(getMemberContributions).toHaveBeenCalledWith("1");
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  });
});
