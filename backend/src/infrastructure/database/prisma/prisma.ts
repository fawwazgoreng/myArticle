import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@infra/database/generated/prisma/client";

const connectionString = process.env['DATABASE_URL'];

const adapter = new PrismaPg({connectionString});

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient({ 
  adapter, 
  log: ["query", "error", "info", "warn"] 
});

if (process.env["NODE_ENV"] !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;