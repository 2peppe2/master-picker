import { CourseExamination } from "@/app/dashboard/page";
import { Scale } from "@/prisma/generated/client/enums";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FC } from "react";

interface ExaminationTableProps {
  examination: CourseExamination[];
}

const ExaminationTable: FC<ExaminationTableProps> = ({ examination }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Module</TableHead>
          <TableHead>Credits</TableHead>
          <TableHead>Scale</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {examination.map((exam) => (
          <TableRow key={exam.module}>
            <TableCell>
              {exam.name.length <= 25
                ? exam.name
                : exam.name.substring(0, 25) + "..."}
            </TableCell>
            <TableCell>{exam.module}</TableCell>
            <TableCell>{exam.credits} ECTS</TableCell>
            <TableCell>
              {exam.scale == Scale.G_OR_U ? "U, G" : "U, 3, 4, 5"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExaminationTable;
