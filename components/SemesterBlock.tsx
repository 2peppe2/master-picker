import { COURSES } from "@/app/courses";
import semestersAtom from "@/app/semestersAtom";
import { useAtomValue } from "jotai";
import { Plus } from "lucide-react";
import { CourseCard } from "@/components/CourseCard/Card";
import { Draggable } from "@/components/CourseCard/Draggable";
import { Droppable } from "./Dropable";

type SemesterBlockProps = {
    semesterNumber: number;
    periodNumber: number;
    blockNumber: number;
}


export const SemesterBlock = ({ semesterNumber, periodNumber, blockNumber }: SemesterBlockProps) => {
    const semesters = useAtomValue(semestersAtom);
    const courseCode: string | null = semesters[semesterNumber][periodNumber][blockNumber];
    const active = courseCode !== null;
    const course = courseCode ? COURSES[courseCode] : null;
    if (!courseCode || !course) {
        return (
            <Droppable key={blockNumber} id={`semester-${semesterNumber}-period${periodNumber}-block-${blockNumber}`} data={{ semester: semesterNumber, period: periodNumber, block: blockNumber }}>
                <div className="flex flex-col items-center">
                    <Plus className="text-zinc-500 hover:text-foreground size-16"/>
                    <span className="text-zinc-500">Block {blockNumber + 1}</span>
                </div>
            </Droppable>
        )
    }
    return (
        <Droppable key={blockNumber} id={`semester-${semesterNumber}-period${periodNumber}-block-${blockNumber}`} data={{ semester: semesterNumber, period: periodNumber, block: blockNumber }}>
            <Draggable key={courseCode} id={courseCode} data={course}>
                <CourseCard {...course} dropped={true} />
            </Draggable>

        </Droppable>
    )
}
