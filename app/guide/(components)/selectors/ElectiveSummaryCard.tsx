"use client";

import Translate from "@/common/components/translate/Translate";
import { CourseRequirements } from "../../page";
import { FC } from "react";

interface ElectiveSummaryCardProps {
  electiveCourses: CourseRequirements;
}

const ElectiveSummaryCard: FC<ElectiveSummaryCardProps> = ({
  electiveCourses,
}) => {
  const totalElectiveCourseCount = electiveCourses.length;

  return (
    <div className="rounded-2xl border p-6 bg-card flex flex-col justify-between min-h-[120px] transition-all hover:border-foreground/10 hover:shadow-sm">
      <div>
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/70">
          <Translate text="_guide_summary_elective" />
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{totalElectiveCourseCount}</p>
      </div>
      <p className="mt-4 text-xs font-medium text-muted-foreground/60 tracking-wide">
        <Translate text="_guide_summary_selections" />
      </p>
    </div>
  );
};

export default ElectiveSummaryCard;
