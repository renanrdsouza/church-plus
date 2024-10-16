import { GET } from "@/app/api/v1/members/by-name-like/[name]/route";
import { getMemberLike } from "@/models/memberService";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

jest.mock("../../models/memberService");
jest.mock("next-auth");
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({ data, init })),
  },
}));

describe("GET /api/v1/members/by-name-like/[name]", () => {
  const mockRequest = {} as Request;
  const mockParams = { params: { name: "john" } };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if the user is not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const response = await GET(mockRequest, mockParams);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Not authorized" },
      { status: 401 },
    );
    expect(response.status).toBe(401);
  });

  it("should return 404 if no members are found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: {} });
    (getMemberLike as jest.Mock).mockResolvedValue([]);

    const response = await GET(mockRequest, mockParams);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "No members found" },
      { status: 404 },
    );
    expect(response.status).toBe(404);
  });

  it("should return 200 with members if members are found", async () => {
    const mockMembers = [{ id: 1, name: "John Doe" }];
    (getServerSession as jest.Mock).mockResolvedValue({ user: {} });
    (getMemberLike as jest.Mock).mockResolvedValue(mockMembers);

    const response = await GET(mockRequest, mockParams);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { members: mockMembers },
      { status: 200 },
    );
    expect(response.status).toBe(200);
  });
});
