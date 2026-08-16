"use client";

import { useCallback, useEffect, useId, useRef } from "react";

const HISTORY_KEY = "__masterPickerCourseOverlay";

/** Keeps a phone dialog's open state aligned with browser history. */
export const useOverlayHistory = (
  open: boolean,
  onOpenChange: (open: boolean) => void,
) => {
  const markerRef = useRef<string | null>(null);
  const reactId = useId();

  useEffect(() => {
    if (!open) return;

    const marker = markerRef.current ?? `course-overlay-${reactId}`;
    markerRef.current = marker;
    if (window.history.state?.[HISTORY_KEY] !== marker) {
      window.history.pushState(
        { ...window.history.state, [HISTORY_KEY]: marker },
        "",
      );
    }

    const handlePopState = () => {
      if (markerRef.current !== marker) return;
      markerRef.current = null;
      onOpenChange(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [open, onOpenChange, reactId]);

  return useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        onOpenChange(true);
        return;
      }

      const marker = markerRef.current;
      if (marker && window.history.state?.[HISTORY_KEY] === marker) {
        const historyState = { ...window.history.state };
        delete historyState[HISTORY_KEY];
        window.history.replaceState(historyState, "");
      }

      markerRef.current = null;
      onOpenChange(false);
    },
    [onOpenChange],
  );
};
