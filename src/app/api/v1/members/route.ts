import { create, getAllMembers } from "@/models/memberService";
import { IMember } from "@/models/modelsInterfaces";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const body: IMember = await request.json();

  try {
    const savedMember = await create(body, session.user.id);

    return NextResponse.json({ savedMember }, { status: 201 });
  } catch (err: any) {
    if (
      err.message === "Member already exists" ||
      err.message.includes("Invalid")
    ) {
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
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const members = await getAllMembers(session.user.id);

    return NextResponse.json({ members }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
