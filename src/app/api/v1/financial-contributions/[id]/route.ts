import {
  deleteFinancialContribution,
  getMemberContributions,
  updateFinancialContribution,
} from "@/models/financialContribution";
import { IFinancialContributionPutRequest } from "@/models/modelsInterfaces";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const id: string = params.id;

  if (!id)
    return NextResponse.json({ error: "Missing member_id" }, { status: 400 });

  try {
    const contributions = await getMemberContributions(id, session.user.id);

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
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

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
      session.user.id,
    );

    return NextResponse.json({ updatedFinancialContribution }, { status: 200 });
  } catch (err: any) {
    if (err.message === "Malformed financial contribution id") {
      return NextResponse.json({ error: err.message }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const id = params.id;

  if (id === undefined || id === null || id === "")
    return NextResponse.json(
      { error: "Missing financial contribution id" },
      { status: 400 },
    );

  try {
    await deleteFinancialContribution(id, session.user.id);
    return NextResponse.json(
      { message: "Financial contribution deleted." },
      { status: 200 },
    );
  } catch (err: any) {
    let status = 500;
    let errorMessage = "Internal Server Error";

    if (err.message === "Malformed financial contribution id") {
      status = 400;
      errorMessage = "Malformed financial contribution id";
    } else if (err.message.includes("Record to delete does not exist.")) {
      status = 404;
      errorMessage = "Record to delete does not exist.";
    }

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
