import "dotenv/config";
import path from "path";
import { PrismaConfig, env } from "prisma/config";

export default {
  schema: path.join("prisma", "groups", "schema.prisma"),
  datasource: {
    url: env("GROUPS_DATABASE_URL"),
  },
} satisfies PrismaConfig;
