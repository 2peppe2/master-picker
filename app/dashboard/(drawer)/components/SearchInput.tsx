"use client";

import { useFilterMutators } from "@/app/atoms/filter/hooks/useFilterMutators";
import { MultiSelect, MultiSelectGroup } from "@/components/ui/multi-select";
import { GraduationCap, LayoutGrid, Calendar } from "lucide-react";
import { filterAtoms } from "@/app/atoms/filter/atoms";
import { MasterBadge } from "@/components/MasterBadge";
import { mastersAtom } from "@/app/atoms/mastersAtom";
import React, { FC, useMemo } from "react";
import { useAtomValue } from "jotai";
import { range } from "lodash";

export const UnifiedSearchFilter: FC = () => {
  const currentMasters = useAtomValue(filterAtoms.mastersAtom);
  const mastersList = useAtomValue(mastersAtom);
  const currentSemesters = useAtomValue(filterAtoms.semestersAtom);
  const currentBlocks = useAtomValue(filterAtoms.blocksAtom);
  const currentPeriods = useAtomValue(filterAtoms.periodsAtom);
  const currentSearch = useAtomValue(filterAtoms.searchAtom);

  const {
    selectMasters,
    selectSemesters,
    selectBlocks,
    selectPeriods,
    filterByTerm,
  } = useFilterMutators();

  const groupedOptions = useMemo<MultiSelectGroup[]>(
    () => [
      {
        heading: "Master Profiles",
        options: Object.values(mastersList).map((m) => ({
          value: `master:${m.master}`,
          label: m.name ?? "Unknown",
          icon: () => <MasterBadge name={m.master} />,
        })),
      },
      {
        heading: "Semesters",
        options: range(1, 11).map((s) => ({
          label: `Semester ${s}`,
          value: `semester:${s}`,
          icon: GraduationCap,
        })),
      },
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
    [mastersList],
  );

  // Derive active selection strings
  const selectedValues = useMemo(() => {
    const vals: string[] = [];
    currentMasters?.forEach((m) => vals.push(`master:${m}`));
    currentSemesters?.forEach((s) => vals.push(`semester:${s}`));
    currentBlocks?.forEach((b) => vals.push(`block:${b}`));
    currentPeriods?.forEach((p) => vals.push(`period:${p}`));
    if (currentSearch) vals.push(`search:${currentSearch}`);
    return vals;
  }, [
    currentMasters,
    currentSemesters,
    currentBlocks,
    currentPeriods,
    currentSearch,
  ]);

  const handleValueChange = (newValues: string[]) => {
    // Sync all categories back to Jotai
    selectMasters(
      newValues
        .filter((v) => v.startsWith("master:"))
        .map((v) => v.split(":")[1]),
    );
    selectSemesters(
      newValues
        .filter((v) => v.startsWith("semester:"))
        .map((v) => Number(v.split(":")[1])), // Fixed: Requires Number casting
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
    if (!newValues.some((v) => v.startsWith("search:"))) filterByTerm("");
  };

  return (
    <div className="w-full">
      <MultiSelect
        options={groupedOptions}
        defaultValue={selectedValues}
        onValueChange={handleValueChange}
        onSearchChange={filterByTerm} // <-- Hooked up to fire on keystrokes
        onCreateOption={filterByTerm}
        placeholder="Filter by master, semester, block, or type anything..."
      />
    </div>
  );
};

export default UnifiedSearchFilter;
