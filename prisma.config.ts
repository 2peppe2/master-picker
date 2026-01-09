import path from "path";
import { PrismaConfig, env } from "prisma/config";

export default {
  schema: path.join("prisma", "schema.prisma"),
  datasource: { 
    url: env("DATABASE_URL")
    
  }
} satisfies PrismaConfig;

