"use client";

import { useAnnouncement } from "@/common/hooks/useAnnouncement";
import { calendarAnnouncementSeenAtom } from "../atoms";

/**
 * Drives the calendar subscription announcement: the dot on every schedule
 * button shares this flag, so they all disappear as soon as the user opens a
 * schedule popover.
 */
export const useCalendarAnnouncement = () =>
  useAnnouncement(calendarAnnouncementSeenAtom);
