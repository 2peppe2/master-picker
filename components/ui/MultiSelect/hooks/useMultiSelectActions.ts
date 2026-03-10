"use client";

import { useCallback, RefObject } from "react";
import { MultiSelectOption } from "../types";

interface UseMultiSelectActionsArgs {
  selected: string[];
  setSelected: (val: string[]) => void;
  searchValue: string;
  setSearchValue: (val: string) => void;
  setActiveValue: (val: string) => void;
  setIsPopoverOpen: (val: boolean) => void;
  allOptionsFlat: MultiSelectOption[];
  onValueChange: (val: string[]) => void;
  onSearchChange?: (val: string) => void;
  listRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
}

export const useMultiSelectActions = ({
  selected,
  setSelected,
  searchValue,
  setSearchValue,
  setActiveValue,
  setIsPopoverOpen,
  allOptionsFlat,
  onValueChange,
  onSearchChange,
  listRef,
  inputRef,
}: UseMultiSelectActionsArgs) => {
  const toggleOption = useCallback(
    (value: string) => {
      const isSearching = searchValue.trim() !== "";
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];

      setSelected(next);
      onValueChange(next);

      if (isSearching) {
        // If converting a typed search into a tag, wipe the search and jump to top
        setSearchValue("");
        onSearchChange?.("");

        if (listRef.current) listRef.current.scrollTop = 0;

        const firstOption = allOptionsFlat[0];
        if (firstOption) {
          requestAnimationFrame(() => setActiveValue(firstOption.value));
        } else {
          setActiveValue("");
        }
      } else {
        // FIX: If just arrowing down, FORCE cmdk to keep focus on the item you just
        // pressed Enter on. This prevents the "jump" caused by the popover resizing!
        setActiveValue(value);
      }

      inputRef.current?.focus();
    },
    [
      selected,
      searchValue,
      onValueChange,
      onSearchChange,
      allOptionsFlat,
      listRef,
      inputRef,
      setActiveValue,
      setSearchValue,
      setSelected,
    ],
  );

  const removeGroup = useCallback(
    (prefix: string) => {
      const next = selected.filter((v) => !v.startsWith(`${prefix}:`));
      if (prefix === "search") {
        setSearchValue("");
        onSearchChange?.("");
      }
      setSelected(next);
      onValueChange(next);
    },
    [selected, onValueChange, onSearchChange, setSelected, setSearchValue],
  );

  const clearAll = useCallback(() => {
    setSearchValue("");
    onSearchChange?.("");
    onValueChange([]);
  }, [onSearchChange, onValueChange, setSearchValue]);

  const commitSearchTerm = useCallback(() => {
    // FIX: Just tell the popover to close. We DO NOT clear the search text here.
    // If we clear it now, the dropdown repopulates while closing, causing a visual glitch.
    setIsPopoverOpen(false);
  }, [setIsPopoverOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && searchValue === "" && selected.length > 0) {
        const lastValue = selected[selected.length - 1];
        if (lastValue.startsWith("search:")) {
          toggleOption(lastValue);
        } else if (lastValue.includes(":")) {
          const [prefix] = lastValue.split(":");
          removeGroup(prefix);
        } else {
          toggleOption(lastValue);
        }
      }
    },
    [searchValue, selected, toggleOption, removeGroup],
  );

  return {
    toggleOption,
    removeGroup,
    clearAll,
    commitSearchTerm,
    handleKeyDown,
  };
};
