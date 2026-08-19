"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import ExcludedFilterLabel from "../ExcludedFilterLabel";
import { useCourseTranslate } from "@/common/components/translate/hooks/useCourseTranslate";
import { showBachelorYearsAtom } from "@/features/dashboard/state/preferences/atoms";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { MultiSelectGroup } from "@/components/ui/MultiSelect/types";
import { useMasterAtom } from "@/common/state/catalog";
import Translate from "@/common/components/translate/Translate";
import { coursesAtom } from "@/features/dashboard/state/catalog-data/atoms";
import MasterBadge from "@/common/components/MasterBadge";
import {
  encodeOptionValue,
  parseOptionValue,
} from "@/components/ui/MultiSelect/polarity";
import {
  EXAMINATION_LABEL_KEYS,
  EXAMINATION_TYPES,
  ExaminationType,
  getCourseExaminationTypes,
} from "@/lib/examinationTypes";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { range, uniq } from "lodash";
import {
  Ban,
  Calendar,
  Check,
  CircleStar,
  ClipboardList,
  FileText,
  FlaskConical,
  FolderKanban,
  GraduationCap,
  Laptop,
  LayoutGrid,
  Layers,
  ListChecks,
  Mic,
  Shapes,
  Users,
} from "lucide-react";
import FilterOption from "../FilterOption";

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

export const useCourseFilterOptions = () => {
  const showBachelorYears = useAtomValue(showBachelorYearsAtom);
  const allCourses = useAtomValue(coursesAtom);
  const allMasters = useMasterAtom();
  const coursesTranslate = useCourseTranslate();
  const translate = useCommonTranslate();

  const categoryLabels = useMemo<Record<string, string>>(
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

  const levelLabels = useMemo<Record<string, string>>(
    () => ({
      G: translate("basic"),
      A: translate("advanced"),
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
              <ExcludedFilterLabel>
                {option.badgeLabel ?? option.label}
              </ExcludedFilterLabel>
            ),
            badgeLabel: (
              <ExcludedFilterLabel>
                {option.badgeLabel ?? option.label}
              </ExcludedFilterLabel>
            ),
            // The mobile panel lists both polarities together, so the row has
            // to carry the exclusion styling as well.
            dropdownLabel: (
              <ExcludedFilterLabel>
                {option.dropdownLabel ?? option.label}
              </ExcludedFilterLabel>
            ),
            searchKey: `${translate("exclude")} ${option.searchKey}`,
          };
        });

        const noun = group.heading.toLowerCase();

        return {
          ...group,
          options: [...group.options, ...excludedOptions],
          sections: [
            {
              key: "include",
              label: translate("include"),
              headerLabel: translate("_include_x", { x: noun }),
              icon: Check,
              options: group.options,
            },
            {
              key: "exclude",
              label: translate("exclude"),
              headerLabel: translate("_exclude_x", { x: noun }),
              icon: Ban,
              options: excludedOptions,
            },
          ],
        };
      },
    [translate],
  );

  const availableExaminationTypes = useMemo(() => {
    const available = new Set<ExaminationType>();

    Object.values(allCourses).forEach((course) =>
      getCourseExaminationTypes(course.Examination).forEach((type) =>
        available.add(type),
      ),
    );

    return EXAMINATION_TYPES.filter((type) => available.has(type));
  }, [allCourses]);

  const groupedOptions = useMemo<MultiSelectGroup[]>(() => {
    const mainFields = uniq(
      Object.values(allCourses).flatMap((course) => course.mainField || []),
    ).sort();

    const groups: MultiSelectGroup[] = [
      {
        heading: translate("semesters"),
        icon: GraduationCap,
        options: range(showBachelorYears ? 1 : 7, 11).map((semester) => ({
          label: String(semester),
          badgeLabel: translate("_semester_label", { s: semester }),
          dropdownLabel: (
            <FilterOption icon={GraduationCap}>
              <Translate text="_semester_label" args={{ s: semester }} />
            </FilterOption>
          ),
          searchKey: translate("_semester_label", { s: semester }),
          value: `semester:${semester}`,
        })),
      },
      {
        heading: translate("blocks"),
        icon: LayoutGrid,
        options: range(1, 5).map((block) => ({
          label: String(block),
          badgeLabel: translate("_block_label", { b: block }),
          dropdownLabel: (
            <FilterOption icon={LayoutGrid}>
              <Translate text="_block_label" args={{ b: block }} />
            </FilterOption>
          ),
          searchKey: translate("_block_label", { b: block }),
          value: `block:${block}`,
        })),
      },
      {
        heading: translate("periods"),
        icon: Calendar,
        options: range(1, 3).map((period) => ({
          label: String(period),
          badgeLabel: translate("_period_label", { p: period }),
          dropdownLabel: (
            <FilterOption icon={Calendar}>
              <Translate text="_period_label" args={{ p: period }} />
            </FilterOption>
          ),
          searchKey: translate("_period_label", { p: period }),
          value: `period:${period}`,
        })),
      },
      {
        heading: translate("levels"),
        icon: CircleStar,
        options: Object.keys(levelLabels).map((level) => ({
          value: `level:${level}`,
          label: levelLabels[level],
          dropdownLabel: (
            <FilterOption icon={CircleStar}>{levelLabels[level]}</FilterOption>
          ),
          searchKey: levelLabels[level],
        })),
      },
      {
        heading: translate("_master_profiles"),
        icon: Layers,
        options: Object.values(allMasters).map((master) => ({
          value: `master:${master.master}`,
          label: <MasterBadge name={master.master} />,
          dropdownLabel: (
            <div className="flex min-w-0 items-center gap-2">
              <MasterBadge name={master.master} />
              <span className="truncate font-medium">
                <CourseTranslate text={master.name ?? master.master} />
              </span>
            </div>
          ),
          searchKey: master.name ?? master.master,
        })),
      },
      {
        heading: translate("_main_fields"),
        icon: Shapes,
        options: mainFields.map((field) => ({
          label: coursesTranslate(field),
          dropdownLabel: (
            <FilterOption icon={Shapes}>
              <CourseTranslate text={field} />
            </FilterOption>
          ),
          searchKey: field,
          value: `mainField:${field}`,
        })),
      },
      {
        heading: translate("examinations"),
        icon: FileText,
        options: availableExaminationTypes.map((type) => {
          const label = translate(EXAMINATION_LABEL_KEYS[type]);

          return {
            value: encodeOptionValue("examination", type),
            label,
            badgeLabel: label,
            dropdownLabel: (
              <FilterOption icon={EXAMINATION_ICONS[type]}>
                {label}
              </FilterOption>
            ),
            searchKey: label,
          };
        }),
      },
    ];

    return groups.map(withPolarity);
  }, [
    allCourses,
    allMasters,
    availableExaminationTypes,
    coursesTranslate,
    levelLabels,
    showBachelorYears,
    translate,
    withPolarity,
  ]);

  return { categoryLabels, groupedOptions };
};
