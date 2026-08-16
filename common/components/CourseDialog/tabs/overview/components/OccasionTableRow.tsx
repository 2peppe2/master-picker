"use client";

import { useCourseContlictResolver } from "@/common/components/ConflictResolverModal/hooks/useCourseContlictResolver";
import { useOccasionCollisions } from "@/features/dashboard/state/schedule/hooks/useScheduleQueries";
import OccasionSemesterCell from "./cells/OccasionSemesterCell";
import { Course, CourseOccasion } from "@/common/types";
import OccasionPeriodCell from "./cells/OccasionPeriodCell";
import OccasionMasterCell from "./cells/OccasionMasterCell";
import OccasionActionCell from "./cells/OccasionActionCell";
import OccasionBlockCell from "./cells/OccasionBlockCell";
import { TableRow } from "@/components/ui/table";
import { FC } from "react";

interface OccasionTableRowProps {
  occasion: CourseOccasion;
  course: Course;
  showRecommendedMaster: boolean;
  setAlertOpen: (open: boolean) => void;
  setSelectedOccasion: (occasion: CourseOccasion) => void;
  showAdd: boolean;
}

const OccasionTableRow: FC<OccasionTableRowProps> = ({
  occasion,
  course,
  showRecommendedMaster,
  setAlertOpen,
  setSelectedOccasion,
  showAdd,
}) => {
  const getOccasionCollisions = useOccasionCollisions();
  const { executeAdd } = useCourseContlictResolver();

  const periods = occasion.periods.map((p) => p.period);
  const blocks = Array.from(new Set(occasion.periods.flatMap((p) => p.blocks)));

  const handleAddClick = () => {
    const collisions = getOccasionCollisions({ occasion }).filter(
      (collision) => collision.code !== course.code,
    );

    if (collisions.length > 0) {
      setSelectedOccasion(occasion);
      setAlertOpen(true);
    } else {
      executeAdd({ course, occasion, strategy: "button" });
    }
  };

  return (
    <TableRow className="transition-colors hover:bg-muted/25">
      <OccasionSemesterCell year={occasion.year} semester={occasion.semester} />
      <OccasionPeriodCell periods={periods} />
      <OccasionBlockCell blocks={blocks} />
      {showRecommendedMaster && (
        <OccasionMasterCell recommendedMaster={occasion.recommendedMaster} />
      )}
      {showAdd && <OccasionActionCell onAdd={handleAddClick} />}
    </TableRow>
  );
};

export default OccasionTableRow;
