import {
  getContributionsByMonthAndYear,
  saveFinancialContribution,
} from "@/models/financialContribution";
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

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const fromDate = params.get("fromDate");
  const toDate = params.get("toDate");

  if (!fromDate || !toDate)
    return NextResponse.json({ error: "Missing parameter" }, { status: 400 });

  try {
    const contributions = await getContributionsByMonthAndYear(
      fromDate,
      toDate,
    );

    return NextResponse.json({ contributions }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
