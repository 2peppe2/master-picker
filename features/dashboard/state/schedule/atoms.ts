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

/** Bounded numeric atom-family keys: 10 semesters × 2 periods × dynamic blocks. */
export const semesterAtom = (semester: number) => semesterAtomFamily(semester);
export const periodAtom = (semester: number, period: number) =>
  periodAtomFamily(semester * 10 + period);
export const slotAtom = (semester: number, period: number, block: number) =>
  slotAtomFamily(semester * 100 + period * 10 + block);

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
