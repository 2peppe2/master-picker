import { CourseExamination } from "@/app/dashboard/page";
import { Scale } from "@/prisma/generated/client/enums";
import { NotebookText } from "lucide-react";
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
    <div className="space-y-3 text-foreground">
      <section>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Examinations
          </p>
          <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
            <NotebookText className="size-3.5" />
            {examination.length} modules
          </span>
        </div>
        <div className="rounded-md border">
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
                <TableRow key={exam.module} className="transition-colors hover:bg-muted/25">
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
        </div>
      </section>
    </div>
  );
};

export default ExaminationTable;
