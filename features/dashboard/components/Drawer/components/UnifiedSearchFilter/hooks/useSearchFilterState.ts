"use client";

import {
  DEFAULT_FILTER_STATE,
  filterStateAtom,
} from "@/features/dashboard/state/filter/atoms";
import { oppositeOptionValue } from "@/components/ui/MultiSelect/polarity";
import { parseFilters, serializeFilters } from "../../filterStateUtils";
import { useCourseFilterOptions } from "../../useCourseFilterOptions";
import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";

/**
 * The filter state both presentations share: the serialized values, the
 * option lookup, and the mutations. Kept out of the views so neither has to
 * know how a filter is encoded.
 */
export const useSearchFilterState = () => {
  const [filters, setFilters] = useAtom(filterStateAtom);
  const { categoryLabels, groupedOptions } = useCourseFilterOptions();

  const selectedValues = useMemo(() => serializeFilters(filters), [filters]);

  const structuredValues = useMemo(
    () => selectedValues.filter((value) => !value.startsWith("search:")),
    [selectedValues],
  );

  const optionMap = useMemo(
    () =>
      new Map(
        groupedOptions.flatMap((group) =>
          group.options.map((option) => [option.value, option]),
        ),
      ),
    [groupedOptions],
  );

  const handleValuesChange = useCallback(
    (values: string[]) => setFilters((current) => parseFilters(values, current)),
    [setFilters],
  );

  const toggleFilter = useCallback(
    (value: string) => {
      if (structuredValues.includes(value)) {
        handleValuesChange(selectedValues.filter((item) => item !== value));
        return;
      }

      // The two polarities of one option are mutually exclusive: including
      // something that is currently excluded drops the exclusion, and back.
      const opposite = oppositeOptionValue(value);
      handleValuesChange([
        ...selectedValues.filter((item) => item !== opposite),
        value,
      ]);
    },
    [handleValuesChange, selectedValues, structuredValues],
  );

  const clearFilters = useCallback(
    () =>
      setFilters((current) => ({
        ...DEFAULT_FILTER_STATE,
        search: current.search,
        semesters: [],
      })),
    [setFilters],
  );

  const setSearch = useCallback(
    (search: string) => setFilters((current) => ({ ...current, search })),
    [setFilters],
  );

  return {
    filters,
    setSearch,
    categoryLabels,
    groupedOptions,
    selectedValues,
    structuredValues,
    optionMap,
    handleValuesChange,
    toggleFilter,
    clearFilters,
  };
};
