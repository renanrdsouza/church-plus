import { saveMember } from "@/models/database";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: IMember = await request.json();
  console.log(body);

  try {
    const savedMember = await saveMember(body);

    return NextResponse.json({ savedMember }, { status: 201 });
  } catch (err: any) {
    if (err.message === "Member already exists") {
      return NextResponse.json({ error: err.message }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: err.message },
        { status: 500 },
      );
    }
  }
}
