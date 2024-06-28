import { NextResponse } from "next/server";
import { getMember, updateMember, deleteMember } from "@/models/database";

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
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  const body: IMemberPutRequest = await request.json();

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const updatedMember = await updateMember(id, body);

    return NextResponse.json({ member: updatedMember }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await deleteMember(id);

    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }  
}
