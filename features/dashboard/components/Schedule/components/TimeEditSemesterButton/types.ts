import { Slot } from "@/features/dashboard/state/schedule/types";

export interface CalendarLinks {
  timeEditUrl: string;
  icsUrl: string;
  webcalUrl: string;
  googleUrl: string;
}

export interface TimeEditSemesterButtonProps {
  periods: Slot[][];
  semester: "HT" | "VT";
  year: number;
}

/**
 * Plain data, so each presentation renders its own trigger and rows rather
 * than receiving prebuilt elements that change identity on every render.
 */
export interface CalendarViewProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  links: CalendarLinks | null;
  isLoading: boolean;
  errorKey: string | null;
  hasCourses: boolean;
  showAnnouncement: boolean;
}
