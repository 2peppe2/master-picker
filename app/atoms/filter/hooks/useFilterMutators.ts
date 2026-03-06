import { useCallback, useMemo } from "react";
import { filterAtoms } from "../atoms";
import { RESET } from "jotai/utils";
import { useSetAtom } from "jotai";

export const useFilterMutators = () => {
  const setExcludeSlotConflicts = useSetAtom(
    filterAtoms.excludeSlotConflictsAtom,
  );
  const setSemester = useSetAtom(filterAtoms.semesterAtom);
  const setPeriods = useSetAtom(filterAtoms.periodsAtom);
  const setBlocks = useSetAtom(filterAtoms.blocksAtom);
  const setMaster = useSetAtom(filterAtoms.masterAtom);
  const setSearch = useSetAtom(filterAtoms.searchAtom);

  const resetFilter = useCallback(() => {
    setSearch(RESET);
    setMaster(RESET);
    setBlocks(RESET);
    setPeriods(RESET);
    setSemester(RESET);
    setExcludeSlotConflicts(RESET);
  }, [
    setBlocks,
    setExcludeSlotConflicts,
    setMaster,
    setPeriods,
    setSearch,
    setSemester,
  ]);

  return useMemo(
    () => ({
      resetFilter,
      filterByTerm: setSearch,
      selectMaster: setMaster,
      selectBlocks: setBlocks,
      selectSemester: setSemester,
      selectPeriods: setPeriods,
      excludeSlotConflicts: setExcludeSlotConflicts,
    }),
    [
      resetFilter,
      setBlocks,
      setExcludeSlotConflicts,
      setMaster,
      setPeriods,
      setSearch,
      setSemester,
    ],
  );
};
