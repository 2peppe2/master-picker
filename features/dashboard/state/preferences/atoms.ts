import { atomWithReset, atomWithStorage } from "jotai/utils";
import { MasterPeriod } from "../types";

export const masterPeriodAtom = atomWithReset<MasterPeriod>({
  start: 7,
  end: 10,
});
export const showBachelorYearsAtom = atomWithReset<boolean>(false);

/**
 * Whether the user has seen the calendar subscription announcement. Versioned
 * so a later announcement can reuse the banner with a fresh key.
 */
export const calendarAnnouncementSeenAtom = atomWithStorage(
  "mp:seen:calendar-subscribe:v1",
  false,
);

export type PhoneScheduleLayout = "grid" | "carousel";

/**
 * Phone-only: whether a period's blocks stack two per row or scroll sideways.
 * Wider viewports keep their own breakpoint layouts regardless of this value.
 */
export const phoneScheduleLayoutAtom = atomWithStorage<PhoneScheduleLayout>(
  "mp:pref:phone-schedule-layout:v1",
  "grid",
);
