"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { useSearchFilterState } from "./hooks/useSearchFilterState";
import { Search, SlidersHorizontal } from "lucide-react";
import ActiveFilterChips from "../ActiveFilterChips";
import FilterPanelOverlay from "../FilterPanelOverlay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Phone and tablet presentation: a search field beside a filter button that
 * opens the full filter set in an overlay.
 */
interface SearchFilterSmallProps {
  sideSheet: boolean;
}

const SearchFilterSmall: FC<SearchFilterSmallProps> = ({ sideSheet }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const translate = useCommonTranslate();
  const {
    filters,
    setSearch,
    groupedOptions,
    structuredValues,
    optionMap,
    toggleFilter,
    clearFilters,
  } = useSearchFilterState();

  return (
    <>
      <div className="space-y-2">
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
              onChange={(event) => setSearch(event.target.value)}
              placeholder={translate("_search_for")}
              // The two primary targets in the panel keep the full --touch
              // height in landscape rather than dropping to --touch-sm.
              className="h-12 rounded-xl pl-9 landscape-phone:h-(--touch)"
            />
          </label>

          <Button
            variant="outline"
            // The label is icon-only on phones, so it has to be named here.
            aria-label={translate("filters")}
            className="relative h-12 shrink-0 gap-2 rounded-xl px-3 landscape-phone:h-(--touch)"
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
          ariaLabel={translate("_active_filters")}
          optionMap={optionMap}
          values={structuredValues}
          onToggle={toggleFilter}
        />
      </div>

      <FilterPanelOverlay
        sideSheet={sideSheet}
        open={filtersOpen}
        title={translate("filters")}
        description={translate("_filter_by_master_field_or_type")}
        groups={groupedOptions}
        selectedValues={structuredValues}
        onToggle={toggleFilter}
        onClear={clearFilters}
        onOpenChange={setFiltersOpen}
      />
    </>
  );
};

export default SearchFilterSmall;
