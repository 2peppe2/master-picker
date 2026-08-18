"use server";

import LanguageSwitcher from "@/common/components/translate/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { landingPageProgramSelect } from "./queries";
import LandingClientPage from "@/features/landing/LandingClientPage";
import Header from "@/features/landing/components/Header";
import { prisma } from "@/lib/prisma";
import type { LandingQueryState } from "@/common/navigation/queryState";

interface LandingPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const getQueryValue = (value: string | string[] | undefined) => {
  if (typeof value === "string") return value;
  return null;
};

const LandingPage = async ({ searchParams }: LandingPageProps) => {
  const query = await searchParams;
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

  const initialSelection: LandingQueryState = {
    program: getQueryValue(query.program),
    year: getQueryValue(query.year),
    master: getQueryValue(query.master),
  };

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <div
        className={cn(
          "flex shrink-0 justify-end px-4 py-3 sm:px-6",
          "pt-[calc(0.75rem+env(safe-area-inset-top))]",
          "pe-[calc(1rem+env(safe-area-inset-right))]",
          "landscape-phone:py-2",
        )}
      >
        <LanguageSwitcher />
      </div>

      <main
        className={cn(
          "mx-auto flex w-full max-w-4xl flex-1 flex-col items-center",
          "justify-center gap-8 px-4 pb-16 text-center",
          "landscape-phone:max-w-3xl landscape-phone:gap-4",
          "landscape-phone:px-6 landscape-phone:pb-4",
        )}
      >
        <Header />
        <LandingClientPage
          programs={formattedPrograms}
          initialSelection={initialSelection}
        />
      </main>
    </div>
  );
};

export default LandingPage;
