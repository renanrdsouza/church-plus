import { NextResponse } from "next/server";
import { getDatabaseInfos } from "../../../services/databaseService";

export async function GET(request: Request) {
  const databaseInfo = await getDatabaseInfos();

  return NextResponse.json(
    {
      dependencies: {
        database: {
          version: databaseInfo?.version,
          max_connections: databaseInfo?.max_connections,
          opennedConnections: databaseInfo?.opennedConections
        },
      },
    },
    { status: 200 },
  );
}
