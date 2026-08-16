"use client";

import { useGeneratePrefilledSchedule } from "@/features/dashboard/state/schedule/hooks/useGeneratePrefilledSchedule";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { FC, useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useLanguage } from "@/common/components/translate/hooks/useLanguage";
import { serializeSchedule } from "@/features/dashboard/state/schedule/utils";
import { getBachelorCourses } from "@/app/actions/getBachelorCourses";
import Translate from "@/common/components/translate/Translate";
import { useRouter, useSearchParams } from "next/navigation";
import ProgramSelector from "@/features/landing/components/ProgramSelector";
import MasterSelector from "@/features/landing/components/MasterSelector";
import YearSelector from "@/features/landing/components/YearSelector";
import LoadingDots from "@/features/landing/components/LoadingDots";
import { Button } from "@/components/ui/button";
import { LandingFormLoading } from "@/app/(landing)/loading";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { normalizeCourse } from "@/common/courseNormalizer";
import {
  LandingQueryState,
  QUERY_PARAM,
  readLandingQuery,
  updateLandingQuery,
} from "@/common/navigation/queryState";

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

const LandingClientContent: FC<LandingClientPageProps> = ({ programs }) => {
  const generateGrid = useGeneratePrefilledSchedule();
  const searchParams = useSearchParams();
  const translate = useCommonTranslate();
  const language = useLanguage();
  const router = useRouter();

  const [selection, setSelection] = useState<LandingQueryState>(() =>
    readLandingQuery(searchParams),
  );
  const { program, master, year } = selection;

  const [destination, setDestination] = useState<"dashboard" | "guide" | null>(null);
  const isLoadingDashboard = destination === "dashboard";
  const isLoadingGuide = destination === "guide";

  const updateSelection = useCallback((next: LandingQueryState) => {
    setSelection(next);

    const params = updateLandingQuery(
      new URLSearchParams(window.location.search),
      next,
    );
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;

    window.history.replaceState(window.history.state, "", nextUrl);
  }, []);

  useEffect(() => {
    const syncSelectionFromUrl = () => {
      setSelection(readLandingQuery(new URLSearchParams(window.location.search)));
    };

    window.addEventListener("popstate", syncSelectionFromUrl);
    return () => window.removeEventListener("popstate", syncSelectionFromUrl);
  }, []);

  const activeProgram = useMemo(
    () => programs.find((p) => p.program === program) ?? null,
    [programs, program],
  );

  const handleOnPickLater = useCallback(async () => {
    if (!program || !year) {
      return;
    }

    setDestination("dashboard");

    try {
      const startingYear = parseInt(year);
      const bachelorCourses = (
        await getBachelorCourses(program, startingYear)
      ).map((c) => normalizeCourse(c));

      const coursesMap = Object.fromEntries(
        bachelorCourses.map((c) => [c.code, c]),
      );
      const newGrid = generateGrid({ courses: bachelorCourses, startingYear });

      const compressed = serializeSchedule(coursesMap, newGrid);

      const params = new URLSearchParams({
        [QUERY_PARAM.program]: program,
        [QUERY_PARAM.year]: year,
        [QUERY_PARAM.language]: language,
      });
      if (compressed) {
        params.set(QUERY_PARAM.schedule, compressed);
      }

      router.push(`/dashboard?${params.toString()}`);
    } catch (error) {
      console.error("Prefill failed:", error);
      router.push(
        `/dashboard?program=${program}&year=${year}&lang=${language}`,
      );
    } finally {
      setDestination(null);
    }
  }, [program, year, router, generateGrid, language]);

  const handleOnGetStarted = useCallback(() => {
    if (!program || !year || !master) {
      return;
    }

    setDestination("guide");

    const params = new URLSearchParams({
      [QUERY_PARAM.program]: program,
      [QUERY_PARAM.year]: year,
      [QUERY_PARAM.master]: master,
      [QUERY_PARAM.language]: language,
    });

    router.push(`/guide?${params.toString()}`);
  }, [master, program, router, year, language]);

  if (!programs) {
    return <Translate text="no_programs_found" />;
  }

  return (
    <div className="relative flex w-full flex-col items-center gap-8">
      <div className="w-full">
        <ProgramSelector
          programs={programs}
          value={program}
          onValueChange={(nextProgram) =>
            updateSelection({
              program: nextProgram,
              year: null,
              master: null,
            })
          }
        />
      </div>

      <div
        className={`w-full transition-all duration-300 ease-in-out ${
          program
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <YearSelector
          activeProgram={activeProgram}
          value={year}
          onValueChange={(nextYear) =>
            updateSelection({
              program,
              year: nextYear,
              master: null,
            })
          }
        />
      </div>

      <div
        className={`flex w-full flex-col items-center gap-2 transition-all duration-300 ease-in-out ${
          year
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <MasterSelector
          activeProgram={activeProgram}
          year={year}
          value={master}
          onValueChange={(nextMaster) =>
            updateSelection({
              program,
              year,
              master: nextMaster,
            })
          }
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
          <LoadingDots text={translate("running_to_guide")} />
        ) : (
          <Translate text="get_started" />
        )}
      </Button>

      <Button variant="link" asChild>
        <Link href="/about">
          <Translate text="learn_more_about_the_project" />
        </Link>
      </Button>
    </div>
  );
};

const LandingClientPage: FC<LandingClientPageProps> = (props) => (
  <Suspense fallback={<LandingFormLoading />}>
    <LandingClientContent {...props} />
  </Suspense>
);

export default LandingClientPage;
