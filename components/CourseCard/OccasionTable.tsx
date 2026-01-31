"use client";

import { useCourseContlictResolver } from "../ConflictResolverModal/hooks/useCourseContlictResolver";
import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { ConflictResolverModal } from "../ConflictResolverModal";
import { Course, CourseOccasion } from "@/app/(main)/page";
import { FC, useMemo, useState } from "react";
import { MasterBadge } from "../MasterBadge";
import { useAtomValue } from "jotai";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { useAtomValue } from "jotai";
import { FC, useMemo, useState } from "react";
import { Course, CourseOccasion } from "@/app/dashboard/page";
import { MasterBadge } from "../MasterBadge";
import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import AddAlert from "../AddAlert";

interface OccasionTableProps {
  course: Course;
}

const OccasionTable: FC<OccasionTableProps> = ({ course }) => {
  const [selectedOccasion, setSelectedOccasion] = useState<CourseOccasion>(
    course.CourseOccasion[0],
  );
  const [alertOpen, setAlertOpen] = useState(false);

  const {
    getters: { getOccasionCollisions },
  } = useScheduleStore();

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
            <TableHead>Semester</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Block</TableHead>
            {hasRecommendedMaster && (
              <TableHead>Recommended for master</TableHead>
            )}
            <TableHead className="text-right">Add to schedule</TableHead>
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
}

const OccasionTableRow: FC<OccasionTableRowProps> = ({
  occasion,
  course,
  showRecommendedMaster,
  setAlertOpen,
  setSelectedOccasion,
}) => {
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const {
    getters: { getOccasionCollisions },
  } = useScheduleStore();
  const { executeAdd } = useCourseContlictResolver();

  const relativeSemester = useMemo(
    () =>
      yearAndSemesterToRelativeSemester(
        startingYear,
        occasion.year,
        occasion.semester,
      ),
    [occasion.semester, occasion.year, startingYear],
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
    <TableRow>
      <TableCell>
        {relativeSemester + 1} ({occasion.semester} {occasion.year})
      </TableCell>
      <TableCell>{periods.length > 0 ? periods.join(", ") : "-"}</TableCell>
      <TableCell>{blocks.length > 0 ? blocks.join(", ") : "-"}</TableCell>
      {showRecommendedMaster && (
        <TableCell align="center">
          {occasion.recommendedMaster.length > 0
            ? occasion.recommendedMaster.map((m) => (
                <MasterBadge key={m.master} name={m.master} />
              ))
            : "-"}
        </TableCell>
      )}
      <TableCell className="flex justify-end">
        <p
          onClick={handleAddClick}
          className="cursor-pointer hover:underline underline-offset-2 text-left"
        >
          Add course
        </p>
      </TableCell>
    </TableRow>
  );
};
