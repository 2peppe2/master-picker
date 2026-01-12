import { produce } from "immer";
import { Course, CourseOccasion } from "../(main)/page";
import { atom, useAtom, useAtomValue } from "jotai";
import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { userPreferencesAtom } from "./UserPreferences";
import { useCallback, useMemo } from "react";

type Cell = Course | null;
type ScheduleGrid = Cell[][][]; // [semester][period][block]

interface AddCourseArgs {
  course: Course;
  occasion: CourseOccasion;
}

interface RemoveCourseArgs {
  courseCode: string;
}

interface ScheduleStore {
  state: {
    schedules: ScheduleGrid;
    selectedCourses: Course[];
  };

  mutators: {
    addCourse: (args: AddCourseArgs) => void;
    removeCourse: (args: RemoveCourseArgs) => void;
  };
}

const schedulesAtom = atom<ScheduleGrid>(
  Array.from({ length: 9 }, () =>
    Array.from({ length: 2 }, () => Array.from({ length: 4 }, () => null))
  )
);

export const useScheduleStore = (): ScheduleStore => {
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const [schedules, setSchedules] = useAtom(schedulesAtom);

  const selectedCourses = useMemo(() => {
    const uniqueMap = new Map<string, Course>();

    for (const schedule of schedules) {
      for (const period of schedule) {
        for (const block of period) {
          if (block) uniqueMap.set(block.code, block);
        }
      }
    }
    return Array.from(uniqueMap.values());
  }, [schedules]);

  const addCourse = useCallback(
    ({ course, occasion }: AddCourseArgs) => {
      setSchedules((prev) =>
        produce(prev, (draft) => {
          const relativeYear = yearAndSemesterToRelativeSemester(
            startingYear,
            occasion.year,
            occasion.semester
          );

          for (const period of occasion.periods) {
            for (const block of occasion.blocks) {
              draft[relativeYear][period - 1][block - 1] = course;
            }
          }
          return draft;
        })
      );
    },
    [setSchedules, startingYear]
  );

  const removeCourse = useCallback(
    ({ courseCode }: RemoveCourseArgs) => {
      setSchedules((prev) =>
        produce(prev, (draft) => {
          draft.forEach((semester) => {
            semester.forEach((period) => {
              period.forEach((block, blockIndex) => {
                if (block?.code === courseCode) {
                  period[blockIndex] = null;
                }
              });
            });
          });
        })
      );
    },
    [setSchedules]
  );

  return {
    state: {
      schedules,
      selectedCourses,
    },
    mutators: {
      addCourse,
      removeCourse,
    },
  };
};
