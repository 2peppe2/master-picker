"use client";

import { useEffect, useState } from "react";

export const useDelayedUnmount = (open: boolean, delayMs: number) => {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const timeout = window.setTimeout(() => setMounted(false), delayMs);
    return () => window.clearTimeout(timeout);
  }, [delayMs, open]);

  return mounted;
};
