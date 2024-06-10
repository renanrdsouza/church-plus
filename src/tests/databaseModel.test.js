import { saveMember } from "../models/database";
import { NextResponse } from "next/server";
import { POST } from "../app/api/v1/members/route";

jest.mock("../models/database", () => ({
  saveMember: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe("POST", () => {
  const request = {
    json: jest.fn().mockResolvedValue({ name: "John Doe" }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should save the member and return a 201 response", async () => {
    const savedMember = { id: 1, name: "John Doe" };
    saveMember.mockResolvedValue(savedMember);

    await POST(request);

    expect(saveMember).toHaveBeenCalledWith({ name: "John Doe" });
    expect(NextResponse.json).toHaveBeenCalledWith(
      { savedMember },
      { status: 201 }
    );
  });

  it("should return a 400 response if the member already exists", async () => {
    const error = new Error("Member already exists");
    saveMember.mockRejectedValue(error);

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Member already exists" },
      { status: 400 }
    );
  });

  it("should return a 500 response for other errors", async () => {
    const error = new Error("Internal server error");
    saveMember.mockRejectedValue(error);

    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Internal server error" },
      { status: 500 }
    );
  });
});
