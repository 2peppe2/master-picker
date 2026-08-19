"use client";

import { useEffect, useRef } from "react";

export const useDelayedHoverOpen = (
  onOpenChange: (open: boolean) => void,
  closeDelay = 150,
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpenChange(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => onOpenChange(false), closeDelay);
  };

  return { handleMouseEnter, handleMouseLeave };
};
