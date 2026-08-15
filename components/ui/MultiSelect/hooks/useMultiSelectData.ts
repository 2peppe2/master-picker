"use client";

import { MultiSelectGroup, MultiSelectOption } from "../types";
import { useMemo } from "react";

interface MultiSelectDataArgs {
  options: MultiSelectOption[] | MultiSelectGroup[];
  searchValue: string;
}

export const useMultiSelectData = ({
  options,
  searchValue,
}: MultiSelectDataArgs) => {
  const allOptionsFlat = useMemo(() => {
    if (options.length === 0) return [];
    return "heading" in options[0]
      ? (options as MultiSelectGroup[]).flatMap((g) => g.options)
      : (options as MultiSelectOption[]);
  }, [options]);

  const exactMatch = useMemo(() => {
    const searchLower = searchValue.trim().toLowerCase();
    if (!searchLower) return false;
    return allOptionsFlat.some(
      (o) =>
        o.searchKey.toLowerCase() === searchLower ||
        o.label?.toString().toLowerCase() === searchLower ||
        o.value.toLowerCase() === searchLower,
    );
  }, [allOptionsFlat, searchValue]);

  const hasMatchingOptions = useMemo(() => {
    const hasMatches = allOptionsFlat.some((o) =>
      o.searchKey.toLowerCase().includes(searchValue.toLowerCase()),
    );
    const hasSearchFallback = searchValue.trim() && !exactMatch;
    return hasMatches || hasSearchFallback;
  }, [allOptionsFlat, searchValue, exactMatch]);

  const filteredGroups = useMemo<MultiSelectGroup[]>(() => {
    const matches = (option: MultiSelectOption) =>
      option.searchKey.toLowerCase().includes(searchValue.toLowerCase());

    return (options as MultiSelectGroup[])
      .flatMap<MultiSelectGroup>((group) =>
        // Search results are listed per section, so a hit always says whether
        // it is the "har" or the "utan" side of its category.
        group.sections
          ? group.sections.map((section) => ({
              heading: section.headerLabel,
              options: section.options.filter(matches),
            }))
          : [{ ...group, options: group.options.filter(matches) }],
      )
      .filter((group) => group.options.length > 0);
  }, [options, searchValue]);

  return { allOptionsFlat, exactMatch, hasMatchingOptions, filteredGroups };
};
