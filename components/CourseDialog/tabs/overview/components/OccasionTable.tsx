"use client";

import { useScheduleGetters } from "@/app/dashboard/(store)/schedule/hooks/useScheduleGetters";
import ConflictResolverModal from "@/components/ConflictResolverModal";
import OccasionTableHeader from "./OccasionTableHeader";
import { Course, CourseOccasion } from "@/app/dashboard/page";
import OccasionTableRow from "./OccasionTableRow";
import { Table, TableBody } from "@/components/ui/table";
import { FC, useState } from "react";

interface OccasionTableProps {
  course: Course;
  showAdd: boolean;
}

const OccasionTable: FC<OccasionTableProps> = ({ course, showAdd }) => {
  const [selectedOccasion, setSelectedOccasion] = useState<CourseOccasion>(
    course.CourseOccasion[0],
  );
  const [alertOpen, setAlertOpen] = useState(false);

  const { getOccasionCollisions } = useScheduleGetters();

  const hasRecommendedMaster = course.CourseOccasion.some(
    (occasion) => occasion.recommendedMaster.length > 0,
  );

  const collisions = getOccasionCollisions({ occasion: selectedOccasion });

  return (
    <>
      <ConflictResolverModal
        open={alertOpen}
        setOpen={setAlertOpen}
        conflictData={{
          strategy: "button",
          collisions,
          course,
          occasion: selectedOccasion,
        }}
      />

      <Table>
        <OccasionTableHeader
          showRecommendedMaster={hasRecommendedMaster}
          showAdd={showAdd}
        />
        <TableBody>
          {course.CourseOccasion.map((occasion) => (
            <OccasionTableRow
              key={occasion.id}
              occasion={occasion}
              course={course}
              showRecommendedMaster={hasRecommendedMaster}
              setAlertOpen={setAlertOpen}
              setSelectedOccasion={setSelectedOccasion}
              showAdd={showAdd}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OccasionTable;
