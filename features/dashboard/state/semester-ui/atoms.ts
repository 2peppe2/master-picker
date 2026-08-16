import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import { blocksAtom, periodsAtom, semestersAtom } from "../filter/atoms";

interface FocusScheduleSlotArgs {
  semester: number;
  period: number;
  block: number;
}

interface AutoExpandedSemester {
  semester: number;
  filterWasIncluded: boolean;
}

const expandedSemestersStateAtom = atom<number[]>([]);
const autoExpandedSemestersStateAtom = atom<AutoExpandedSemester[]>([]);

export const expandedSemestersAtom = atom((get) =>
  get(expandedSemestersStateAtom),
);
export const autoExpandedSemestersAtom = atom((get) =>
  get(autoExpandedSemestersStateAtom),
);
export const isSemesterExpandedAtom = atomFamily((semester: number) =>
  atom((get) => get(expandedSemestersStateAtom).includes(semester)),
);

const setSemesterFilterAtom = atom(
  null,
  (
    get,
    set,
    { semester, included }: { semester: number; included: boolean },
  ) => {
    const selected = get(semestersAtom);
    if (selected.includes(semester) === included) return;
    set(
      semestersAtom,
      included
        ? [...selected, semester]
        : selected.filter((value) => value !== semester),
    );
  },
);

const toggleSemesterExpansionAtom = atom(null, (get, set, semester: number) => {
  const expanded = get(expandedSemestersStateAtom);
  const isExpanded = expanded.includes(semester);
  set(
    expandedSemestersStateAtom,
    isExpanded
      ? expanded.filter((value) => value !== semester)
      : [...expanded, semester],
  );
  return !isExpanded;
});

export const initializeSemesterAtom = atom(
  null,
  (_get, set, semester: number) => {
    set(expandedSemestersStateAtom, [semester]);
    set(semestersAtom, [semester]);
  },
);

export const openSemesterAtom = atom(null, (get, set, semester: number) => {
  const expanded = get(expandedSemestersStateAtom);
  const selected = get(semestersAtom);
  if (!expanded.includes(semester))
    set(expandedSemestersStateAtom, [...expanded, semester]);

  if (!selected.includes(semester)) set(semestersAtom, [...selected, semester]);
});

export const autoOpenSemesterAtom = atom(null, (get, set, semester: number) => {
  const expanded = get(expandedSemestersStateAtom);
  if (expanded.includes(semester)) return;
  const filterWasIncluded = get(semestersAtom).includes(semester);
  set(expandedSemestersStateAtom, [...expanded, semester]);
  set(autoExpandedSemestersStateAtom, (items) => [
    ...items,
    { semester, filterWasIncluded },
  ]);
  set(setSemesterFilterAtom, { semester, included: true });
});

export const closeAutoExpandedSemesterAtom = atom(
  null,
  (get, set, semester: number) => {
    const items = get(autoExpandedSemestersStateAtom);
    const item = items.find((value) => value.semester === semester);
    if (!item) return;
    set(
      autoExpandedSemestersStateAtom,
      items.filter((value) => value.semester !== semester),
    );
    set(
      expandedSemestersStateAtom,
      get(expandedSemestersStateAtom).filter((value) => value !== semester),
    );
    if (!item.filterWasIncluded)
      set(setSemesterFilterAtom, { semester, included: false });
  },
);

export const retainAutoExpandedSemesterAtom = atom(
  null,
  (get, set, semester: number) => {
    set(
      autoExpandedSemestersStateAtom,
      get(autoExpandedSemestersStateAtom).filter(
        (item) => item.semester !== semester,
      ),
    );
  },
);

export const clearAutoExpandedSemestersAtom = atom(null, (get, set) => {
  const autoExpanded = get(autoExpandedSemestersStateAtom);
  set(
    expandedSemestersStateAtom,
    get(expandedSemestersStateAtom).filter(
      (semester) => !autoExpanded.some((item) => item.semester === semester),
    ),
  );
  set(autoExpandedSemestersStateAtom, []);
  autoExpanded.forEach(({ semester, filterWasIncluded }) => {
    if (!filterWasIncluded)
      set(setSemesterFilterAtom, { semester, included: false });
  });
});

export const toggleSemesterAtom = atom(null, (_get, set, semester: number) => {
  const included = set(toggleSemesterExpansionAtom, semester);
  set(setSemesterFilterAtom, { semester, included });
});

export const focusScheduleSlotAtom = atom(
  null,
  (get, set, { semester, period, block }: FocusScheduleSlotArgs) => {
    const expanded = get(expandedSemestersStateAtom);
    if (!expanded.includes(semester))
      set(expandedSemestersStateAtom, [...expanded, semester]);
    set(semestersAtom, [semester]);
    set(periodsAtom, [period]);
    set(blocksAtom, [block]);
  },
);
