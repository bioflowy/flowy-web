import { PrismaClient } from "@prisma/client";


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
// if (env.NODE_ENV === "test") {
//   globalForPrisma.prisma = vPrisma.client as any;
// }
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
    process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
