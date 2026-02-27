import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import { SemesterOption } from "@/app/atoms/filter/types";
import { filterAtoms } from "@/app/atoms/filter/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useEffect } from "react";

const FilterSync: FC = () => {
  const shownSemester = useAtomValue(scheduleAtoms.shownSemesterAtom);
  const setFilteredSemester = useSetAtom(filterAtoms.semesterAtom);

  useEffect(() => {
    setFilteredSemester(
      shownSemester === null ? "all" : (shownSemester as SemesterOption),
    );
  }, [setFilteredSemester, shownSemester]);

  return null;
};

export default FilterSync;
