"use client";

import Translate from "@/common/components/translate/Translate";
import { CalendarClock } from "lucide-react";
import { FC } from "react";

interface OverviewSectionHeaderProps {
  count: number;
}

const OverviewSectionHeader: FC<OverviewSectionHeaderProps> = ({ count }) => (
  <div className="mb-2 flex items-center justify-between">
    <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
      <Translate text="_course_planned_occasions" />
    </p>
    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
      <CalendarClock className="size-3.5" />
      {count}{" "}
      {count > 1 ? (
        <Translate text="_course_occasion_plural" />
      ) : (
        <Translate text="_course_occasion_singular" />
      )}
    </span>
  </div>
);

export default OverviewSectionHeader;
