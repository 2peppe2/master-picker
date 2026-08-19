"use client";

import { cn } from "@/lib/utils";

import { useDesktopCourseAddedFeedback } from "@/common/hooks/useCourseAddedFeedback";
import { FC, useCallback } from "react";
import { DashboardTabProvider } from "./DashboardTabContext";
import DashboardHeader from "./components/DashboardHeader";
import DashboardViewLandscape from "./DashboardViewLandscape";

/**
 * Dashboard shell for phones held in landscape.
 *
 * The viewport is too short to stack a header, a panel and a tab bar, so both
 * panels sit side by side and the tab bar is dropped entirely.
 */
const DashboardLandscapeController: FC = () => {
  const noop = useCallback(() => {}, []);

  useDesktopCourseAddedFeedback();

  return (
    <DashboardTabProvider activeTab="schedule" setActiveTab={noop}>
      <div
        // Scopes the reduced type scale defined in globals.css.
        data-dashboard-landscape
        className={cn(
          "flex h-[100dvh] w-full flex-col overflow-hidden",
          // The notch and home indicator sit on the long edges when rotated,
          // which is the one orientation nothing else in the app insets for.
          "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
          "pb-[env(safe-area-inset-bottom)]",
          "bg-background",
        )}
      >
        <DashboardHeader dense />
        <DashboardViewLandscape />
      </div>
    </DashboardTabProvider>
  );
};

export default DashboardLandscapeController;
