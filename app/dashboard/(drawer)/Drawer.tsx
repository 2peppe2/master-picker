import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { Draggable } from "@/components/CourseCard/Draggable";
import { useFiltered } from "@/app/atoms/filter/filterStore";
import SearchInput from "./components/SearchInput";
import CourseCard from "@/components/CourseCard";
import { Course } from "../page";
import { FC } from "react";

interface DrawerProps {
  courses: Course[];
}

export const Drawer: FC<DrawerProps> = ({ courses }) => {
  const {
    state: { draggedCourse, schedules },
  } = useScheduleStore();

  const notInDropped = (course: Course) => !schedules.flat(3).includes(course);
  const COURSES = useFiltered(courses);

  return (
    <div
      className="border p-4 rounded-r-lg shadow-lg 
        max-h-[calc(100dvh-1rem)] overflow-y-auto sticky top-4 shrink-0
        2xl:w-[550px] 2xl:min-w-[550px] w-[400px] min-w-[400px]"
    >
      <SearchInput />
      <div className="grid 2xl:grid-cols-3 grid-cols-2 justify-items-center gap-4 mt-5">
        {Object.values(COURSES)
          .filter(notInDropped)
          .filter((course) => course.code !== draggedCourse?.code)
          .map((course) => (
            <Draggable key={course.code} id={course.code} data={course}>
              <CourseCard course={course} dropped={false} />
            </Draggable>
          ))}
      </div>
    </div>
  );
};
