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
import { FC, useMemo } from "react";
import { Course, CourseOccasion } from "@/app/(main)/page";
import { MasterBadge } from "../MasterBadge";
import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";

interface OccasionTableProps {
  course: Course;
}

const OccasionTable: FC<OccasionTableProps> = ({ course }) => {

  const hasRecommendedMaster = course.CourseOccasion.some(
    (occasion) => occasion.recommendedMaster.length > 0);

  return(
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Semester</TableHead>
        <TableHead>Period</TableHead>
        <TableHead>Block</TableHead>
        {hasRecommendedMaster && <TableHead>Recommended for master</TableHead>}
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
        />
      ))}
    </TableBody>
  </Table>
);
}

export default OccasionTable;

interface OccasionTableRowProps {
  occasion: CourseOccasion;
  course: Course;
  showRecommendedMaster: boolean;
}

const OccasionTableRow: FC<OccasionTableRowProps> = ({ occasion, course, showRecommendedMaster }) => {
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const { mutators } = useScheduleStore();

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
  const blocks = Array.from(
    new Set(occasion.periods.flatMap((p) => p.blocks))
  );


  return (
    <TableRow>
      <TableCell>
        {relativeSemester + 1} ({occasion.semester} {occasion.year})
      </TableCell>
      <TableCell>{periods.length > 0 ? periods.join(", ") : "-"}</TableCell>
      <TableCell>{blocks.length > 0 ? blocks.join(", ") : "-"}</TableCell>
      {showRecommendedMaster &&
      <TableCell align="center">
        {occasion.recommendedMaster.length > 0
          ? occasion.recommendedMaster.map((m) => <MasterBadge key={m.master} name={m.master}/>)
          : "-"}
      </TableCell>}
      <TableCell className="flex justify-end">
        <p
          onClick={() => mutators.addCourse({ course, occasion })}
          className="cursor-pointer hover:underline underline-offset-2 text-left"
        >
          Add course
        </p>
      </TableCell>
    </TableRow>
  );
};


