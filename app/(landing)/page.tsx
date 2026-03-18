"use server";

import { landingPageProgramSelect } from "./queries";
import LandingClientPage from "./LandingClientPage";
import Header from "./components/Header";
import { prisma } from "@/lib/prisma";

const LandingPage = async () => {
  const programs = await prisma.program.findMany({
    select: landingPageProgramSelect,
  });

  const formattedPrograms = programs.map((p) => ({
    program: p.program,
    name: p.name,
    shortname: p.shortname,
    years: p.programCourses
      .map((pc) => ({
        year: pc.startYear,
        masters: pc.requirements.map((r) => ({
          program: r.masterProgram,
          name: r.master.name,
        })),
      }))
      .sort((a, b) => a.year - b.year),
  }));

  return (
    <main className="flex flex-col items-center justify-center text-center px-4 pt-16 pb-8">
      <Header />
      <LandingClientPage programs={formattedPrograms} />
    </main>
  );
};

export default LandingPage;
