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
        <OccasionTableRow key={occasion.id} occasion={occasion} />
      ))}
    </TableBody>
  </Table>
);

export default OccasionTable;

interface OccasionTableRowProps {
  occasion: CourseOccasion;
}

const OccasionTableRow: FC<OccasionTableRowProps> = ({ occasion }) => {
  const { startingYear } = useAtomValue(userPreferencesAtom);

  const relativeSemester = useMemo(
    () =>
      yearAndSemesterToRelativeSemester(
        startingYear,
        occasion.year,
        occasion.semester
      ) + 1,
    [occasion.semester, occasion.year, startingYear]
  );

  return (
    <TableRow>
      <TableCell>
        {relativeSemester} ({occasion.semester} {occasion.year})
      </TableCell>
      <TableCell>{occasion.periods.join(", ")}</TableCell>
      <TableCell>{occasion.blocks.join(", ")}</TableCell>
    </TableRow>
  );
};
