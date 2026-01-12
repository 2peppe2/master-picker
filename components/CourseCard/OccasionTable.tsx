import { CourseWithOccasion } from "@/app/(main)/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { useAtom, useAtomValue } from "jotai";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";


type OccasionTableProps = {
    course: CourseWithOccasion;
};

export const OccasionTable = ({ course }: OccasionTableProps) => {
    const { startingYear } = useAtomValue(userPreferencesAtom);
    return (
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
                    <TableRow key={occasion.id}>
                        <TableCell>{yearAndSemesterToRelativeSemester(startingYear, occasion.year, occasion.semester) + 1}
                            {" "}({occasion.semester} {occasion.year})
                        </TableCell>
                        <TableCell>{occasion.periods.join(", ")}</TableCell>
                        <TableCell>{occasion.blocks.join(", ")}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}