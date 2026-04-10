import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma/generated/groups-client/client";

const connectionString = process.env.GROUPS_DATABASE_URL;

if (!connectionString) {
  throw new Error("GROUPS_DATABASE_URL is not set.");
}

const adapter = new PrismaPg({ connectionString });
const groupsPrisma = new PrismaClient({ adapter });

export { groupsPrisma };
