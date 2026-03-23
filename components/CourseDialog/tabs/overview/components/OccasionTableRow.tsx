"use client";

import { useCourseContlictResolver } from "@/components/ConflictResolverModal/hooks/useCourseContlictResolver";
import { useScheduleGetters } from "@/app/dashboard/(store)/schedule/hooks/useScheduleGetters";
import OccasionSemesterCell from "./cells/OccasionSemesterCell";
import { Course, CourseOccasion } from "@/app/dashboard/page";
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
  const { getOccasionCollisions } = useScheduleGetters();
  const { executeAdd } = useCourseContlictResolver();

  const periods = occasion.periods.map((p) => p.period);
  const blocks = Array.from(new Set(occasion.periods.flatMap((p) => p.blocks)));

  const handleAddClick = () => {
    if (getOccasionCollisions({ occasion }).length > 0) {
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
