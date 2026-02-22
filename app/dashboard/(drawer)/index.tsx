import { Draggable } from "@/components/DndProvider/Draggable";
import { useFiltered } from "@/app/atoms/filter/filterStore";
import { useSortedCourses } from "@/hooks/useSortedCourses";
import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import SearchInput from "./components/SearchInput";
import CourseCard from "@/components/CourseCard";
import { FC, Fragment, useMemo } from "react";
import { useAtomValue } from "jotai";
import { Course } from "../page";

interface DrawerProps {
  courses: Course[];
}

const Drawer: FC<DrawerProps> = ({ courses }) => {
  const draggedCourse = useAtomValue(scheduleAtoms.draggedCourseAtom);
  const schedules = useAtomValue(scheduleAtoms.schedulesAtom);
  const filteredCourses = useFiltered(courses);
  const sortedCourses = useSortedCourses({
    courses: filteredCourses,
  });

  const availableCourses = useMemo(() => {
    const scheduledCourses = new Set(
      schedules
        .flat(3)
        .filter((course): course is Course => course !== null)
        .map((c) => c.code),
    );

    return Object.values(sortedCourses).filter((course) => {
      if (scheduledCourses.has(course.code)) return false;
      return true;
    });
  }, [sortedCourses, schedules]);

  return (
    <div
      className="border-l shadow-lg
        h-full sticky shrink-0 flex flex-col overflow-hidden
        2xl:w-[550px] 2xl:min-w-[550px] w-[400px] min-w-[400px] pb-1"
    >
      <div className="p-4 shrink-0 z-10">
        <SearchInput />
      </div>

      <div className="overflow-y-auto flex-1 p-4 pt-1">
        <div className="grid 2xl:grid-cols-3 grid-cols-2 justify-items-center gap-4">
          {availableCourses.map((course) => {
            const isDragging = draggedCourse?.code === course.code;

            return (
              <Fragment key={course.code}>
                {isDragging ? (
                  <CourseCard variant="ghost" course={course} />
                ) : (
                  <Draggable id={course.code} data={course}>
                    <CourseCard variant="grabbable" course={course} />
                  </Draggable>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
