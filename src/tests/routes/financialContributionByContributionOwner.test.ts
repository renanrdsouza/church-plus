import { GET } from "@/app/api/v1/financial-contributions/contribution/[contributionId]/route";
import { getFinancialContributionById } from "@/models/financialContribution";

// Mock the getFinancialContributionById function
jest.mock("../../models/financialContribution", () => ({
  getFinancialContributionById: jest.fn(),
}));

describe("GET /api/financial-contributions/:contributionId", () => {
  const mockContribution = { id: "1", amount: 100 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if contributionId is missing", async () => {
    const request = new Request("http://localhost");
    const params = { contributionId: "" };

    const response = await GET(request, { params });

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json).toEqual({ error: "Missing contribution_id" });
  });

  it("should return 404 if contribution is not found", async () => {
    (getFinancialContributionById as jest.Mock).mockResolvedValue(null);

    const request = new Request("http://localhost");
    const params = { contributionId: "1" };

    const response = await GET(request, { params });

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json).toEqual({ error: "Contribution not found" });
  });

  it("should return 200 and the contribution if found", async () => {
    (getFinancialContributionById as jest.Mock).mockResolvedValue(
      mockContribution,
    );

    const request = new Request("http://localhost");
    const params = { contributionId: "1" };

    const response = await GET(request, { params });

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ contribution: mockContribution });
  });

  it("should return 500 if there is an internal server error", async () => {
    (getFinancialContributionById as jest.Mock).mockRejectedValue(
      new Error("Internal Server Error"),
    );

    const request = new Request("http://localhost");
    const params = { contributionId: "1" };

    const response = await GET(request, { params });

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json).toEqual({ error: "Internal Server Error" });
  });
});
