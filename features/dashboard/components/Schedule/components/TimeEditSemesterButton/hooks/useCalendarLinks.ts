"use client";

import { Slot } from "@/features/dashboard/state/schedule/types";
import { useCallback, useMemo, useRef, useState } from "react";
import { CalendarLinks } from "../types";

interface UseCalendarLinksArgs {
  periods: Slot[][];
  semester: "HT" | "VT";
  year: number;
}

/**
 * Resolves this semester's courses to calendar subscription URLs, refetching
 * only once the course set actually changes.
 */
export const useCalendarLinks = ({
  periods,
  semester,
  year,
}: UseCalendarLinksArgs) => {
  const [isLoading, setIsLoading] = useState(false);
  const [links, setLinks] = useState<CalendarLinks | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  // The course set the currently held links were resolved for.
  const resolvedForRef = useRef<string | null>(null);

  // `<period>:<code>`, so the API can pick the occasion for the period the
  // course is scheduled in rather than every occasion in the semester.
  const courseRequests = useMemo(
    () =>
      Array.from(
        new Set(
          periods.flatMap((blocks, periodIndex) =>
            blocks
              .filter((course) => course !== null)
              .map((course) => `${periodIndex + 1}:${course.code}`),
          ),
        ),
      ),
    [periods],
  );

  const searchParams = useMemo(() => {
    const params = new URLSearchParams({ semester, year: year.toString() });
    courseRequests.forEach((request) => params.append("course", request));

    return params.toString();
  }, [courseRequests, semester, year]);

  const loadLinks = useCallback(async () => {
    if (resolvedForRef.current === searchParams) return;

    setIsLoading(true);
    setErrorKey(null);

    try {
      const response = await fetch(`/api/timeedit/semester-url?${searchParams}`);

      if (!response.ok) {
        setLinks(null);
        setErrorKey(
          response.status === 404 ? "_timeedit_no_matches" : "_timeedit_error",
        );
        return;
      }

      setLinks((await response.json()) as CalendarLinks);
      resolvedForRef.current = searchParams;
    } catch {
      setLinks(null);
      setErrorKey("_timeedit_error");
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  return {
    links,
    isLoading,
    errorKey,
    loadLinks,
    hasCourses: courseRequests.length > 0,
  };
};
