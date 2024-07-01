import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismaAdapter = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prismaAdapter

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prismaAdapter
