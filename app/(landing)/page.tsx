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
    <div data-landing className="flex min-h-[100dvh] flex-col">
      {/* Dropped on landscape phones: the bar costs a whole row of ~375px, and
          the switcher is still reachable from /about and /guide. */}
      <div
        className={cn(
          "flex shrink-0 justify-end px-4 py-3 sm:px-6",
          "pt-[calc(0.75rem+env(safe-area-inset-top))]",
          "pe-[calc(1rem+env(safe-area-inset-right))]",
          "landscape-phone:hidden",
        )}
      >
        <LanguageSwitcher />
      </div>

      {/* Landscape phones split into two columns: stacking the header above the
          form spends the block axis, the only one that is scarce here. */}
      <main
        className={cn(
          "mx-auto flex w-full max-w-4xl flex-1 flex-col items-center",
          "justify-center gap-8 px-4 pb-16 text-center",
          "landscape-phone:max-w-2xl landscape-phone:flex-row",
          "landscape-phone:items-center landscape-phone:justify-center",
          "landscape-phone:gap-8 landscape-phone:px-6 landscape-phone:pb-4",
          "landscape-phone:text-left",
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
