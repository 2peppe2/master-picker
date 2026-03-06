"use server";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getProgramId = cache(async (program: string, startYear: number) => {
    const programData = await prisma.programCourse.findFirst({
        where: {
            program,
            startYear,
        },
        select: {
            id: true,
        },
    });
    
    if (!programData || !programData.id) {
        throw new Error(`Program not found for program: ${program}, startYear: ${startYear}`);
    }
    return programData.id;
});
