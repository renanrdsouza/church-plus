import {
  IDatabaseVersionRecord,
  IDatabaseMaxConnections,
  IDatabaseOpennedConnections,
} from "@/utils/databaseVersion";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDatabaseInfos() {
  try {
    const dbVersion = await prisma.$queryRaw<
      IDatabaseVersionRecord[]
    >`SHOW SERVER_VERSION`;
    const dbMaxConnections = await prisma.$queryRaw<
      IDatabaseMaxConnections[]
    >`SHOW MAX_CONNECTIONS`;
    const dbActiveConnections = await prisma.$queryRaw<
      IDatabaseOpennedConnections[]
    >`SELECT count(*)::int FROM pg_stat_activity;`;

    const queryResult = {
      version: dbVersion[0].server_version,
      max_connections: dbMaxConnections[0].max_connections,
      opennedConections: dbActiveConnections[0].count,
    };

    return queryResult;
  } catch (error) {
    console.error("Error on query: ", error);
  } finally {
    await prisma.$disconnect();
  }
}
