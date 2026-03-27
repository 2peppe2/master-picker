"use client";

import { useFiltered } from "../../(store)/filter/hooks/useFiltered";
import UnifiedSearchFilter from "./components/UnifiedSearchFilter";
import { useSortedCourses } from "@/common/hooks/useSortedCourses";
import { Draggable } from "@/components/DndProvider/Draggable";
import { scheduleAtoms } from "../../(store)/schedule/atoms";
import EmptyCourseState from "./components/EmptyCourseState";
import DrawerHeader from "./components/DrawerHeader";
import { coursesAtom } from "../../(store)/store";
import CourseCard from "@/components/CourseCard";
import { FC, Fragment, useMemo } from "react";
import { useAtomValue } from "jotai";
import { Course } from "../../page";

interface DrawerProps {
  courses: Course[];
}

const Drawer: FC<DrawerProps> = ({ courses: initialCourses }) => {
  const draggedCourse = useAtomValue(scheduleAtoms.draggedCourseAtom);
  const schedules = useAtomValue(scheduleAtoms.schedulesAtom);
  const coursesMap = useAtomValue(coursesAtom);
  
  const coursesArray = useMemo(() => {
    // If coursesMap is relatively empty, fallback to initialCourses
    const arr = Object.values(coursesMap);
    return arr.length > 0 ? arr : initialCourses;
  }, [coursesMap, initialCourses]);

  const filteredCourses = useFiltered({
    courses: coursesArray,
  });
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
      className="border-l shadow-sm 
        h-full sticky shrink-0 flex flex-col overflow-hidden
        2xl:w-[550px] 2xl:min-w-[550px] w-[400px] min-w-[400px] pb-1"
    >
      <DrawerHeader />

      <div className="p-4 shrink-0 z-10">
        <UnifiedSearchFilter />
      </div>

      <div className="overflow-y-auto flex-1 p-4 pt-1">
        {availableCourses.length === 0 ? (
          <EmptyCourseState />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Drawer;
