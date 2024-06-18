import { GET } from "@/app/api/v1/members/route";
import { getAllMembers } from "@/models/database";
import { NextResponse } from "next/server";

jest.mock("../../models/database");

NextResponse.json = jest.fn();

describe("GET", () => {
  it("should return all members and 200 status code", async () => {
    const request = new Request("http://localhost:3000/api/v1/members");
    const members = [{ id: 1, name: "John Doe" }];

    getAllMembers.mockResolvedValue(members);

    const response = await GET(request);

    expect(getAllMembers).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { members },
      { status: 200 },
    );
    expect(response).toEqual(NextResponse.json({ members }, { status: 200 }));
  });

  it("should return 500 status code for errors", async () => {
    const request = new Request("http://localhost:3000/api/v1/members");
    const error = new Error("Some error");

    getAllMembers.mockRejectedValue(() => {
      throw new Error("Internal Server Error");
    });

    const response = await GET(request);

    expect(getAllMembers).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Internal Server Error" },
      { status: 500 },
    );
    expect(response).toEqual(
      NextResponse.json({ error: "Internal Server Error" }, { status: 500 }),
    );
  });
});
