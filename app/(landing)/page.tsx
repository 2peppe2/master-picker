"use server";

import LanguageSwitcher from "@/common/components/translate/LanguageSwitcher";
import { landingPageProgramSelect } from "./queries";
import LandingClientPage from "@/features/landing/LandingClientPage";
import Header from "@/features/landing/components/Header";
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
    <div className="relative min-h-screen">
      <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
        <LanguageSwitcher />
      </div>
      <main className="mb-16 flex flex-col items-center justify-center px-4 pt-24 text-center sm:mb-20 sm:pt-32">
        <Header />
        <LandingClientPage programs={formattedPrograms} />
      </main>
    </div>
  );
};

export default LandingPage;
