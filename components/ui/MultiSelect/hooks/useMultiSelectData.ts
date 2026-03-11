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

  const filteredGroups = useMemo(() => {
    return (options as MultiSelectGroup[])
      .map((group) => ({
        ...group,
        options: group.options.filter((o) =>
          o.searchKey.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      }))
      .filter((group) => group.options.length > 0);
  }, [options, searchValue]);

  return { allOptionsFlat, exactMatch, hasMatchingOptions, filteredGroups };
};
