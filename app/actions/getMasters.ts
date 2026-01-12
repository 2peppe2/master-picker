"use server"
import { prisma } from "@/lib/prisma";
import { MasterWithRequirements } from "../(main)/page";

export async function getMasters() {
  const masters = await prisma.master.findMany();
  return masters;
}



export async function getMastersWithRequirements() : Promise<MasterWithRequirements[]> {
  const masters = await prisma.master.findMany({
    include: {
    requirements: {
      include: {
        creditRequirements: { select: {credits: true , type: true}},
        courseRequirements: { select: {courses: true, }}
      }
    }
  }
  });
  return masters;
}