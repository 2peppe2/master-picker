"use client";

import { useCalendarAnnouncement } from "@/features/dashboard/state/preferences/hooks/useCalendarAnnouncement";
import {
  useIsLandscapePhone,
  usePrefersSheet,
} from "@/common/hooks/useResponsiveLayout";
import TimeEditSemesterLandscape from "./TimeEditSemesterLandscape";
import TimeEditSemesterSmall from "./TimeEditSemesterSmall";
import TimeEditSemesterLarge from "./TimeEditSemesterLarge";
import { useCalendarLinks } from "./hooks/useCalendarLinks";
import { TimeEditSemesterButtonProps } from "./types";
import { FC, useCallback, useState } from "react";

const TimeEditSemesterButton: FC<TimeEditSemesterButtonProps> = ({
  periods,
  semester,
  year,
}) => {
  const prefersSheet = usePrefersSheet();
  const isLandscapePhone = useIsLandscapePhone();
  const { isVisible: isAnnouncementVisible, markSeen } =
    useCalendarAnnouncement();

  const [isOpen, setIsOpen] = useState(false);
  const { links, isLoading, errorKey, loadLinks, hasCourses } = useCalendarLinks(
    { periods, semester, year },
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);

      if (open) {
        void loadLinks();
        // Opening the calendar options counts as seeing the announcement.
        markSeen();
      }
    },
    [loadLinks, markSeen],
  );

  if (isLandscapePhone) {
    return (
      <TimeEditSemesterLandscape
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        links={links}
        isLoading={isLoading}
        errorKey={errorKey}
        hasCourses={hasCourses}
        showAnnouncement={isAnnouncementVisible}
      />
    );
  }

  return prefersSheet ? (
    <TimeEditSemesterSmall
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      links={links}
      isLoading={isLoading}
      errorKey={errorKey}
      hasCourses={hasCourses}
      showAnnouncement={isAnnouncementVisible}
    />
  ) : (
    <TimeEditSemesterLarge
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      links={links}
      isLoading={isLoading}
      errorKey={errorKey}
      hasCourses={hasCourses}
      showAnnouncement={isAnnouncementVisible}
    />
  );
};

export default TimeEditSemesterButton;
