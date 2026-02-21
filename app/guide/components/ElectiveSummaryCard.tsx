import { FC } from "react";
import { CourseRequirements } from "../page";

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
        Elective Courses
      </p>
      <p className="mt-2 text-2xl font-semibold">
        {totalElectiveCourseCount}
      </p>
      <p className="text-xs text-muted-foreground">Selections</p>
    </div>
  );
};

export default ElectiveSummaryCard;