"use client";

import { compatibleDragSemestersAtom } from "@/features/dashboard/state/drag/atoms";
import {
  autoExpandedSemestersAtom,
  autoOpenSemesterAtom,
  closeAutoExpandedSemesterAtom,
  expandedSemestersAtom,
} from "@/features/dashboard/state/semester-ui/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

const OPEN_DELAY_MS = 300;
const CLOSE_DELAY_MS = 150;

export const getCompatibleHoveredSemester = (
  hoveredSemester: number | null,
  compatibleSemesterNumbers: ReadonlySet<number>,
) => {
  if (
    hoveredSemester !== null &&
    compatibleSemesterNumbers.has(hoveredSemester)
  ) {
    return hoveredSemester;
  }
  return null;
};

export const shouldAutoOpenSemester = (
  hoveredSemester: number | null,
  expandedSemesters: number[],
) =>
  hoveredSemester !== null && !expandedSemesters.includes(hoveredSemester + 1);

/** Auto-expands compatible semesters while dragging and closes abandoned ones. */
export const useDragSemesterAutoExpand = () => {
  const compatibleSemesters = useAtomValue(compatibleDragSemestersAtom);
  const expandedSemesters = useAtomValue(expandedSemestersAtom);
  const autoExpandedSemesters = useAtomValue(autoExpandedSemestersAtom);
  const autoOpenSemester = useSetAtom(autoOpenSemesterAtom);
  const closeAutoExpandedSemester = useSetAtom(closeAutoExpandedSemesterAtom);
  const [hoveredSemester, setHoveredSemester] = useState<number | null>(null);
  const hoveredSemesterRef = useRef<number | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimersRef = useRef(new Map<number, number>());

  const clearOpenTimer = () => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  };

  const clearCloseTimer = (semester: number) => {
    const timer = closeTimersRef.current.get(semester);
    if (timer !== undefined) window.clearTimeout(timer);
    closeTimersRef.current.delete(semester);
  };

  useEffect(() => {
    if (compatibleSemesters.length === 0) {
      hoveredSemesterRef.current = null;
      setHoveredSemester(null);
      return;
    }

    const compatibleSemesterNumbers = new Set(
      compatibleSemesters.map(({ semesterNumber }) => semesterNumber),
    );
    const handlePointerMove = (event: PointerEvent) => {
      const semester = [
        ...document.querySelectorAll<HTMLElement>("[data-semester-index]"),
      ].find((element) => {
        const rect = element.getBoundingClientRect();
        return (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        );
      });
      const nextSemester = semester
        ? Number(semester.dataset.semesterIndex)
        : null;
      const compatibleSemester = getCompatibleHoveredSemester(
        nextSemester,
        compatibleSemesterNumbers,
      );

      if (hoveredSemesterRef.current === compatibleSemester) return;
      hoveredSemesterRef.current = compatibleSemester;
      setHoveredSemester(compatibleSemester);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [compatibleSemesters]);

  useEffect(() => {
    clearOpenTimer();

    if (hoveredSemester !== null) {
      // Re-entering is a fresh interaction and cancels that term's pending close.
      clearCloseTimer(hoveredSemester);

      if (shouldAutoOpenSemester(hoveredSemester, expandedSemesters)) {
        const semesterToOpen = hoveredSemester;
        openTimerRef.current = window.setTimeout(() => {
          if (hoveredSemesterRef.current === semesterToOpen) {
            autoOpenSemester(semesterToOpen + 1);
          }
        }, OPEN_DELAY_MS);
      }
    }

    autoExpandedSemesters.forEach(({ semester }) => {
      const semesterNumber = semester - 1;
      if (semesterNumber === hoveredSemester) return;

      if (closeTimersRef.current.has(semester)) return;

      closeTimersRef.current.set(
        semester,
        window.setTimeout(() => {
          closeTimersRef.current.delete(semester);
          closeAutoExpandedSemester(semester);
        }, CLOSE_DELAY_MS),
      );
    });

    return clearOpenTimer;
  }, [
    autoExpandedSemesters,
    autoOpenSemester,
    closeAutoExpandedSemester,
    expandedSemesters,
    hoveredSemester,
  ]);

  useEffect(
    () => () => {
      clearOpenTimer();
      closeTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      closeTimersRef.current.clear();
    },
    [],
  );
};
