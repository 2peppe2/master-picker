import { FC } from "react";
import { CourseRequirements } from "../page";

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
    <div className="rounded-2xl border p-4 bg-card">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Compulsory courses
      </p>
      <p className="mt-2 text-2xl font-semibold">
        {totalCompulsoryCourseCount}
      </p>
      <p className="text-xs text-muted-foreground">
        Auto-added to your schedule
      </p>
    </div>
  );
};

export default CompulsorySummaryCard;
