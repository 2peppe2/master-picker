"use client";

import { useAtom, type PrimitiveAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

/**
 * Drives a one-off announcement backed by a persisted "seen" flag. Every
 * surface of the same announcement shares the atom, so they all disappear
 * together as soon as the user acknowledges any of them.
 */
export const useAnnouncement = (seenAtom: PrimitiveAtom<boolean>) => {
  const [seen, setSeen] = useAtom(seenAtom);
  const [mounted, setMounted] = useState(false);

  // Hydration guard: the stored value is only available on the client, so wait
  // for mount rather than flashing the banner at users who dismissed it.
  useEffect(() => {
    setMounted(true);
  }, []);

  const markSeen = useCallback(() => setSeen(true), [setSeen]);

  return { isVisible: mounted && !seen, markSeen };
};
