"use client";

import { cn } from "@/lib/utils";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import {
  DEFAULT_FILTER_STATE,
  filterStateAtom,
} from "@/features/dashboard/state/filter/atoms";
import { oppositeOptionValue } from "@/components/ui/MultiSelect/polarity";
import { useCourseFilterOptions } from "./useCourseFilterOptions";
import ActiveFilterChips from "./ActiveFilterChips";
import FilterPanelOverlay from "./FilterPanelOverlay";
import { parseFilters, serializeFilters } from "./filterStateUtils";
import MultiSelect from "@/components/ui/MultiSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { useIsCompact, useIsTablet } from "@/common/hooks/useResponsiveLayout";

const UnifiedSearchFilter = () => {
  const [filters, setFilters] = useAtom(filterStateAtom);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { categoryLabels, groupedOptions } = useCourseFilterOptions();
  const translate = useCommonTranslate();
  const isCompact = useIsCompact();
  const isTablet = useIsTablet();

  useEffect(() => {
    if (!isCompact) setFiltersOpen(false);
  }, [isCompact]);

  const selectedValues = useMemo(() => serializeFilters(filters), [filters]);
  const structuredValues = selectedValues.filter(
    (value) => !value.startsWith("search:"),
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

  const handleValuesChange = (values: string[]) => {
    setFilters((current) => parseFilters(values, current));
  };

  const toggleFilter = (value: string) => {
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
  };

  const clearFilters = () => {
    setFilters((current) => ({
      ...DEFAULT_FILTER_STATE,
      search: current.search,
      semesters: [],
    }));
  };

  return (
    <div data-slot="course-filter" className="w-full">
      <div className="hidden lg:block">
        <MultiSelect
          options={groupedOptions}
          value={selectedValues}
          onValueChange={handleValuesChange}
          categoryLabels={categoryLabels}
          backLabel={translate("_back")}
          placeholder={translate("filter_by_master_field_or_type")}
        />
      </div>

      <div className="space-y-2 lg:hidden">
        <div className="flex gap-2">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{translate("search")}</span>
            <Search
              className={cn(
                "pointer-events-none absolute left-3 top-1/2 size-4",
                "-translate-y-1/2 text-muted-foreground",
              )}
            />
            <Input
              value={filters.search}
              onChange={(event) =>
                setFilters({ ...filters, search: event.target.value })
              }
              placeholder={translate("search_for")}
              className="h-12 rounded-xl pl-9"
            />
          </label>
          <Button
            variant="outline"
            // The label is icon-only on phones, so it has to be named here.
            aria-label={translate("filters")}
            className="relative h-12 shrink-0 gap-2 rounded-xl px-3"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="size-4" />
            <span className="hidden sm:inline">{translate("filters")}</span>
            {structuredValues.length > 0 && (
              <Badge className="h-5 min-w-5 px-1.5">
                {structuredValues.length}
              </Badge>
            )}
          </Button>
        </div>

        <ActiveFilterChips
          ariaLabel={translate("active_filters")}
          optionMap={optionMap}
          values={structuredValues}
          onToggle={toggleFilter}
        />
      </div>

      <FilterPanelOverlay
        compact={isCompact}
        tablet={isTablet}
        open={filtersOpen}
        title={translate("filters")}
        description={translate("filter_by_master_field_or_type")}
        groups={groupedOptions}
        selectedValues={structuredValues}
        onToggle={toggleFilter}
        onClear={clearFilters}
        onOpenChange={setFiltersOpen}
      />
    </div>
  );
};

export default UnifiedSearchFilter;
