import { useAtomValue } from "jotai";
import { Droppable } from "./Dropable";
import semestersStore from "@/app/semesterStore";
import { Draggable } from "./Draggable";
import { CourseCard } from "./CourseCard";
import { COURSES } from "@/app/courses";

type SemesterBlockProps = {
    semesterNumber: number;
    periodNumber: number;
    blockNumber: number;
}


export const SemesterBlock = ({ semesterNumber, periodNumber,  blockNumber }: SemesterBlockProps) => {
    const semesters = useAtomValue(semestersStore);
    const courseCode: string | null = semesters[semesterNumber][periodNumber][blockNumber];
    const active = courseCode !== null;
    const course = courseCode ? COURSES[courseCode] : null;
    if (!courseCode || !course) {
        return (
        <Droppable key={blockNumber} id={`semester-${semesterNumber}-period${periodNumber}-block-${blockNumber}`} data={{ semester: semesterNumber, period: periodNumber, block: blockNumber }}>
            <span className="text-gray-500">Block {blockNumber + 1}</span>
        </Droppable>
        )
    }
    return (
        <Droppable key={blockNumber} id={`semester-${semesterNumber}-period${periodNumber}-block-${blockNumber}`} data={{ semester: semesterNumber, period: periodNumber, block: blockNumber }}>
            <Draggable key={courseCode} id={courseCode} data={course}>
                <CourseCard {...course} />
            </Draggable>

        </Droppable>
    )
}
