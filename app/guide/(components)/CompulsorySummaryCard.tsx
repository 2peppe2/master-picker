"use client";

import { FC } from "react";
import { CourseRequirements } from "../page";
import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";

interface CompulsoryCardSummaryProps {
  compulsoryCourses: CourseRequirements;
}

const CompulsorySummaryCard: FC<CompulsoryCardSummaryProps> = ({
  compulsoryCourses,
}) => {
  const t = useCommonTranslate();
  const totalCompulsoryCourseCount = compulsoryCourses.reduce(
    (total, req) => total + req.courses.length,
    0,
  );

  return (
    <div className="rounded-2xl border p-4 bg-card">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {t("_guide_compulsory_courses")}
      </p>
      <p className="mt-2 text-2xl font-semibold">
        {totalCompulsoryCourseCount}
      </p>
      <p className="text-xs text-muted-foreground">
        {t("_guide_auto_added_short")}
      </p>
    </div>
  );
};

export default CompulsorySummaryCard;
