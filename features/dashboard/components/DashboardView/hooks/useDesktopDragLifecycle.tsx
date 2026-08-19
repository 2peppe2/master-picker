"use client";

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
} from "@/features/dashboard/components/DndProvider/types";
import type { PeriodNodeData } from "@/features/dashboard/components/Droppable";
import { useSetAtom, useStore } from "jotai";
import { startTransition, useCallback, useEffect, useRef } from "react";
import { useCourseDropHandler } from "./useCourseDropHandler";
import { renderDraggedCourse } from "./renderDraggedCourse";

export const useDesktopDragLifecycle = () => {
  const store = useStore();
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
      const draggedCourse = store.get(draggedCourseAtom);
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
      dropHandler,
      retainAutoExpandedSemester,
      store,
    ],
  );

  const handleDragStart = useCallback(
    (event: OnDragStartArgs<Course>) => {
      if (!event.active) return;
      const course = event.active;
      setCurrentDropTargetId(null);
      feedbackFrame.current = requestAnimationFrame(() => {
        feedbackFrame.current = null;
        const feedback = getDragTargetFeedback({
          course,
          grid: store.get(scheduleGridAtom),
          startingYear,
        });
        setDraggedCourse(course);
        startTransition(() => {
          setValidDropTargetIds(feedback.validTargetIds);
          setCompatibleDragSemesters(feedback.compatibleSemesters);
        });
      });
    },
    [
      setCompatibleDragSemesters,
      setCurrentDropTargetId,
      setDraggedCourse,
      setValidDropTargetIds,
      startingYear,
      store,
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

  const handleRenderDragged = useCallback(renderDraggedCourse, []);

  return {
    ...dropHandler,
    handleDragEnd,
    handleDragStart,
    handleDragOver,
    handleDragCancel,
    handleRenderDragged,
  };
};
