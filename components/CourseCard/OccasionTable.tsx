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
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useMemo } from "react";
import { Course, CourseOccasion } from "@/app/(main)/page";
import semesterScheduleAtom, { addCourseToSemesterAtom } from "@/app/atoms/semestersAtom";

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
        <OccasionTableRow key={occasion.id} occasion={occasion} course={course} />
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
  const addCourse = useSetAtom(addCourseToSemesterAtom);

  const relativeSemester = useMemo(
    () =>
      yearAndSemesterToRelativeSemester(
        startingYear,
        occasion.year,
        occasion.semester
      ),
    [occasion.semester, occasion.year, startingYear]
  );
  

  return (
    <TableRow>
      <TableCell>
        {relativeSemester + 1} ({occasion.semester} {occasion.year})
      </TableCell>
      <TableCell>{occasion.periods.join(", ")}</TableCell>
      <TableCell>{occasion.blocks.join(", ")}</TableCell>
      <TableCell className="flex justify-end">
        <p
            onClick={() => addCourse({course, occasion})}
            className="cursor-pointer hover:underline underline-offset-2 text-left"
          >
          Add course
          </p>
      </TableCell>
    </TableRow>
  );
};
