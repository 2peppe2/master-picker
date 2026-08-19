"use client";

import { shareButtonLoadingUntilAtom } from "@/features/dashboard/state/schedule/atoms";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export const useShareLoading = () => {
  const loadingUntil = useAtomValue(shareButtonLoadingUntilAtom);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const remaining = loadingUntil - Date.now();
    if (remaining <= 0) {
      setNow(Date.now());
      return;
    }
    const timeout = window.setTimeout(() => setNow(Date.now()), remaining);
    return () => window.clearTimeout(timeout);
  }, [loadingUntil]);

  return loadingUntil > now;
};
