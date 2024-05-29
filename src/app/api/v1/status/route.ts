import { NextResponse } from "next/server";
import { query } from "../../../../models/database";
import {
  IDatabaseMaxConnections,
  IDatabaseOpennedConnections,
  IServerVersion,
} from "@/utils/databaseInterfaces";

export async function GET(request: Request) {
  const databaseVersion = (await query(
    "SHOW SERVER_VERSION;",
  )) as IServerVersion[];
  const databaseMaxConnections = (await query(
    "SHOW MAX_CONNECTIONS;",
  )) as IDatabaseMaxConnections[];
  const databaseName = getDatabaseName();
  const databaseOpennedConections = (await query(
    `SELECT COUNT(*)::int FROM pg_stat_activity where datname = '${databaseName}';`,
  )) as IDatabaseOpennedConnections[];

  return NextResponse.json(
    {
      updated_at: new Date().toISOString(),
      dependencies: {
        database: {
          version: databaseVersion[0].server_version,
          max_connections: parseInt(databaseMaxConnections[0].max_connections),
          opennedConnections: databaseOpennedConections[0].count,
        },
      },
    },
    { status: 200 },
  );
}

function getDatabaseName() {
  return process.env.NODE_ENV === "development"
    ? process.env.POSTGRES_DB
    : process.env.DATABASE_URL?.match(/church-plus-\w{7,10}/gi);
}
