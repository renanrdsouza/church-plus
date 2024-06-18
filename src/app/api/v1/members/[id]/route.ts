import { NextResponse } from "next/server";
import { getMember } from "@/models/database";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const memberResponse = await getMember(id);

    return NextResponse.json({ member: memberResponse }, { status: 200 });
  } catch (err: any) {
    if (err.message === "No Member found") {
      return NextResponse.json({ error: err.message }, { status: 404 });
    } else {
      return NextResponse.json(
        { error: err.message },
        { status: 500 },
      );
    }
  }
}
