"use client";

import { cn } from "@/lib/utils";

import Schedule from "../Schedule";
import Drawer from "../Drawer";
import { FC } from "react";
import { useDashboardTabs } from "./DashboardTabContext";

const DashboardViewSmall: FC = () => {
  const { activeTab } = useDashboardTabs();

  return (
    <>
      <div
        className={cn(
          "relative flex w-full flex-1 flex-col items-start",
          "overflow-hidden",
        )}
      >
        <div
          className={cn(
            "flex h-full w-[200%] transition-transform",
            "duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            "motion-reduce:transition-none",
          )}
          style={{
            transform: `translateX(${activeTab === "schedule" ? "0%" : "-50%"})`,
          }}
        >
          <div
            id="dashboard-schedule-panel"
            role="tabpanel"
            aria-labelledby="dashboard-schedule-tab"
            aria-hidden={activeTab !== "schedule"}
            inert={activeTab !== "schedule"}
            className={cn(
              "flex h-full w-1/2 min-w-0 shrink-0 flex-col",
              "overflow-hidden",
            )}
          >
            <main
              data-dashboard-schedule-scroll
              className={cn(
                "flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-4",
                "sm:px-5 sm:py-6",
              )}
            >
              <Schedule />
            </main>
          </div>

          <aside
            id="dashboard-search-panel"
            role="tabpanel"
            aria-labelledby="dashboard-search-tab"
            aria-hidden={activeTab !== "search"}
            inert={activeTab !== "search"}
            className={cn(
              "flex h-full w-1/2 min-w-0 shrink-0 flex-col",
              "overflow-hidden",
            )}
          >
            <Drawer />
          </aside>
        </div>
      </div>
    </>
  );
};

export default DashboardViewSmall;
