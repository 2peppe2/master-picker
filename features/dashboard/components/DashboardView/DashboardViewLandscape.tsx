"use client";

import { cn } from "@/lib/utils";

import Disclaimer from "./components/Disclaimer";
import Schedule from "../Schedule";
import Drawer from "../Drawer";
import { FC } from "react";

const DashboardViewLandscape: FC = () => (
  <div
    className={cn(
      "grid min-h-0 w-full flex-1 overflow-hidden",
      // Wide enough that the search field keeps its placeholder next to the
      // filter button, which shows its label at this viewport width.
      //
      // 42% is the nominal split, but a plain 42% of a 667px iPhone SE is only
      // 280px, which forces the result tiles down to ~79px. The 21rem floor
      // governs there instead; the 25rem cap stops the drawer running away on
      // wide Android phones. Between them the tile grid always resolves to
      // exactly three lanes -- see CourseResults.
      "grid-cols-[clamp(21rem,42%,25rem)_minmax(0,1fr)]",
    )}
  >
    <aside
      id="dashboard-search-panel"
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden border-r",
        "border-primary/10 bg-card",
      )}
    >
      <Drawer />
    </aside>

    <main
      id="dashboard-schedule-panel"
      className={cn(
        "flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background",
      )}
    >
      {/*
       * The disclaimer sits over the schedule rather than spanning the whole
       * app: the header row above is already the full width, and stacking a
       * second full-width strip on it ate the little height landscape has.
       */}
      <div className="shrink-0">
        <Disclaimer dense />
      </div>

      <div
        data-dashboard-schedule-scroll
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          // Inline padding stays generous; only the block axis is scarce here.
          "gap-x-2 gap-y-(--density-gap-y)",
          // Same value on both axes so the schedule sits evenly inside its
          // pane; --density-y is tuned for stacked chrome, not a scroller.
          "overflow-y-auto p-(--density-x)",
        )}
      >
        <Schedule />
      </div>
    </main>
  </div>
);

export default DashboardViewLandscape;
