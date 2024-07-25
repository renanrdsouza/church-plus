import {
  getMemberContributions,
  updateFinancialContribution,
} from "@/models/financialContribution";
import { IFinancialContributionPutRequest } from "@/models/modelsInterfaces";
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id: string = params.id;
  const body: IFinancialContributionPutRequest = await request.json();

  if (id === undefined || id === null || id === "")
    return NextResponse.json(
      { error: "Missing financial contribution id" },
      { status: 400 },
    );

  try {
    const updatedFinancialContribution = await updateFinancialContribution(
      id,
      body,
    );

    return NextResponse.json({ updatedFinancialContribution }, { status: 200 });
  } catch (err: any) {
    if (err.message === "Financial Contribution not found") {
      return NextResponse.json(
        { error: "Financial Contribution not found" },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }
}
