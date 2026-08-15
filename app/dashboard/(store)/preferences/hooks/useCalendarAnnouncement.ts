"use client";

import { calendarAnnouncementSeenAtom } from "@/app/dashboard/(store)/preferences/atoms";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

/**
 * Drives the calendar subscription announcement: the header strip and the dot
 * on every schedule button share this flag, so both disappear as soon as the
 * user dismisses the strip or opens a schedule popover.
 */
export const useCalendarAnnouncement = () => {
  const [seen, setSeen] = useAtom(calendarAnnouncementSeenAtom);
  const [mounted, setMounted] = useState(false);

  // Hydration guard: the stored value is only available on the client, so wait
  // for mount rather than flashing the banner at users who dismissed it.
  useEffect(() => {
    setMounted(true);
  }, []);

  const markSeen = useCallback(() => setSeen(true), [setSeen]);

  return { isVisible: mounted && !seen, markSeen };
};
