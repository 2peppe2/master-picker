"use server"
import { prisma } from "@/lib/prisma";

export async function getMasterInfo(masterID: string) {
  const master = await prisma.master.findUnique({
    where: { master: masterID },
  });
  return master;
}