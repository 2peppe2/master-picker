import CourseCard from "@/components/CourseCard";
import { Draggable } from "@/components/CourseCard/Draggable";
import { Course } from "@/app/courses";
import { activeCourseAtom } from "@/app/atoms/ActiveCourseAtom";
import semestersAtom from "@/app/atoms/semestersAtom";
import { userPreferencesAtom } from "@/app/atoms/UserPrefrences";
import { useAtom, useAtomValue } from "jotai";
import { FC } from "react";
import SearchInput from "./components/SearchInput";
import useFiltered from "./hooks/useFiltered";
import { courseWithOccasions } from "../type";

interface DrawerProps {
  courses: courseWithOccasions[];
}

export const  Drawer: FC<DrawerProps> =  ({ courses }) => {
  const [semesters] = useAtom(semestersAtom);
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const notInDropped = (course: courseWithOccasions) =>
    !semesters.flat(3).includes(course.code);
  const COURSES = useFiltered(courses);
  const activeCourse = useAtomValue(activeCourseAtom);
  const semesterBase = 7;
  const maxSemester = semesterBase + semesters.length - 1;

  // Helper function to convert year and term to semester number
  // TODO refactor this ...
  const toSemesterNumber = (year: number, term: string) => {
    const academicYear = term === "VT" ? year - 1 : year;
    return (academicYear - startingYear) * 2 + (term === "HT" ? 1 : 2);
  };

  const toCourse = (course: courseWithOccasions): Course => {
    const occasion =
      course.CourseOccasion.find((entry) => {
        const semesterNumber = toSemesterNumber(entry.year, entry.semester);
        return semesterNumber >= semesterBase && semesterNumber <= maxSemester;
      }) ?? course.CourseOccasion[0];
    const period = occasion?.periods.map((item) => item.period) ?? [];
    const block = occasion?.blocks.map((item) => item.block) ?? [];
    const semester = occasion
      ? toSemesterNumber(occasion.year, occasion.semester)
      : semesterBase;

    return {
      code: course.code,
      name: course.name,
      semester,
      period: period.length ? period : [1],
      block: block[0] ?? 1,
      credits: course.credits,
      level: course.level,
      link: course.link,
      mastersPrograms: course.CourseMaster.map((master) => master.master),
    };
  };

  return (
    <div className="border p-4 rounded-r-lg shadow-lg max-h-screen overflow-y-auto overflow-x-hidden sticky top-0">
      <SearchInput />
      <div className="grid grid-cols-2 2xl:grid-cols-3 justify-items-center gap-4 mt-5">
        {Object.values(COURSES)
          .filter(notInDropped)
          .filter((course) => course.code !== activeCourse?.code)
          .map((course) => {
            const mappedCourse = toCourse(course);
            return (
              <Draggable key={course.code} id={course.code} data={mappedCourse}>
                <CourseCard course={mappedCourse} dropped={false} />
              </Draggable>
            );
          })}
      </div>
    </div>
  );
};
