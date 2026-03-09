"use client";

import { MultiSelect, MultiSelectGroup } from "@/components/ui/multi-select";
import { GraduationCap, LayoutGrid, Calendar } from "lucide-react";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { filterAtoms } from "@/app/atoms/filter/atoms";
import { MasterBadge } from "@/components/MasterBadge";
import { mastersAtom } from "@/app/atoms/mastersAtom";
import { useAtom, useAtomValue } from "jotai";
import React, { FC, useMemo } from "react";
import { range } from "lodash";

export const UnifiedSearchFilter: FC = () => {
  const [semesters, selectSemesters] = useAtom(filterAtoms.semestersAtom);
  const [masters, selectMasters] = useAtom(filterAtoms.mastersAtom);
  const [periods, selectPeriods] = useAtom(filterAtoms.periodsAtom);
  const { showBachelorYears } = useAtomValue(userPreferencesAtom);
  const [blocks, selectBlocks] = useAtom(filterAtoms.blocksAtom);
  const [search, searchFor] = useAtom(filterAtoms.searchAtom);
  const allMasters = useAtomValue(mastersAtom);

  const semesterOptions = useMemo(() => {
    const start = showBachelorYears ? 1 : 7;

    return {
      heading: "Semesters",
      options: range(start, 11).map((s) => ({
        label: `Semester ${s}`,
        value: `semester:${s}`,
        icon: GraduationCap,
      })),
    } satisfies MultiSelectGroup;
  }, [showBachelorYears]);

  const masterOptions = useMemo(
    () =>
      ({
        heading: "Master Profiles",
        options: Object.values(allMasters).map((m) => ({
          value: `master:${m.master}`,
          label: m.name ?? "Unknown",
          icon: () => <MasterBadge name={m.master} />,
        })),
      }) satisfies MultiSelectGroup,
    [allMasters],
  );

  const groupedOptions = useMemo<MultiSelectGroup[]>(
    () => [
      masterOptions,
      semesterOptions,
      {
        heading: "Timeframes",
        options: [
          ...range(1, 5).map((b) => ({
            label: `Block ${b}`,
            value: `block:${b}`,
            icon: LayoutGrid,
          })),
          ...range(1, 3).map((p) => ({
            label: `Period ${p}`,
            value: `period:${p}`,
            icon: Calendar,
          })),
        ],
      },
    ],
    [masterOptions, semesterOptions],
  );

  const selectedValues = useMemo(() => {
    const values: string[] = [];

    semesters.forEach((s) => values.push(`semester:${s}`));
    masters.forEach((m) => values.push(`master:${m}`));
    periods.forEach((p) => values.push(`period:${p}`));
    blocks.forEach((b) => values.push(`block:${b}`));

    if (search) {
      values.push(`search:${search}`);
    }

    return values;
  }, [masters, semesters, blocks, periods, search]);

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

    // Clear search if the badge is removed
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
        onCreateOption={searchFor}
        onSearchChange={searchFor}
        placeholder="Filter by master, semester, block, or type anything..."
      />
    </div>
  );
};

export default UnifiedSearchFilter;
