import { CourseExamination } from "@/app/(main)/page";
import { FC } from "react";
import { Table, TableBody,  TableCell,  TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Scale } from "@/prisma/generated/client/enums";

type ExaminationTableProps = {
    examination: CourseExamination[];
};



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
                        <TableCell>{exam.name}</TableCell>
                        <TableCell>{exam.module}</TableCell>
                        <TableCell>{exam.credits} ECTS</TableCell>
                        <TableCell>{exam.scale == Scale.G_OR_U ? "U, G" : "U, 3, 4, 5"}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ExaminationTable;