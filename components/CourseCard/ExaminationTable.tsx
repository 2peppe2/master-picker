import { CourseExamination } from "@/app/(main)/page";
import { FC } from "react";

type ExaminationTableProps = {
    examination: CourseExamination;
};
    
const ExaminationTable: FC<ExaminationTableProps> = ({ examination }) => {
    return (
        "HEJ"
    );
};

export default ExaminationTable;