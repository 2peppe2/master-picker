"use client";

import { useCourseContlictResolver } from "@/components/ConflictResolverModal/hooks/useCourseContlictResolver";
import { useScheduleGetters } from "@/app/dashboard/(store)/schedule/hooks/useScheduleGetters";
import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import ConflictResolverModal from "@/components/ConflictResolverModal";
import Translate from "@/common/components/translate/Translate";
import { Course, CourseOccasion } from "@/app/dashboard/page";
import MasterBadge from "@/components/MasterBadge";
import { Button } from "@/components/ui/button";
import { FC, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <TableHeader>
          <TableRow>
            <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <Translate text="semester" />
            </TableHead>
            <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <Translate text="period" />
            </TableHead>
            <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <Translate text="block" />
            </TableHead>
            {hasRecommendedMaster && (
              <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <Translate text="recommended_for_master" />
              </TableHead>
            )}
            {showAdd && (
              <TableHead className="text-right py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <Translate text="_course_add_to_schedule" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
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
  const yearAndSemesterToRelativeSemester = useToRelativeSemester();
  const { getOccasionCollisions } = useScheduleGetters();
  const { executeAdd } = useCourseContlictResolver();

  const relativeSemester = useMemo(
    () =>
      yearAndSemesterToRelativeSemester({
        year: occasion.year,
        semester: occasion.semester,
      }),
    [occasion.semester, occasion.year, yearAndSemesterToRelativeSemester],
  );

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
      <TableCell>
        {relativeSemester + 1} ({occasion.semester} {occasion.year})
      </TableCell>
      <TableCell>{periods.length > 0 ? periods.join(", ") : "-"}</TableCell>
      <TableCell>{blocks.length > 0 ? blocks.join(", ") : "-"}</TableCell>
      {showRecommendedMaster && (
        <TableCell>
          {occasion.recommendedMaster.length > 0
            ? occasion.recommendedMaster.map((m) => (
                <MasterBadge key={m.master} name={m.master} />
              ))
            : "-"}
        </TableCell>
      )}
      {showAdd && (
        <TableCell className="text-right">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddClick}
            className="cursor-pointer h-8 gap-1.5 rounded-md border-border/80 bg-background px-2.5 text-xs font-semibold shadow-xs hover:bg-accent/60"
          >
            <Plus className="size-3.5" />
            Add course
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};
