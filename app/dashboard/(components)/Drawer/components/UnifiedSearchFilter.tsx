"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { useCourseTranslate } from "@/common/components/translate/hooks/useCourseTranslate";
import { preferenceAtoms } from "@/app/dashboard/(store)/preferences/atoms";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { MultiSelectGroup } from "@/components/ui/MultiSelect/types";
import {
  encodeOptionValue,
  parseOptionValue,
} from "@/components/ui/MultiSelect/polarity";
import { filterAtoms } from "@/app/dashboard/(store)/filter/atoms";
import { useMasterAtom } from "@/app/(store)/hooks/useMasterAtom";
import Translate from "@/common/components/translate/Translate";
import { coursesAtom } from "@/app/dashboard/(store)/store";
import MultiSelect from "@/components/ui/MultiSelect";
import MasterBadge from "@/components/MasterBadge";
import { useAtom, useAtomValue } from "jotai";
import React, { FC, useMemo } from "react";
import { range, uniq } from "lodash";
import {
  EXAMINATION_TYPES,
  ExaminationType,
  getCourseExaminationTypes,
  isExaminationType,
} from "@/lib/examinationTypes";
import {
  GraduationCap,
  LayoutGrid,
  Calendar,
  CircleStar,
  Layers,
  Shapes,
  FileText,
  Laptop,
  FlaskConical,
  ClipboardList,
  FolderKanban,
  Mic,
  Users,
  ListChecks,
  Ban,
  Check,
} from "lucide-react";

const EXAMINATION_ICONS: Record<
  ExaminationType,
  React.ComponentType<{ className?: string }>
> = {
  written_exam: FileText,
  computer_exam: Laptop,
  lab: FlaskConical,
  assignment: ClipboardList,
  project: FolderKanban,
  oral: Mic,
  seminar: Users,
  optional_test: ListChecks,
};

