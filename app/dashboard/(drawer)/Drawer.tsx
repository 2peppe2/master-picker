import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { activeCourseAtom } from "@/app/atoms/ActiveCourseAtom";
import { Draggable } from "@/components/CourseCard/Draggable";
import { useFiltered } from "@/app/atoms/filter/filterStore";
import SearchInput from "./components/SearchInput";
import CourseCard from "@/components/CourseCard";
import { useAtomValue } from "jotai";
import { Course } from "../page";
import { FC } from "react";

interface DrawerProps {
  courses: Course[];
}

export const Drawer: FC<DrawerProps> = ({ courses }) => {
  const { state } = useScheduleStore();

  const notInDropped = (course: Course) =>
    !state.schedules.flat(3).includes(course);
  const COURSES = useFiltered(courses);
  const activeCourse = useAtomValue(activeCourseAtom);

  return (
    <div
      className="border p-4 rounded-r-lg shadow-lg 
        max-h-[calc(100dvh-1rem)] overflow-y-auto sticky top-4 shrink-0
        xl:w-[550px] xl:min-w-[550px] w-[400px] min-w-[430px]"
    >
      <SearchInput />
      <div className="grid grid-cols-2 2xl:grid-cols-3 justify-items-center gap-4 mt-5">
        {Object.values(COURSES)
          .filter(notInDropped)
          .filter((course) => course.code !== activeCourse?.code)
          .map((course) => (
            <Draggable key={course.code} id={course.code} data={course}>
              <CourseCard course={course} dropped={false} />
            </Draggable>
          ))}
      </div>
    </div>
  );
};
