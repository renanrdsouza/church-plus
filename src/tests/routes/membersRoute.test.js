import { POST } from "@/app/api/v1/members/route";
import { GET, PUT, DELETE } from "@/app/api/v1/members/[id]/route"
import { create, getMember, updateMember, deleteMember } from "@/models/database";
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
    create.mockResolvedValue(savedMember);

    const response = await POST(request);

    expect(create).toHaveBeenCalledWith({ name: "John Doe" });
    expect(NextResponse.json).toHaveBeenCalledWith({ savedMember }, { status: 201 });
    expect(response).toEqual(NextResponse.json({ savedMember }, { status: 201 }));
  });

  it("should return a 400 response if the member already exists", async () => {
    const request = new Request("http://localhost:3000/api/v1/members", {
      method: "POST",
      body: JSON.stringify({ name: "John Doe" }),
    });

    const error = new Error("Member already exists");
    create.mockRejectedValue(error);

    const response = await POST(request);

    expect(create).toHaveBeenCalledWith({ name: "John Doe" });
    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Member already exists" }, { status: 400 });
    expect(response).toEqual(NextResponse.json({ error: "Member already exists" }, { status: 400 }));
  });

  it("should return a 400 response if the request body is invalid", async () => {
    const request = new Request("http://localhost:3000/api/v1/members", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const error = new Error("Invalid request body");
    create.mockRejectedValue(error);

    const response = await POST(request);

    expect(create).toHaveBeenCalledWith({});
    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Invalid request body" }, { status: 400 });
    expect(response).toEqual(NextResponse.json({ error: "Invalid request body" }, { status: 400 }));
  });

  it("should return a 500 response for other errors", async () => {
    const request = new Request("http://localhost:3000/api/v1/members", {
      method: "POST",
      body: JSON.stringify({ name: "John Doe" }),
    });

    const error = new Error("Internal Server Error");
    create.mockRejectedValue(error);

    const response = await POST(request);

    expect(create).toHaveBeenCalledWith({ name: "John Doe" });
    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Internal Server Error" }, { status: 500 });
    expect(response).toEqual(NextResponse.json({ error: "Internal Server Error" }, { status: 500 }));
  });
});

describe("GET a member", () => {
  it("should return a 200 response with the member", async () => {
    const request = new Request("http://localhost:3000/api/v1/members/1", {
      method: "GET",
    });

    const member = { id: 1, name: "John Doe" };
    getMember.mockResolvedValue(member);

    const response = await GET(request, { params: { id: "1" } });

    expect(getMember).toHaveBeenCalledWith("1");
    expect(NextResponse.json).toHaveBeenCalledWith({ member }, { status: 200 });
    expect(response).toEqual(NextResponse.json({ member }, { status: 200 }));
  });

  it("should return a 404 response if the member does not exist", async () => {
    const request = new Request("http://localhost:3000/api/v1/members?id=1", {
      method: "GET",
    });

    getMember.mockImplementation(() => {
      throw new Error('No Member found');
    });

    const response = await GET(request, { params: { id: "1" } });

    expect(getMember).toHaveBeenCalledWith("1");
    expect(NextResponse.json).toHaveBeenCalledWith({ error: "No Member found" }, { status: 404 });
    expect(response).toEqual(NextResponse.json({ error: "No Member found" }, { status: 404 }));
  });

  it("should return a 500 response for other errors", async () => {
    const request = new Request("http://localhost:3000/api/v1/members?id=1", {
      method: "GET",
    });

    const error = new Error("Internal Server Error");
    getMember.mockRejectedValue(error);

    const response = await GET(request, { params: { id: "1" } });

    expect(getMember).toHaveBeenCalledWith("1");
    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Internal Server Error" }, { status: 500 });
    expect(response).toEqual(NextResponse.json({ error: "Internal Server Error" }, { status: 500 }));
  });
});

describe("PUT", () => {
  it("should update a member and return 200 status code", async () => {
    const params = { id: "123" };
    const body = { name: "John Doe" };
    const request = new Request("http://localhost:3000/api/v1/members", {
      method: "PUT",
      body: JSON.stringify(body)
    });
    const updatedMember = { name: "John Doe" };

    updateMember.mockResolvedValue(updatedMember);

    const response = await PUT(request, { params });

    expect(updateMember).toHaveBeenCalledWith(params.id, body);
    expect(NextResponse.json).toHaveBeenCalledWith({ member: updatedMember }, { status: 200 });
    expect(response).toEqual(NextResponse.json({ member: updatedMember }, { status: 200 }));
  });

  it("should return 400 status code if id is missing", async () => {
    const body = { name: "John Doe" };
    const request = new Request("http://localhost:3000/api/v1/members", {
      method: "PUT",
      body: JSON.stringify(body)
    });
    const params = { id: undefined };

    const response = await PUT(request, { params });

    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Missing id" }, { status: 400 });
    expect(response).toEqual(NextResponse.json({ error: "Missing id" }, { status: 400 }));
  });

  it("should return 500 status code for errors", async () => {
    const body = { name: "John Doe" };
    const request = new Request("http://localhost:3000/api/v1/members", {
      method: "PUT",
      body: JSON.stringify(body)
    });
    const params = { id: "123" };

    updateMember.mockRejectedValue(new Error("Internal Server Error"));

    const response = await PUT(request, { params });

    expect(updateMember).toHaveBeenCalledWith(params.id, body);
    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Internal Server Error" }, { status: 500 });
    expect(response).toEqual(NextResponse.json({ error: "Internal Server Error" }, { status: 500 }));
  });
});

describe("DELETE", () => {
  it("should delete member and return success status", async () => {
    const id = "1";

    const request = new Request("http://localhost:3000/api/v1/members", {
      method: "DELETE",
    });
    const response = await DELETE(request, { params: { id } });

    expect(deleteMember).toHaveBeenCalledWith(id);
    expect(NextResponse.json).toHaveBeenCalledWith({ status: 200 });
    expect(response).toEqual(NextResponse.json());
  });

  it("should return internal server error when an error occurs", async () => {
    const id = "1";
    const errorMessage = "Some error message";
    deleteMember.mockRejectedValue(new Error(errorMessage));

    const request = new Request("http://localhost:3000/api/v1/members", {
      method: "DELETE",
    });
    const response = await DELETE(request, { params: { id } });

    expect(deleteMember).toHaveBeenCalledWith(id);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Internal Server Error" },
      { status: 500 }
    );
    expect(response).toEqual(NextResponse.json());
  });
});
