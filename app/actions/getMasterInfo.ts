"use server";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getMasterInfo = cache(async (masterID: string, program: string) => {
  const master = await prisma.master.findUnique({
    where: { master_masterProgram: { master: masterID, masterProgram: program } },
  });
  return master;
});
