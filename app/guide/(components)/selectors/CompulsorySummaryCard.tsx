"use client";

import Translate from "@/common/components/translate/Translate";
import { CourseRequirements } from "../../page";
import { FC } from "react";

interface CompulsoryCardSummaryProps {
  compulsoryCourses: CourseRequirements;
}

const CompulsorySummaryCard: FC<CompulsoryCardSummaryProps> = ({
  compulsoryCourses,
}) => {
  const totalCompulsoryCourseCount = compulsoryCourses.reduce(
    (total, req) => total + req.courses.length,
    0,
  );

  return (
    <div className="rounded-2xl border p-6 bg-card flex flex-col justify-between min-h-[120px] transition-all hover:border-foreground/10 hover:shadow-sm">
      <div>
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/70">
          <Translate text="_guide_compulsory_courses" />
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          {totalCompulsoryCourseCount}
        </p>
      </div>
      <p className="mt-4 text-xs font-medium text-muted-foreground/60">
        <Translate text="_guide_auto_added_short" />
      </p>
    </div>
  );
};

export default CompulsorySummaryCard;
