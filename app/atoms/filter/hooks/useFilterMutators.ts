import { useCallback, useMemo } from "react";
import { filterAtoms } from "../atoms";
import { RESET } from "jotai/utils";
import { useSetAtom } from "jotai";

export const useFilterMutators = () => {
  const setExcludeSlotConflicts = useSetAtom(
    filterAtoms.excludeSlotConflictsAtom,
  );
  const setSemesters = useSetAtom(filterAtoms.semestersAtom);
  const setPeriods = useSetAtom(filterAtoms.periodsAtom);
  const setBlocks = useSetAtom(filterAtoms.blocksAtom);
  const setMasters = useSetAtom(filterAtoms.mastersAtom);
  const setSearch = useSetAtom(filterAtoms.searchAtom);

  const resetFilter = useCallback(() => {
    setSearch(RESET);
    setMasters(RESET);
    setBlocks(RESET);
    setPeriods(RESET);
    setSemesters(RESET);
    setExcludeSlotConflicts(RESET);
  }, [
    setBlocks,
    setExcludeSlotConflicts,
    setMasters,
    setPeriods,
    setSearch,
    setSemesters,
  ]);

  return useMemo(
    () => ({
      resetFilter,
      filterByTerm: setSearch,
      selectMasters: setMasters,
      selectBlocks: setBlocks,
      selectSemesters: setSemesters,
      selectPeriods: setPeriods,
      excludeSlotConflicts: setExcludeSlotConflicts,
    }),
    [
      resetFilter,
      setBlocks,
      setExcludeSlotConflicts,
      setMasters,
      setPeriods,
      setSearch,
      setSemesters,
    ],
  );
};
