"use client";

import { useMultiSelectActions } from "./useMultiSelectActions";
import { useMultiSelectBadges } from "./useMultiSelectBadges";
import { useMultiSelectData } from "./useMultiSelectData";
import { useState, useEffect, useRef } from "react";
import { MultiSelectProps } from "..";

interface UseMultiSelectArgs {
  options: MultiSelectProps["options"];
  defaultValue?: MultiSelectProps["defaultValue"];
  onValueChange: MultiSelectProps["onValueChange"];
  onSearchChange?: MultiSelectProps["onSearchChange"];
  categoryLabels: MultiSelectProps["categoryLabels"];
}

export interface DrilldownState {
  heading: string;
  sectionKey?: string;
}

export const useMultiSelect = (args: UseMultiSelectArgs) => {
  const [selected, setSelected] = useState<string[]>(args.defaultValue || []);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeValue, setActiveValue] = useState("");
  // Where the dropdown currently is: a category, and optionally one of its
  // sections. Null is the top-level menu.
  const [drilldown, setDrilldown] = useState<DrilldownState | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(args.defaultValue || []);
  }, [args.defaultValue]);

  const { allOptionsFlat, exactMatch, hasMatchingOptions, filteredGroups } =
    useMultiSelectData({
      options: args.options,
      searchValue,
    });

  const consolidatedBadges = useMultiSelectBadges({
    selected,
    allOptionsFlat,
    categoryLabels: args.categoryLabels,
    searchValue,
  });

  const actions = useMultiSelectActions({
    selected,
    setSelected,
    searchValue,
    setSearchValue,
    setActiveValue,
    setIsPopoverOpen,
    allOptionsFlat,
    onValueChange: args.onValueChange,
    onSearchChange: args.onSearchChange,
    listRef,
    inputRef,
  });

  return {
    state: { selected, isPopoverOpen, searchValue, activeValue, drilldown },
    setters: {
      setSelected,
      setIsPopoverOpen,
      setSearchValue,
      setActiveValue,
      setDrilldown,
    },
    refs: { inputRef, listRef },
    data: {
      exactMatch,
      hasMatchingOptions,
      filteredGroups,
      consolidatedBadges,
    },
    actions,
  };
};
