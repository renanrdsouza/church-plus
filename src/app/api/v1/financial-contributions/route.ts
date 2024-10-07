import {
  getContributionsByMonthAndYear,
  saveFinancialContribution,
} from "@/models/financialContribution";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const body = await request.json();

  try {
    const savedFinancialContribution = await saveFinancialContribution(
      body,
      session.user.id,
    );

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
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const fromDate = params.get("fromDate");
  const toDate = params.get("toDate");

  if (!fromDate || !toDate)
    return NextResponse.json({ error: "Missing parameter" }, { status: 400 });

  try {
    const contributions = await getContributionsByMonthAndYear(
      fromDate,
      toDate,
      session.user.id,
    );

    return NextResponse.json({ contributions }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
