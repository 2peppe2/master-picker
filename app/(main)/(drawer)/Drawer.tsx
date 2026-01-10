import CourseCard from "@/components/CourseCard";
import { Draggable } from "@/components/CourseCard/Draggable";
import { useAtom } from "jotai";
import SearchInput from "./components/SearchInput";
import { Course } from "@/app/courses";
import semestersAtom from "@/app/atoms/semestersAtom";
import useFiltered from "./hooks/useFiltered";
import { FC } from "react";

interface DrawerProps {
  activeCourse: Course | null;
}

export const Drawer: FC<DrawerProps> = ({ activeCourse }) => {
  const [semesters] = useAtom(semestersAtom);
  const notInDropped = (course: Course) =>
    !semesters.flat(3).includes(course.code);
  const COURSES = useFiltered();

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
