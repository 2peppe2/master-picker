"use client";

import Translate from "@/common/components/translate/Translate";
import { CourseRequirements } from "../page";
import { FC } from "react";

interface ElectiveSummaryCardProps {
  electiveCourses: CourseRequirements;
}

const ElectiveSummaryCard: FC<ElectiveSummaryCardProps> = ({
  electiveCourses,
}) => {
  const totalElectiveCourseCount = electiveCourses.length;

  return (
    <div className="rounded-2xl border p-4 bg-card">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Translate text="_guide_summary_elective" />
      </p>
      <p className="mt-2 text-2xl font-semibold">{totalElectiveCourseCount}</p>
      <p className="text-xs text-muted-foreground">
        <Translate text="_guide_summary_selections" />
      </p>
    </div>
  );
};

export default ElectiveSummaryCard;
