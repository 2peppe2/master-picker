import { atomWithReset, atomWithStorage } from "jotai/utils";
import { MasterPeriod } from "../types";

export const preferenceAtoms = {
  masterPeriodAtom: atomWithReset<MasterPeriod>({ start: 7, end: 10 }),
  showBachelorYearsAtom: atomWithReset<boolean>(false),
};

/**
 * Whether the user has seen the calendar subscription announcement. Versioned
 * so a later announcement can reuse the banner with a fresh key.
 */
export const calendarAnnouncementSeenAtom = atomWithStorage(
  "mp:seen:calendar-subscribe:v1",
  false,
);