const UnifiedSearchFilter: FC = () => {
  const showBachelorYears = useAtomValue(preferenceAtoms.showBachelorYearsAtom);
  const [mainFields, selectMainFields] = useAtom(filterAtoms.mainFieldsAtom);
  const [semesters, selectSemesters] = useAtom(filterAtoms.semestersAtom);
  const [masters, selectMasters] = useAtom(filterAtoms.mastersAtom);
  const [periods, selectPeriods] = useAtom(filterAtoms.periodsAtom);
  const [blocks, selectBlocks] = useAtom(filterAtoms.blocksAtom);
  const [levels, selectLevels] = useAtom(filterAtoms.levelsAtom);
  const [search, searchFor] = useAtom(filterAtoms.searchAtom);
  const [examinationTypes, selectExaminationTypes] = useAtom(
    filterAtoms.examinationTypesAtom,
  );
  const [exMainFields, excludeMainFields] = useAtom(
    filterAtoms.excludedMainFieldsAtom,
  );
  const [exSemesters, excludeSemesters] = useAtom(
    filterAtoms.excludedSemestersAtom,
  );
  const [exMasters, excludeMasters] = useAtom(filterAtoms.excludedMastersAtom);
  const [exPeriods, excludePeriods] = useAtom(filterAtoms.excludedPeriodsAtom);
  const [exBlocks, excludeBlocks] = useAtom(filterAtoms.excludedBlocksAtom);
  const [exLevels, excludeLevels] = useAtom(filterAtoms.excludedLevelsAtom);
  const [excludedExaminationTypes, excludeExaminationTypes] = useAtom(
    filterAtoms.excludedExaminationTypesAtom,
  );
  const allCourses = useAtomValue(coursesAtom);
  const allMasters = useMasterAtom();

  const coursesTranslate = useCourseTranslate();
  const translate = useCommonTranslate();

  const CATEGORY_LABELS = useMemo<Record<string, string>>(
    () => ({
      master: translate("profiles"),
      semester: translate("semesters"),
      block: translate("blocks"),
      period: translate("periods"),
      level: translate("levels"),
      mainField: translate("fields"),
      examination: translate("examinations"),
    }),
    [translate],
  );

  /**
   * Turns a plain category into the two-step "Har"/"Utan" shape: the same
   * options twice, the second time with negated values and a struck-through
   * chip label. Both polarities keep the category's prefix, so a dimension
   * still consolidates into one badge.
   */
  const withPolarity = useMemo(
    () =>
      (group: MultiSelectGroup): MultiSelectGroup => {
        const excludedOptions = group.options.map((option) => {
          const { prefix, value } = parseOptionValue(option.value);

          return {
            ...option,
            value: encodeOptionValue(prefix, value, { negated: true }),
            label: (
              <span className="text-destructive line-through">
                {option.label}
              </span>
            ),
            searchKey: `${translate("_exclude")} ${option.searchKey}`,
          };
        });

        const noun = group.heading.toLowerCase();

        return {
          ...group,
          options: [...group.options, ...excludedOptions],
          sections: [
            {
              key: "include",
              label: translate("_include"),
              headerLabel: translate("_include_x", { x: noun }),
              icon: Check,
              options: group.options,
            },
            {
              key: "exclude",
              label: translate("_exclude"),
              headerLabel: translate("_exclude_x", { x: noun }),
              icon: Ban,
              options: excludedOptions,
            },
          ],
        };
      },
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
      icon: Shapes,
      options: uniqueFields.map((field) => ({
        label: coursesTranslate(field),
        dropdownLabel: (
          <div className="flex items-center gap-2 truncate">
            <Shapes className="h-4 w-4 opacity-70" />
            <span className="truncate">
              <CourseTranslate text={field} />
            </span>
          </div>
        ),
        searchKey: field,
        value: `mainField:${field}`,
      })),
    };
  }, [allCourses, translate, coursesTranslate]);

  const semesterOptions = useMemo(() => {
    const start = showBachelorYears ? 1 : 7;
    return {
      heading: translate("semesters"),
      icon: GraduationCap,
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
      icon: LayoutGrid,
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
      icon: Calendar,
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
      icon: Layers,
      options: Object.values(allMasters).map((m) => ({
        value: `master:${m.master}`,
        label: <MasterBadge name={m.master} />,
        dropdownLabel: (
          <div className="flex items-center gap-2 truncate w-full">
            <MasterBadge name={m.master} />
            <span className="truncate font-medium">
              <CourseTranslate text={m.name ?? m.master} />
            </span>
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
      icon: CircleStar,
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

  // Only offer types that some loaded course is actually examined by.
  const availableExaminationTypes = useMemo(() => {
    const available = new Set<ExaminationType>();

    Object.values(allCourses).forEach((course) =>
      getCourseExaminationTypes(course.Examination).forEach((type) =>
        available.add(type),
      ),
    );

    return EXAMINATION_TYPES.filter((type) => available.has(type));
  }, [allCourses]);

  const examinationOptions = useMemo(
    () => ({
      heading: translate("examinations"),
      icon: FileText,
      options: availableExaminationTypes.map((type) => {
        const Icon = EXAMINATION_ICONS[type];
        const label = translate(`_exam_type_${type}`);

        return {
          value: encodeOptionValue("examination", type),
          label,
          dropdownLabel: (
            <div className="flex items-center gap-2 truncate">
              <Icon className="h-4 w-4 opacity-70" />
              <span className="truncate">{label}</span>
            </div>
          ),
          searchKey: label,
        };
      }),
    }),
    [availableExaminationTypes, translate],
  );

  const groupedOptions = useMemo<MultiSelectGroup[]>(
    () =>
      [
        semesterOptions,
        blockOptions,
        periodOptions,
        levelOptions,
        masterOptions,
        mainFieldOptions,
        examinationOptions,
      ].map(withPolarity),
    [
      semesterOptions,
      blockOptions,
      periodOptions,
      masterOptions,
      levelOptions,
      mainFieldOptions,
      examinationOptions,
      withPolarity,
    ],
  );

  const selectedValues = useMemo(() => {
    const values: string[] = [];

    const push = (
      prefix: string,
      included: (string | number)[],
      excluded: (string | number)[],
    ) => {
      included.forEach((v) => values.push(encodeOptionValue(prefix, v)));
      excluded.forEach((v) =>
        values.push(encodeOptionValue(prefix, v, { negated: true })),
      );
    };

    push("semester", semesters, exSemesters);
    push("block", blocks, exBlocks);
    push("period", periods, exPeriods);
    push("master", masters, exMasters);
    push("level", levels, exLevels);
    push("mainField", mainFields, exMainFields);
    push("examination", examinationTypes, excludedExaminationTypes);

    if (search) {
      values.push(`search:${search}`);
    }

    return values;
  }, [
    masters,
    semesters,
    blocks,
    periods,
    levels,
    search,
    mainFields,
    examinationTypes,
    exMasters,
    exSemesters,
    exBlocks,
    exPeriods,
    exLevels,
    exMainFields,
    excludedExaminationTypes,
  ]);

  const handleValueChange = (newValues: string[]) => {
    /** Splits one dimension's values into its included and excluded halves. */
    const split = (prefix: string) => {
      const parsed = newValues
        .filter((v) => v.startsWith(`${prefix}:`))
        .map(parseOptionValue);

      return {
        included: parsed.filter((p) => !p.negated).map((p) => p.value),
        excluded: parsed.filter((p) => p.negated).map((p) => p.value),
      };
    };

    const semester = split("semester");
    selectSemesters(semester.included.map(Number));
    excludeSemesters(semester.excluded.map(Number));

    const block = split("block");
    selectBlocks(block.included.map(Number));
    excludeBlocks(block.excluded.map(Number));

    const period = split("period");
    selectPeriods(period.included.map(Number));
    excludePeriods(period.excluded.map(Number));

    const master = split("master");
    selectMasters(master.included);
    excludeMasters(master.excluded);

    const level = split("level");
    selectLevels(level.included);
    excludeLevels(level.excluded);

    const mainField = split("mainField");
    selectMainFields(mainField.included);
    excludeMainFields(mainField.excluded);

    const examination = split("examination");
    selectExaminationTypes(examination.included.filter(isExaminationType));
    excludeExaminationTypes(examination.excluded.filter(isExaminationType));

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
        backLabel={translate("_back")}
        placeholder={translate("filter_by_master_field_or_type")}
      />
    </div>
  );
};

export default UnifiedSearchFilter;
