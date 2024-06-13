import { POST } from "@/app/api/v1/members/route";
import { saveMember } from "@/models/database";
import { NextResponse } from "next/server";

jest.mock("../../models/database");

NextResponse.json = jest.fn();

describe("POST", () => {
  it("should save a member and return a 201 response", async () => {
    const request = new Request("http://localhost:3000/api/v1/members", {
      method: "POST",
      body: JSON.stringify({ name: "John Doe" }),
    });

    const savedMember = { id: 1, name: "John Doe" };
    saveMember.mockResolvedValue(savedMember);

    const response = await POST(request);

    expect(saveMember).toHaveBeenCalledWith({ name: "John Doe" });
    expect(NextResponse.json).toHaveBeenCalledWith({ savedMember }, { status: 201 });
    expect(response).toEqual(NextResponse.json({ savedMember }, { status: 201 }));
  });

  it("should return a 400 response if the member already exists", async () => {
    const request = new Request("http://localhost:3000/api/v1/members", {
      method: "POST",
      body: JSON.stringify({ name: "John Doe" }),
    });

    const error = new Error("Member already exists");
    saveMember.mockRejectedValue(error);

    const response = await POST(request);

    expect(saveMember).toHaveBeenCalledWith({ name: "John Doe" });
    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Member already exists" }, { status: 400 });
    expect(response).toEqual(NextResponse.json({ error: "Member already exists" }, { status: 400 }));
  });

  it("should return a 400 response if the request body is invalid", async () => {
    const request = new Request("http://localhost:3000/api/v1/members", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const error = new Error("Invalid request body");
    saveMember.mockRejectedValue(error);

    const response = await POST(request);

    expect(saveMember).toHaveBeenCalledWith({});
    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Invalid request body" }, { status: 400 });
    expect(response).toEqual(NextResponse.json({ error: "Invalid request body" }, { status: 400 }));
  });

  it("should return a 500 response for other errors", async () => {
    const request = new Request("http://localhost:3000/api/v1/members", {
      method: "POST",
      body: JSON.stringify({ name: "John Doe" }),
    });

    const error = new Error("Internal server error");
    saveMember.mockRejectedValue(error);

    const response = await POST(request);

    expect(saveMember).toHaveBeenCalledWith({ name: "John Doe" });
    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Internal server error" }, { status: 500 });
    expect(response).toEqual(NextResponse.json({ error: "Internal server error" }, { status: 500 }));
  });
});