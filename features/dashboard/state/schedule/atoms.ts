import { masterPeriodAtom } from "../preferences/atoms";
import type { Course } from "@/common/types";
import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import { atomWithReset, RESET } from "jotai/utils";
import { produce } from "immer";
import type {
  AddCourseArgs,
  DeleteBlockFromSemesterArgs,
  RemoveCourseArgs,
  ScheduleGrid,
} from "./types";
import { placeCourse, removeCourseFromGrid } from "./domain";
import { SHARE_BUTTON_LOADING_MS, WILDCARD_BLOCK_START } from "./constants";
import { draggedCourseAtom } from "../drag/atoms";
import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";

export { SHARE_BUTTON_LOADING_MS, WILDCARD_BLOCK_START } from "./constants";

const createInitialGrid = (): ScheduleGrid =>
  Array.from({ length: 10 }, () =>
    Array.from({ length: 2 }, () => Array.from({ length: 4 }, () => null)),
  );

// The normalized grid is private. Consumers receive read models below and
// change it exclusively through commands, keeping scheduling rules centralized.
const scheduleGridStateAtom = atomWithReset<ScheduleGrid>(createInitialGrid());

export const scheduleGridAtom = atom((get) => get(scheduleGridStateAtom));
export const shareButtonLoadingUntilAtom = atom(0);

const semesterAtomFamily = atomFamily((semester: number) =>
  atom((get) => get(scheduleGridStateAtom)[semester] ?? []),
);

const periodAtomFamily = atomFamily((key: number) => {
  const semester = Math.floor(key / 10);
  const period = key % 10;
  return atom((get) => get(scheduleGridStateAtom)[semester]?.[period] ?? []);
});

const slotAtomFamily = atomFamily((key: number) => {
  const semester = Math.floor(key / 100);
  const period = Math.floor(key / 10) % 10;
  const block = key % 10;
  return atom(
    (get) => get(scheduleGridStateAtom)[semester]?.[period]?.[block] ?? null,
  );
});

const periodSlotCountAtomFamily = atomFamily((key: number) =>
  atom((get) => get(periodAtomFamily(key)).length),
);

const periodCreditsAtomFamily = atomFamily((key: number) => {
  const semester = Math.floor(key / 10);
  const periodNumber = key % 10;
  return atom((get) => {
    const periods = get(semesterAtomFamily(semester));
    const courses = new Map(
      (periods[periodNumber] ?? [])
        .filter((course): course is Course => course !== null)
        .map((course) => [course.code, course]),
    );
    return [...courses.values()].reduce((total, course) => {
      const scheduledPeriodCount = periods.filter((period) =>
        period.some((slot) => slot?.code === course.code),
      ).length;
      return total + course.credits / scheduledPeriodCount;
    }, 0);
  });
});

const ghostVisibilityAtomFamily = atomFamily((key: string) => {
  const [semesterNumber, periodNumber, startingYear] = key
    .split(":")
    .map(Number);
  return atom((get) => {
    const draggedCourse = get(draggedCourseAtom);
    if (!draggedCourse) return false;
    const blocks = get(
      periodAtomFamily(semesterNumber * 10 + periodNumber),
    );
    if (
      blocks.some(
        (course, index) =>
          index >= WILDCARD_BLOCK_START && course?.code === draggedCourse.code,
      )
    ) {
      return false;
    }
    const { year, semester } = relativeSemesterToYearAndSemester(
      startingYear,
      semesterNumber,
    );
    const hasWildcardOption = draggedCourse.CourseOccasion.some(
      (occasion) =>
        occasion.year === year &&
        occasion.semester === semester &&
        occasion.periods.some(
          (period) => period.period === periodNumber + 1,
        ),
    );
    return (
      hasWildcardOption &&
      blocks.slice(WILDCARD_BLOCK_START).every((slot) => slot !== null)
    );
  });
});

export const semesterAtom = (semester: number) => semesterAtomFamily(semester);
export const periodAtom = (semester: number, period: number) =>
  periodAtomFamily(semester * 10 + period);
export const slotAtom = (semester: number, period: number, block: number) =>
  slotAtomFamily(semester * 100 + period * 10 + block);
export const periodSlotCountAtom = (semester: number, period: number) =>
  periodSlotCountAtomFamily(semester * 10 + period);
export const periodCreditsAtom = (semester: number, period: number) =>
  periodCreditsAtomFamily(semester * 10 + period);
export const ghostVisibilityAtom = (
  semester: number,
  period: number,
  startingYear: number,
) => ghostVisibilityAtomFamily(`${semester}:${period}:${startingYear}`);

export const selectedCoursesAtom = atom((get) => {
  const uniqueCourses = new Map<string, Course>();
  get(scheduleGridStateAtom).forEach((semester) =>
    semester.forEach((period) =>
      period.forEach((course) => {
        if (course) uniqueCourses.set(course.code, course);
      }),
    ),
  );
  return [...uniqueCourses.values()];
});

export const scheduledCourseCodesAtom = atom((get) => {
  const codes = new Set<string>();
  get(scheduleGridStateAtom).forEach((semester) =>
    semester.forEach((period) =>
      period.forEach((course) => {
        if (course) codes.add(course.code);
      }),
    ),
  );
  return codes;
});

export const selectedMasterCoursesAtom = atom((get) => {
  const { start, end } = get(masterPeriodAtom);
  const courses = new Map<string, Course>();
  const schedules = get(scheduleGridStateAtom);
  for (let semester = start - 1; semester < end; semester += 1) {
    schedules[semester]?.forEach((period) =>
      period.forEach((course) => {
        if (course) courses.set(course.code, course);
      }),
    );
  }
  return [...courses.values()];
});

export const addBlockToSemesterAtom = atom(
  null,
  (_get, set, semester: number) => {
    set(scheduleGridStateAtom, (grid) =>
      produce(grid, (draft) => {
        draft[semester]?.forEach((period) => period.push(null));
      }),
    );
  },
);

export const deleteBlockFromSemesterAtom = atom(
  null,
  (_get, set, { semester, blockIndex }: DeleteBlockFromSemesterArgs) => {
    if (blockIndex < WILDCARD_BLOCK_START) return;
    set(scheduleGridStateAtom, (grid) =>
      produce(grid, (draft) => {
        draft[semester]?.forEach((period) => {
          if (blockIndex < period.length) period.splice(blockIndex, 1);
        });
      }),
    );
  },
);

export const addCourseAtom = atom(
  null,
  (
    _get,
    set,
    {
      course,
      occasion,
      semesterIndex,
    }: AddCourseArgs & { semesterIndex: number },
  ) => {
    set(shareButtonLoadingUntilAtom, Date.now() + SHARE_BUTTON_LOADING_MS);
    set(scheduleGridStateAtom, (grid) =>
      placeCourse({ course, grid, occasion, semesterIndex }),
    );
  },
);

export const removeCourseAtom = atom(
  null,
  (_get, set, { courseCode }: RemoveCourseArgs) => {
    set(scheduleGridStateAtom, (grid) =>
      removeCourseFromGrid(grid, courseCode),
    );
  },
);

export const hydrateScheduleAtom = atom(
  null,
  (_get, set, grid: ScheduleGrid) => {
    set(scheduleGridStateAtom, grid);
  },
);

export const resetScheduleAtom = atom(null, (_get, set) => {
  set(scheduleGridStateAtom, RESET);
  set(shareButtonLoadingUntilAtom, 0);
});
