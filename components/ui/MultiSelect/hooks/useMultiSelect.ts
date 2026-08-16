"use client";

import { useMultiSelectActions } from "./useMultiSelectActions";
import { useMultiSelectBadges } from "./useMultiSelectBadges";
import { useMultiSelectData } from "./useMultiSelectData";
import { useState, useRef } from "react";
import { MultiSelectProps } from "..";

interface UseMultiSelectArgs {
  options: MultiSelectProps["options"];
  value: MultiSelectProps["value"];
  onValueChange: MultiSelectProps["onValueChange"];
  onSearchChange?: MultiSelectProps["onSearchChange"];
  categoryLabels: MultiSelectProps["categoryLabels"];
}

export interface DrilldownState {
  heading: string;
  sectionKey?: string;
}

export const useMultiSelect = (args: UseMultiSelectArgs) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeValue, setActiveValue] = useState("");
  // Where the dropdown currently is: a category, and optionally one of its
  // sections. Null is the top-level menu.
  const [drilldown, setDrilldown] = useState<DrilldownState | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { allOptionsFlat, exactMatch, hasMatchingOptions, filteredGroups } =
    useMultiSelectData({
      options: args.options,
      searchValue,
    });

  const consolidatedBadges = useMultiSelectBadges({
    selected: args.value,
    allOptionsFlat,
    categoryLabels: args.categoryLabels,
    searchValue,
  });

  const actions = useMultiSelectActions({
    selected: args.value,
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
    state: {
      selected: args.value,
      isPopoverOpen,
      searchValue,
      activeValue,
      drilldown,
    },
    setters: {
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
