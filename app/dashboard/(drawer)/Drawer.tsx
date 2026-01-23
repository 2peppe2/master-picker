import CourseCard from "@/components/CourseCard";
import { Draggable } from "@/components/CourseCard/Draggable";
import { activeCourseAtom } from "@/app/atoms/ActiveCourseAtom";
import { useAtomValue } from "jotai";
import { FC } from "react";
import SearchInput from "./components/SearchInput";
import { Course } from "../page";
import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { useFiltered } from "@/app/atoms/filter/filterStore";

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
    <div className="border p-4 rounded-r-lg shadow-lg max-h-screen overflow-y-auto overflow-x-hidden sticky top-0">
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
