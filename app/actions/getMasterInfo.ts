"use server";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getMasterInfo = cache(async (masterID: string) => {
  const master = await prisma.master.findUnique({
    where: { master: masterID },
  });
  return master;
});
