"use client";

import { GraduationCap, LayoutGrid, Calendar, CircleStar } from "lucide-react";
import { preferenceAtoms } from "@/app/dashboard/(store)/preferences/atoms";
import { MultiSelectGroup } from "@/components/ui/MultiSelect/types";
import { filterAtoms } from "@/app/dashboard/(store)/filter/atoms";
import { useMasterAtom } from "@/app/store/hooks/useMasterAtom";
import MultiSelect from "@/components/ui/MultiSelect";
import MasterBadge from "@/components/MasterBadge";
import { useAtom, useAtomValue } from "jotai";
import React, { FC, useMemo } from "react";
import { range } from "lodash";

const CATEGORY_LABELS: Record<string, string> = {
  master: "Profiles",
  semester: "Semesters",
  block: "Blocks",
  period: "Periods",
  level: "Levels",
};

const LEVELS: Record<string, string> = {
  G: "Basic",
  A: "Advanced",
};

const UnifiedSearchFilter: FC = () => {
  const showBachelorYears = useAtomValue(preferenceAtoms.showBachelorYearsAtom);
  const [semesters, selectSemesters] = useAtom(filterAtoms.semestersAtom);
  const [masters, selectMasters] = useAtom(filterAtoms.mastersAtom);
  const [periods, selectPeriods] = useAtom(filterAtoms.periodsAtom);
  const [blocks, selectBlocks] = useAtom(filterAtoms.blocksAtom);
  const [levels, selectLevels] = useAtom(filterAtoms.levelsAtom);
  const [search, searchFor] = useAtom(filterAtoms.searchAtom);
  const allMasters = useMasterAtom();

  const semesterOptions = useMemo(() => {
    const start = showBachelorYears ? 1 : 7;
    return {
      heading: "Semesters",
      options: range(start, 11).map((s) => ({
        label: `${s}`,
        dropdownLabel: (
          <div className="flex items-center gap-2 truncate">
            <GraduationCap className="h-4 w-4 opacity-70" />
            <span className="truncate">Semester {s}</span>
          </div>
        ),
        searchKey: `Semester ${s}`,
        value: `semester:${s}`,
      })),
    };
  }, [showBachelorYears]);

  const blockOptions = useMemo(
    () => ({
      heading: "Blocks",
      options: range(1, 5).map((b) => ({
        label: `${b}`,
        dropdownLabel: (
          <div className="flex items-center gap-2 truncate">
            <LayoutGrid className="h-4 w-4 opacity-70" />
            <span className="truncate">Block {b}</span>
          </div>
        ),
        searchKey: `Block ${b}`,
        value: `block:${b}`,
      })),
    }),
    [],
  );

  const periodOptions = useMemo(
    () => ({
      heading: "Periods",
      options: range(1, 3).map((p) => ({
        label: `${p}`,
        dropdownLabel: (
          <div className="flex items-center gap-2 truncate">
            <Calendar className="h-4 w-4 opacity-70" />
            <span className="truncate">Period {p}</span>
          </div>
        ),
        searchKey: `Period ${p}`,
        value: `period:${p}`,
      })),
    }),
    [],
  );

  const masterOptions = useMemo(
    () => ({
      heading: "Master Profiles",
      options: Object.values(allMasters).map((m) => ({
        value: `master:${m.master}`,
        label: <MasterBadge name={m.master} />,
        dropdownLabel: (
          <div className="flex items-center gap-2 truncate w-full">
            <MasterBadge name={m.master} />
            <span className="truncate font-medium">{m.name ?? m.master}</span>
          </div>
        ),
        searchKey: m.name ?? m.master,
      })),
    }),
    [allMasters],
  );

  const levelOptions = useMemo(
    () => ({
      heading: "Levels",
      options: Object.keys(LEVELS).map((level) => ({
        value: `level:${level}`,
        label: LEVELS[level],
        dropdownLabel: (
          <div className="flex items-center gap-2 truncate">
            <CircleStar className="h-4 w-4 opacity-70" />
            <span className="truncate">{LEVELS[level]}</span>
          </div>
        ),
        searchKey: LEVELS[level],
      })),
    }),
    [],
  );

  const groupedOptions = useMemo<MultiSelectGroup[]>(
    () => [
      semesterOptions,
      blockOptions,
      periodOptions,
      levelOptions,
      masterOptions,
    ],
    [semesterOptions, blockOptions, periodOptions, masterOptions, levelOptions],
  );

  const selectedValues = useMemo(() => {
    const values: string[] = [];

    semesters.forEach((s) => values.push(`semester:${s}`));
    blocks.forEach((b) => values.push(`block:${b}`));
    periods.forEach((p) => values.push(`period:${p}`));
    masters.forEach((m) => values.push(`master:${m}`));
    levels.forEach((l) => values.push(`level:${l}`));

    if (search) {
      values.push(`search:${search}`);
    }

    return values;
  }, [masters, semesters, blocks, periods, levels, search]);

  const handleValueChange = (newValues: string[]) => {
    selectMasters(
      newValues
        .filter((v) => v.startsWith("master:"))
        .map((v) => v.split(":")[1]),
    );
    selectSemesters(
      newValues
        .filter((v) => v.startsWith("semester:"))
        .map((v) => Number(v.split(":")[1])),
    );
    selectBlocks(
      newValues
        .filter((v) => v.startsWith("block:"))
        .map((v) => Number(v.split(":")[1])),
    );
    selectPeriods(
      newValues
        .filter((v) => v.startsWith("period:"))
        .map((v) => Number(v.split(":")[1])),
    );
    selectLevels(
      newValues
        .filter((v) => v.startsWith("level:"))
        .map((v) => v.split(":")[1]),
    );

    if (!newValues.some((v) => v.startsWith("search:"))) {
      searchFor("");
    }
  };

  return (
    <div className="w-full">
      <MultiSelect
        options={groupedOptions}
        defaultValue={selectedValues}
        onValueChange={handleValueChange}
        onSearchChange={searchFor}
        categoryLabels={CATEGORY_LABELS}
        placeholder="Filter by master, block, or type..."
      />
    </div>
  );
};

export default UnifiedSearchFilter;
