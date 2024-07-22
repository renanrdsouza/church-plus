import { getMemberContributions } from "@/models/financialContribution";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id: string = params.id;

  if (!id)
    return NextResponse.json({ error: "Missing member_id" }, { status: 400 });

  try {
    const contributions = await getMemberContributions(id);

    return NextResponse.json({ contributions }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
