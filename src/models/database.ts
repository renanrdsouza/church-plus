import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "./db";

export async function query(query: string) {
  const preparedQuery = Prisma.sql([query]);

  try {
    const result = await prisma.$queryRaw(preparedQuery);
    return result;
  } catch (error) {
    console.error("An error occurred during query execution: ", error);
  } finally {
    await prisma.$disconnect();
  }
}
