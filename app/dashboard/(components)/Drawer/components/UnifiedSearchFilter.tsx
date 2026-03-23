"use client";

import { preferenceAtoms } from "@/app/dashboard/(store)/preferences/atoms";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { MultiSelectGroup } from "@/components/ui/MultiSelect/types";
import { filterAtoms } from "@/app/dashboard/(store)/filter/atoms";
import { useMasterAtom } from "@/app/(store)/hooks/useMasterAtom";
import { coursesAtom } from "@/app/dashboard/(store)/store";
import MultiSelect from "@/components/ui/MultiSelect";
import MasterBadge from "@/components/MasterBadge";
import { useAtom, useAtomValue } from "jotai";
import React, { FC, useMemo } from "react";
import { range, uniq } from "lodash";
import {
  GraduationCap,
  LayoutGrid,
  Calendar,
  CircleStar,
  Shapes,
} from "lucide-react";
import Translate from "@/common/components/translate/Translate";

const UnifiedSearchFilter: FC = () => {
  const showBachelorYears = useAtomValue(preferenceAtoms.showBachelorYearsAtom);
  const [mainFields, selectMainFields] = useAtom(filterAtoms.mainFieldsAtom);
  const [semesters, selectSemesters] = useAtom(filterAtoms.semestersAtom);
  const [masters, selectMasters] = useAtom(filterAtoms.mastersAtom);
  const [periods, selectPeriods] = useAtom(filterAtoms.periodsAtom);
  const [blocks, selectBlocks] = useAtom(filterAtoms.blocksAtom);
  const [levels, selectLevels] = useAtom(filterAtoms.levelsAtom);
  const [search, searchFor] = useAtom(filterAtoms.searchAtom);
  const allCourses = useAtomValue(coursesAtom);
  const allMasters = useMasterAtom();
  const translate = useCommonTranslate();

  const CATEGORY_LABELS = useMemo<Record<string, string>>(
    () => ({
      master: translate("profiles"),
      semester: translate("semesters"),
      block: translate("blocks"),
      period: translate("periods"),
      level: translate("levels"),
      mainField: translate("fields"),
    }),
    [translate],
  );

  const LEVELS_LABELS = useMemo<Record<string, string>>(
    () => ({
      G: translate("basic"),
      A: translate("advanced"),
    }),
    [translate],
  );

  const mainFieldOptions = useMemo(() => {
    const uniqueFields = uniq(
      Object.values(allCourses).flatMap((c) => c.mainField || []),
    ).sort();

    return {
      heading: translate("main_fields"),
      options: uniqueFields.map((field) => ({
        label: field,
        dropdownLabel: (
          <div className="flex items-center gap-2 truncate">
            <Shapes className="h-4 w-4 opacity-70" />
            <span className="truncate">{field}</span>
          </div>
        ),
        searchKey: field,
        value: `mainField:${field}`,
      })),
    };
  }, [allCourses, translate]);

  const semesterOptions = useMemo(() => {
    const start = showBachelorYears ? 1 : 7;
    return {
      heading: translate("semesters"),
      options: range(start, 11).map((s) => ({
        label: `${s}`,
        dropdownLabel: (
          <div className="flex items-center gap-2 truncate">
            <GraduationCap className="h-4 w-4 opacity-70" />
            <span className="truncate">
              <Translate text="_semester_label" args={{ s }} />
            </span>
          </div>
        ),
        searchKey: translate("_semester_label", { s }),
        value: `semester:${s}`,
      })),
    };
  }, [showBachelorYears, translate]);

  const blockOptions = useMemo(
    () => ({
      heading: translate("blocks"),
      options: range(1, 5).map((b) => ({
        label: `${b}`,
        dropdownLabel: (
          <div className="flex items-center gap-2 truncate">
            <LayoutGrid className="h-4 w-4 opacity-70" />
            <span className="truncate">
              <Translate text="_block_label" args={{ b }} />
            </span>
          </div>
        ),
        searchKey: translate("_block_label", { b }),
        value: `block:${b}`,
      })),
    }),
    [translate],
  );

  const periodOptions = useMemo(
    () => ({
      heading: translate("periods"),
      options: range(1, 3).map((p) => ({
        label: `${p}`,
        dropdownLabel: (
          <div className="flex items-center gap-2 truncate">
            <Calendar className="h-4 w-4 opacity-70" />
            <span className="truncate">
              <Translate text="_period_label" args={{ p }} />
            </span>
          </div>
        ),
        searchKey: translate("_period_label", { p }),
        value: `period:${p}`,
      })),
    }),
    [translate],
  );

  const masterOptions = useMemo(
    () => ({
      heading: translate("master_profiles"),
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
    [allMasters, translate],
  );

  const levelOptions = useMemo(
    () => ({
      heading: translate("levels"),
      options: Object.keys(LEVELS_LABELS).map((level) => ({
        value: `level:${level}`,
        label: LEVELS_LABELS[level],
        dropdownLabel: (
          <div className="flex items-center gap-2 truncate">
            <CircleStar className="h-4 w-4 opacity-70" />
            <span className="truncate">{LEVELS_LABELS[level]}</span>
          </div>
        ),
        searchKey: LEVELS_LABELS[level],
      })),
    }),
    [LEVELS_LABELS, translate],
  );

  const groupedOptions = useMemo<MultiSelectGroup[]>(
    () => [
      semesterOptions,
      blockOptions,
      periodOptions,
      levelOptions,
      masterOptions,
      mainFieldOptions,
    ],
    [
      semesterOptions,
      blockOptions,
      periodOptions,
      masterOptions,
      levelOptions,
      mainFieldOptions,
    ],
  );

  const selectedValues = useMemo(() => {
    const values: string[] = [];

    semesters.forEach((s) => values.push(`semester:${s}`));
    blocks.forEach((b) => values.push(`block:${b}`));
    periods.forEach((p) => values.push(`period:${p}`));
    masters.forEach((m) => values.push(`master:${m}`));
    levels.forEach((l) => values.push(`level:${l}`));
    mainFields.forEach((f) => values.push(`mainField:${f}`));

    if (search) {
      values.push(`search:${search}`);
    }

    return values;
  }, [masters, semesters, blocks, periods, levels, search, mainFields]);

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
    selectMainFields(
      newValues
        .filter((v) => v.startsWith("mainField:"))
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
        placeholder={translate("filter_by_master_field_or_type")}
      />
    </div>
  );
};

export default UnifiedSearchFilter;
