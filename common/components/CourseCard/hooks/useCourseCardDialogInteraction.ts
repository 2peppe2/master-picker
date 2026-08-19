"use client";

import { useCallback, useState, type MouseEvent } from "react";
import { isCourseCardInteractionBarrier } from "../interactionBarrier";

const isInteractiveElement = (target: EventTarget | null) =>
  target instanceof Element && Boolean(target.closest("button, a"));

export const useCourseCardDialogInteraction = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const openCourseDialog = useCallback(() => setOpenDialog(true), []);
  const handleCoarsePointerCardClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.defaultPrevented) return;
      if (!window.matchMedia("(pointer: coarse)").matches) return;
      if (isCourseCardInteractionBarrier(event.target)) return;
      if (isInteractiveElement(event.target)) return;
      setOpenDialog(true);
    },
    [],
  );

  return {
    openDialog,
    setOpenDialog,
    openCourseDialog,
    handleCoarsePointerCardClick,
  };
};
