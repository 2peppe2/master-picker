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
import { useScheduleStore } from "@/app/atoms/scheduleStore";

interface OccasionTableProps {
  course: Course;
}

const OccasionTable: FC<OccasionTableProps> = ({ course }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Semester</TableHead>
        <TableHead>Period</TableHead>
        <TableHead>Block</TableHead>
        <TableHead className="text-right">Add to schedule</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {course.CourseOccasion.map((occasion) => (
        <OccasionTableRow
          key={occasion.id}
          occasion={occasion}
          course={course}
        />
      ))}
    </TableBody>
  </Table>
);

export default OccasionTable;

interface OccasionTableRowProps {
  occasion: CourseOccasion;
  course: Course;
}

const OccasionTableRow: FC<OccasionTableRowProps> = ({ occasion, course }) => {
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const { mutators } = useScheduleStore();

  const relativeSemester = useMemo(
    () =>
      yearAndSemesterToRelativeSemester(
        startingYear,
        occasion.year,
        occasion.semester
      ),
    [occasion.semester, occasion.year, startingYear]
  );
  const periods = occasion.periods.map((p) => p.period);
  console.log("periods", periods);
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
