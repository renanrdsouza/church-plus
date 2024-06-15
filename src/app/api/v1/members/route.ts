import { create, getMember } from "@/models/database";
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
  const params = new URL(request.url).searchParams;
  const id = params.get("id");

  if(!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  
  try {
    const memberResponse = await getMember(id);

    return NextResponse.json(
      { member: memberResponse }, 
      { status: 200 }
    );
  } catch (err: any) {
    if (err.message === "No Member Found") {
      return NextResponse.json({ error: err.message }, { status: 404 });
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }
}
