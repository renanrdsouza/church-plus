import { GET } from "@/app/api/v1/financial-contributions/route"; // Adjust the import path as necessary
import { NextResponse } from "next/server";
import { getContributionsByMonthAndYear } from "@/models/financialContribution"; // Adjust the import path as necessary

// Mock NextResponse.json
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

// Mock contributionsService
jest.mock("../../models/financialContribution", () => ({
  getContributionsByMonthAndYear: jest.fn(),
}));

describe("GET function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if year or month is missing", async () => {
    const request = new Request("http://localhost?month=04");
    await GET(request);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Missing parameter" },
      { status: 400 },
    );
  });

  it("should return 200 with contributions for valid year and month", async () => {
    (getContributionsByMonthAndYear as jest.Mock).mockResolvedValue([
      { id: 1, amount: 100 },
    ]);
    const request = new Request(
      "http://localhost/3000?fromDate=2023&toDate=04",
    );
    await GET(request);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { contributions: [{ id: 1, amount: 100 }] },
      { status: 200 },
    );
  });

  it("should return 500 on internal server error", async () => {
    (getContributionsByMonthAndYear as jest.Mock).mockRejectedValue(
      new Error("Test error"),
    );
    const request = new Request("http://localhost?fromDate=2023&toDate=04");
    await GET(request);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  });
});
