"use client";

import { cn } from "@/lib/utils";

import MastersRequirementsBar from "../../MastersRequirementsBar";
import DashboardHeaderActions from "./DashboardHeaderActions";
import DashboardHeaderWordmark from "./DashboardHeaderWordmark";
import Disclaimer from "./Disclaimer";
import { FC, useState } from "react";

interface DashboardHeaderProps {
  /**
   * Collapses the header into a single row for short viewports, where the
   * stacked disclaimer and requirements rows would eat most of the screen.
   */
  dense?: boolean;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ dense = false }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex w-full shrink-0 flex-col border-b border-border bg-card/90 backdrop-blur-md lg:hidden">
      {/*
       * Landscape lays the row out on the body's own grid, so the requirements
       * bar starts exactly where the schedule column does and reads as that
       * column's heading. The disclaimer moves down into the schedule column in
       * that mode, so it is not rendered here.
       */}
      {dense ? (
        <div
          className={cn(
            "grid min-h-(--touch) items-center py-(--density-y)",
            // Padding lives inside the cells: on the row it would shift both
            // tracks and break the alignment this grid exists to create.
            "grid-cols-[clamp(21rem,42%,25rem)_minmax(0,1fr)]",
          )}
        >
          {/* justify-between with the drawer's own px-4: the actions land on
              the same right edge as the filters button in the column below. */}
          <div className="flex min-w-0 items-center justify-between gap-2 px-4">
            <DashboardHeaderWordmark dense={dense} />
            <DashboardHeaderActions
              isSettingsOpen={isSettingsOpen}
              onSettingsOpenChange={setIsSettingsOpen}
            />
          </div>

          <div className="flex min-w-0 items-center px-(--density-x)">
            <MastersRequirementsBar />
          </div>
        </div>
      ) : (
        <>
          <div>
            <Disclaimer />
          </div>

          <div
            className={cn(
              "flex min-h-16 items-center justify-between border-b",
              "border-border/50 px-4 py-3 sm:px-6",
            )}
          >
            <DashboardHeaderWordmark dense={dense} />
            <DashboardHeaderActions
              isSettingsOpen={isSettingsOpen}
              onSettingsOpenChange={setIsSettingsOpen}
            />
          </div>

          <div className="flex min-w-0 items-center bg-muted/10 px-4 py-2 sm:px-6">
            <MastersRequirementsBar />
          </div>
        </>
      )}
    </header>
  );
};

export default DashboardHeader;
