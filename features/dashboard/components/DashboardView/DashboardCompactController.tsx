"use client";

import { cn } from "@/lib/utils";

import { useCompactCourseAddedFeedback } from "@/common/hooks/useCourseAddedFeedback";
import { FC, useCallback, useState } from "react";
import { DashboardTabProvider } from "./DashboardTabContext";
import DashboardHeader from "./components/DashboardHeader";
import MobileTabs from "./components/MobileTabs";
import DashboardViewSmall from "./DashboardViewSmall";
import { usePhoneTabSwipe } from "./hooks/usePhoneTabSwipe";
import type { DashboardTab } from ".";

const DashboardCompactController: FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("schedule");
  const revealSchedule = useCallback(() => setActiveTab("schedule"), []);
  const swipeHandlers = usePhoneTabSwipe({ activeTab, setActiveTab });

  useCompactCourseAddedFeedback({ onRevealSchedule: revealSchedule });

  return (
    <DashboardTabProvider activeTab={activeTab} setActiveTab={setActiveTab}>
      <div
        className={cn(
          "flex h-[100dvh] w-full flex-col overflow-hidden",
          "bg-background",
        )}
      >
        <DashboardHeader />
        <div
          className={cn(
            "flex min-h-0 flex-1 touch-pan-y flex-col",
            "overflow-hidden overscroll-x-contain",
          )}
          data-dashboard-swipe-surface="true"
          {...swipeHandlers}
        >
          <DashboardViewSmall />
        </div>
        <MobileTabs />
      </div>
    </DashboardTabProvider>
  );
};

export default DashboardCompactController;
