import { create, getAllMembers, updateMember } from "@/models/database";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: IMember = await request.json();

  try {
    const savedMember = await create(body);

    return NextResponse.json({ savedMember }, { status: 201 });
  } catch (err: any) {
    if (err.message === "Member already exists" || err.message.includes("Invalid")) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }
}

export async function GET(request: Request) {
  try {
    const members = await getAllMembers();
    
    return NextResponse.json({ members }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
