import { COURSES, Course } from "@/app/courses";
import semestersAtom from "@/app/atoms/semestersAtom";
import { useAtomValue, useSetAtom } from "jotai";
import { SearchIcon } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { Draggable } from "@/components/CourseCard/Draggable";
import { Droppable } from "./Droppable";
import { FC } from "react";
import { filterAtom } from "@/app/atoms/FilterAtom";
import { produce } from "immer";

interface SemesterBlockProps {
  semesterNumber: number;
  periodNumber: number;
  blockNumber: number;
  activeCourse: Course | null;
}

export const SemesterBlock: FC<SemesterBlockProps> = ({
  semesterNumber,
  periodNumber,
  blockNumber,
  activeCourse,
}) => {
  const semesters = useAtomValue(semestersAtom);
  const setFilter = useSetAtom(filterAtom);
  const courseCode: string | null =
    semesters[semesterNumber][periodNumber][blockNumber];
  const course = courseCode ? COURSES[courseCode] : null;

  function onClickFilter() {
    unCheckOtherTimeSlots();
    setFilter(
      produce((draft) => {
        draft.semester[semesterNumber] = true;
        draft.period[periodNumber] = true;
        draft.block[blockNumber] = true;
      })
    );
  }
  function unCheckOtherTimeSlots() {
    setFilter(
      produce((draft) => {
        draft.semester = draft.semester.map(() => false);
        draft.period = draft.period.map(() => false);
        draft.block = draft.block.map(() => false);
      })
    );
  }

  if (!courseCode || !course) {
    return (
      <Droppable
        key={blockNumber}
        activeCourse={activeCourse}
        id={`semester-${semesterNumber}-period${periodNumber}-block-${blockNumber}`}
        data={{
          semester: semesterNumber,
          period: periodNumber,
          block: blockNumber,
        }}
      >
        <div className="flex flex-col items-center">
          <SearchIcon
            className="text-zinc-500 hover:text-foreground size-12"
            onClick={onClickFilter}
          />
          <span className="text-zinc-500">Block {blockNumber + 1}</span>
        </div>
      </Droppable>
    );
  }
  return (
    <Droppable
      key={blockNumber}
      activeCourse={activeCourse}
      id={`semester-${semesterNumber}-period${periodNumber}-block-${blockNumber}`}
      data={{
        semester: semesterNumber,
        period: periodNumber,
        block: blockNumber,
      }}
    >
      <Draggable key={courseCode} id={courseCode} data={course}>
        <CourseCard course={course} dropped={true} />
      </Draggable>
    </Droppable>
  );
};
