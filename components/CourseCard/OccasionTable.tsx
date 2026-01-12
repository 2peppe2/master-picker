import { CourseWithOccasion } from "@/app/(main)/types";
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

interface OccasionTableProps {
  course: CourseWithOccasion;
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

// TODO: Make this type be better.
interface OccasionTableRowProps {
  occasion: CourseWithOccasion["CourseOccasion"][0];
}

const OccasionTableRow: FC<OccasionTableRowProps> = ({ occasion }) => {
  const { startingYear } = useAtomValue(userPreferencesAtom);

  const periods = useMemo(
    () => occasion.periods.map((p) => p.period),
    [occasion]
  );

  const blocks = useMemo(() => occasion.blocks.map((p) => p.block), [occasion]);

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
      <TableCell>{periods.join(", ")}</TableCell>
      <TableCell>{blocks.join(", ")}</TableCell>
    </TableRow>
  );
};
