import { getFinancialContributionById } from "@/models/financialContribution";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { contributionId: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const contributionId: string = params.contributionId;

  if (!contributionId)
    return NextResponse.json(
      { error: "Missing contribution_id" },
      { status: 400 },
    );

  try {
    const contribution = await getFinancialContributionById(
      contributionId,
      session.user.id,
    );

    if (!contribution) {
      return NextResponse.json(
        { error: "Contribution not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ contribution }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
