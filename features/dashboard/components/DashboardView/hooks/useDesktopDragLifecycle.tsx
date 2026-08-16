"use client";

import CourseCard from "@/common/components/CourseCard";
import type { Course } from "@/common/types";
import {
  clearDragAtom,
  draggedCourseAtom,
  setCompatibleDragSemestersAtom,
  setCurrentDropTargetIdAtom,
  setDraggedCourseAtom,
  setValidDropTargetIdsAtom,
} from "@/features/dashboard/state/drag/atoms";
import { getDragTargetFeedback } from "@/features/dashboard/state/drag/domain";
import { scheduleGridAtom } from "@/features/dashboard/state/schedule/atoms";
import {
  clearAutoExpandedSemestersAtom,
  retainAutoExpandedSemesterAtom,
} from "@/features/dashboard/state/semester-ui/atoms";
import { useStartingYear } from "@/features/dashboard/state/preferences/hooks/useStartingYear";
import type {
  OnDragEndArgs,
  OnDragOverArgs,
  OnDragStartArgs,
  OnRenderDraggedArgs,
} from "@/features/dashboard/components/DndProvider/types";
import type { PeriodNodeData } from "@/features/dashboard/components/Droppable";
import { useAtomValue, useSetAtom } from "jotai";
import { startTransition, useCallback, useEffect, useRef } from "react";
import { useCourseDropHandler } from "./useCourseDropHandler";

/** Owns transient desktop DnD state; the controller only composes the layout. */
/** Owns the desktop drag lifecycle and its transient target feedback. */
export const useDesktopDragLifecycle = () => {
  const draggedCourse = useAtomValue(draggedCourseAtom);
  const grid = useAtomValue(scheduleGridAtom);
  const startingYear = useStartingYear();
  const dropHandler = useCourseDropHandler();
  const setDraggedCourse = useSetAtom(setDraggedCourseAtom);
  const setValidDropTargetIds = useSetAtom(setValidDropTargetIdsAtom);
  const setCurrentDropTargetId = useSetAtom(setCurrentDropTargetIdAtom);
  const setCompatibleDragSemesters = useSetAtom(setCompatibleDragSemestersAtom);
  const clearDrag = useSetAtom(clearDragAtom);
  const retainAutoExpandedSemester = useSetAtom(retainAutoExpandedSemesterAtom);
  const clearAutoExpandedSemesters = useSetAtom(clearAutoExpandedSemestersAtom);
  const feedbackFrame = useRef<number | null>(null);

  const clearDragTargetFeedback = useCallback(() => {
    if (feedbackFrame.current !== null) {
      cancelAnimationFrame(feedbackFrame.current);
      feedbackFrame.current = null;
    }
    clearDrag();
  }, [clearDrag]);

  useEffect(
    () => () => {
      clearDragTargetFeedback();
      clearAutoExpandedSemesters();
    },
    [clearAutoExpandedSemesters, clearDragTargetFeedback],
  );

  const handleDragEnd = useCallback(
    (event: OnDragEndArgs) => {
      const overData = event.over?.data.current as PeriodNodeData | undefined;
      const wasDropped =
        Boolean(overData && draggedCourse) &&
        dropHandler.handleDrop({
          course: draggedCourse as Course,
          overData: overData as PeriodNodeData,
        });
      if (wasDropped && overData)
        retainAutoExpandedSemester(overData.semesterNumber + 1);
      else clearAutoExpandedSemesters();
      clearDragTargetFeedback();
    },
    [
      clearAutoExpandedSemesters,
      clearDragTargetFeedback,
      draggedCourse,
      dropHandler,
      retainAutoExpandedSemester,
    ],
  );

  const handleDragStart = useCallback(
    (event: OnDragStartArgs<Course>) => {
      if (!event.active) return;
      const course = event.active;
      setCurrentDropTargetId(null);
      feedbackFrame.current = requestAnimationFrame(() => {
        feedbackFrame.current = null;
        const feedback = getDragTargetFeedback({ course, grid, startingYear });
        setDraggedCourse(course);
        startTransition(() => {
          setValidDropTargetIds(feedback.validTargetIds);
          setCompatibleDragSemesters(feedback.compatibleSemesters);
        });
      });
    },
    [
      grid,
      setCompatibleDragSemesters,
      setCurrentDropTargetId,
      setDraggedCourse,
      setValidDropTargetIds,
      startingYear,
    ],
  );

  const handleDragOver = useCallback(
    (event: OnDragOverArgs) => {
      setCurrentDropTargetId(event.over ? String(event.over.id) : null);
    },
    [setCurrentDropTargetId],
  );

  const handleDragCancel = useCallback(() => {
    clearAutoExpandedSemesters();
    clearDragTargetFeedback();
  }, [clearAutoExpandedSemesters, clearDragTargetFeedback]);

  const handleRenderDragged = useCallback(
    ({ active }: OnRenderDraggedArgs<Course>) => (
      <CourseCard variant="dragged" course={active} />
    ),
    [],
  );

  return {
    ...dropHandler,
    handleDragEnd,
    handleDragStart,
    handleDragOver,
    handleDragCancel,
    handleRenderDragged,
  };
};
