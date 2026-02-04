import { Draggable } from "@/components/CourseCard/Draggable";
import { useFiltered } from "@/app/atoms/filter/filterStore";
import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import SearchInput from "./components/SearchInput";
import CourseCard from "@/components/CourseCard";
import { useAtomValue } from "jotai";
import { FC, useMemo } from "react";
import { Course } from "../page";

interface DrawerProps {
  courses: Course[];
}

export const Drawer: FC<DrawerProps> = ({ courses }) => {
  const draggedCourse = useAtomValue(scheduleAtoms.draggedCourseAtom);
  const schedules = useAtomValue(scheduleAtoms.schedulesAtom);
  const filteredCourses = useFiltered(courses);

  const availableCourses = useMemo(() => {
    const scheduledCourses = new Set(
      schedules.flat(3).filter((course): course is Course => course !== null),
    );

    return Object.values(filteredCourses).filter((course) => {
      // Filter out courses already in schedule
      if (scheduledCourses.has(course)) return false;

      // Filter out currently dragged course
      if (draggedCourse && course.code === draggedCourse.code) return false;

      return true;
    });
  }, [filteredCourses, schedules, draggedCourse]);

  return (
    <div
      className="border p-4 rounded-r-lg shadow-lg 
        max-h-[calc(100dvh-1rem)] overflow-y-auto sticky top-4 shrink-0
        2xl:w-[550px] 2xl:min-w-[550px] w-[400px] min-w-[400px]"
    >
      <SearchInput />
      <div className="grid 2xl:grid-cols-3 grid-cols-2 justify-items-center gap-4 mt-5">
        {availableCourses.map((course) => (
          <Draggable key={course.code} id={course.code} data={course}>
            <CourseCard course={course} dropped={false} />
          </Draggable>
        ))}
      </div>
    </div>
  );
};
