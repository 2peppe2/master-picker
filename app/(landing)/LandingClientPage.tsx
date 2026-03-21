"use client";

import { useGeneratePrefilledSchedule } from "@/app/dashboard/(store)/schedule/hooks/useGeneratePrefilledSchedule";
import { serializeSchedule } from "@/app/dashboard/(store)/schedule/utils";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { getBachelorCourses } from "../actions/getBachelorCourses";
import { useRouter, useSearchParams } from "next/navigation";
import ProgramSelector from "./components/ProgramSelector";
import { normalizeCourse } from "@/app/courseNormalizer";
import MasterSelector from "./components/MasterSelector";
import YearSelector from "./components/YearSelector";
import LoadingDots from "./components/LoadingDots";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";

export interface LandingPageProgram {
  program: string;
  name: string;
  shortname: string;
  years: {
    year: number;
    masters: {
      program: string;
      name: string | null;
    }[];
  }[];
}

interface LandingClientPageProps {
  programs: LandingPageProgram[];
}

const LandingClientPage: FC<LandingClientPageProps> = ({ programs }) => {
  const t = useCommonTranslate();
  const generateGrid = useGeneratePrefilledSchedule();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [program, setProgram] = useState(searchParams.get("program"));
  const [master, setMaster] = useState(searchParams.get("master"));
  const [year, setYear] = useState(searchParams.get("year"));

  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);

  useEffect(() => {
    setProgram(searchParams.get("program"));
    setMaster(searchParams.get("master"));
    setYear(searchParams.get("year"));
  }, [searchParams]);

  const activeProgram = useMemo(
    () => programs.find((p) => p.program === program) ?? null,
    [programs, program],
  );

  const handleOnPickLater = useCallback(async () => {
    if (!program || !year) {
      return;
    }

    setIsLoadingDashboard(true);

    try {
      const bachelorCourses = (
        await getBachelorCourses(program, parseInt(year))
      ).map((c) => normalizeCourse(c));

      const coursesMap = Object.fromEntries(
        bachelorCourses.map((c) => [c.code, c]),
      );
      const newGrid = generateGrid({ courses: bachelorCourses });

      const compressed = serializeSchedule(coursesMap, newGrid);

      const params = new URLSearchParams({ program, year });
      if (compressed) {
        params.set("schedule", compressed);
      }

      router.push(`/dashboard?${params.toString()}`);
    } catch (error) {
      console.error("Prefill failed:", error);
      router.push(`/dashboard?program=${program}&year=${year}`);
    }
  }, [program, year, router, generateGrid]);

  const handleOnGetStarted = useCallback(() => {
    setIsLoadingGuide(true);
    router.push(`/guide?program=${program}&year=${year}&master=${master}`);
  }, [master, program, router, year]);

  if (!programs) {
    return (
      <>
        {t("no_programs_found")}
      </>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 relative">
      <ProgramSelector programs={programs} />

      <div
        className={`transition-all duration-300 ease-in-out ${
          program
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <YearSelector activeProgram={activeProgram} />
      </div>

      <div
        className={`flex flex-col items-center gap-2 transition-all duration-300 ease-in-out ${
          year
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <MasterSelector
          activeProgram={activeProgram}
          isLoading={isLoadingDashboard}
          onPickLater={handleOnPickLater}
        />
      </div>

      <Button
        onClick={handleOnGetStarted}
        className="w-80 h-12 text-lg"
        disabled={!master || isLoadingGuide}
      >
        {isLoadingGuide && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoadingGuide ? (
          <LoadingDots text={t("running_to_guide")} />
        ) : (
          t("get_started")
        )}
      </Button>

      <Button variant="link" asChild>
        <Link href="/about">
          {t("learn_more_about_the_project")}
        </Link>
      </Button>
    </div>
  );
};

export default LandingClientPage;
