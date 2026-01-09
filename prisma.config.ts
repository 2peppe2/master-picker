import "dotenv/config";
import path from "path";
import { PrismaConfig, env } from "prisma/config";

export default {
  schema: path.join("prisma"),
  datasource: { 
    url: env("DATABASE_URL")
    
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
} satisfies PrismaConfig;



