import CourseCard from "@/components/CourseCard";
import { Draggable } from "@/components/CourseCard/Draggable";
import { activeCourseAtom } from "@/app/atoms/ActiveCourseAtom";
import semesterScheduleAtom from "@/app/atoms/semestersAtom";
import { useAtom, useAtomValue } from "jotai";
import { FC } from "react";
import SearchInput from "./components/SearchInput";
import useFiltered from "./hooks/useFiltered";
import { CourseWithOccasion } from "../types";

interface DrawerProps {
  courses: CourseWithOccasion[];
}

export const Drawer: FC<DrawerProps> = ({ courses }) => {
  const [semesters] = useAtom(semesterScheduleAtom);
  const notInDropped = (course: CourseWithOccasion) =>
    !semesters.flat(3).includes(course);
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
