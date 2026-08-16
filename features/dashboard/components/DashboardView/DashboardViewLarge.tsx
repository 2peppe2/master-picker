"use client";

import { cn } from "@/lib/utils";

import MastersRequirementsBar from "../MastersRequirementsBar";
import DashboardBanner from "./components/DashboardBanner";
import SettingsModal from "./components/SettingsModal";
import Schedule from "../Schedule";
import Drawer from "../Drawer";
import { FC, useState } from "react";

const DashboardViewLarge: FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div
      className={cn(
        "relative grid w-full flex-1",
        "grid-cols-[400px_minmax(0,1fr)] items-start",
        "overflow-hidden [--dashboard-sidebar-width:400px]",
        "2xl:grid-cols-[550px_minmax(0,1fr)]",
        "2xl:[--dashboard-sidebar-width:550px]",
      )}
    >
      <aside
        className={cn(
          "sticky top-0 z-20 h-full overflow-hidden border-r",
          "border-primary/10 bg-card",
        )}
      >
        <Drawer />
      </aside>

      <main
        className={cn(
          "relative flex h-full min-w-0 w-full flex-col",
          "overflow-hidden bg-background",
        )}
      >
        <div
          data-dashboard-schedule-scroll
          className="flex flex-1 flex-col overflow-y-auto bg-background"
        >
          <div
            data-dashboard-schedule-sticky-header
            className={cn(
              "sticky top-0 z-30 shrink-0 border-b border-border/50",
              "bg-card",
            )}
          >
            <DashboardBanner />
            <div
              className={cn(
                "flex items-center gap-4 border-b bg-card px-6 py-4",
                "xl:px-8",
              )}
            >
              <div className="flex-1 min-w-0">
                <MastersRequirementsBar />
              </div>
              <SettingsModal
                isOpen={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 px-4 py-6 xl:px-8 xl:py-8">
            <Schedule />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardViewLarge;
