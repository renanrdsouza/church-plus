import { getMemberLike } from "@/models/memberService";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { name: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const name = decodeURI(params.name);
  const members = await getMemberLike(name);

  if (members.length === 0) {
    return NextResponse.json({ message: "No members found" }, { status: 404 });
  } else {
    return NextResponse.json({ members }, { status: 200 });
  }
}
