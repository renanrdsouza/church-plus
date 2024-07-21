import { saveFinancialContribution } from "@/models/financialContribution";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const savedFinancialContribution = await saveFinancialContribution(body);

    return NextResponse.json({ savedFinancialContribution }, { status: 201 });
  } catch (err: any) {
    if (
      err.message.includes(
        "Foreign key constraint failed on the field: `FinancialContribuition_member_id_fkey (index)`",
      )
    ) {
      return NextResponse.json({ error: "Invalid member_id" }, { status: 400 });
    } else {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
}
