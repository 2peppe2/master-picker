"use client";

import { getBachelorCourses } from "@/app/actions/getBachelorCourses";
import { normalizeCourse } from "@/common/courseNormalizer";
import { useLanguage } from "@/common/components/translate/hooks/useLanguage";
import { QUERY_PARAM } from "@/common/navigation/queryState";
import { useGeneratePrefilledSchedule } from "@/features/dashboard/state/schedule/hooks/useGeneratePrefilledSchedule";
import { serializeSchedule } from "@/features/dashboard/state/schedule/utils";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface UseLandingNavigationArgs {
  master: string | null;
  program: string | null;
  year: string | null;
}

export const useLandingNavigation = ({
  master,
  program,
  year,
}: UseLandingNavigationArgs) => {
  const generateGrid = useGeneratePrefilledSchedule();
  const language = useLanguage();
  const router = useRouter();
  const [destination, setDestination] = useState<"dashboard" | "guide" | null>(
    null,
  );

  const pickLater = useCallback(async () => {
    if (!program || !year) return;
    setDestination("dashboard");
    try {
      const startingYear = parseInt(year);
      const bachelorCourses = (
        await getBachelorCourses(program, startingYear)
      ).map(normalizeCourse);
      const coursesMap = Object.fromEntries(
        bachelorCourses.map((course) => [course.code, course]),
      );
      const grid = generateGrid({ courses: bachelorCourses, startingYear });
      const compressed = serializeSchedule(coursesMap, grid);
      const params = new URLSearchParams({
        [QUERY_PARAM.program]: program,
        [QUERY_PARAM.year]: year,
        [QUERY_PARAM.language]: language,
      });
      if (compressed) params.set(QUERY_PARAM.schedule, compressed);
      router.push(`/dashboard?${params.toString()}`);
    } catch (error) {
      console.error("Prefill failed:", error);
      router.push(`/dashboard?program=${program}&year=${year}&lang=${language}`);
    } finally {
      setDestination(null);
    }
  }, [generateGrid, language, program, router, year]);

  const getStarted = useCallback(() => {
    if (!program || !year || !master) return;
    setDestination("guide");
    const params = new URLSearchParams({
      [QUERY_PARAM.program]: program,
      [QUERY_PARAM.year]: year,
      [QUERY_PARAM.master]: master,
      [QUERY_PARAM.language]: language,
    });
    router.push(`/guide?${params.toString()}`);
  }, [language, master, program, router, year]);

  return { destination, getStarted, pickLater };
};
