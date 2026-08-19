"use client";

import type { ComboboxOption } from "../components/GenericComboBox.types";
import { type KeyboardEvent, useRef, useState } from "react";

interface UseComboboxKeyboardSelectionArgs {
  options: ComboboxOption[];
  onValueChange: (item: ComboboxOption | null) => void;
}

export const useComboboxKeyboardSelection = ({
  options,
  onValueChange,
}: UseComboboxKeyboardSelectionArgs) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const desktopAnchorRef = useRef<HTMLDivElement>(null);
  const [matchIndex, setMatchIndex] = useState(0);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    const term = inputRef.current?.value.toLowerCase().trim() ?? "";
    if (!term) return;

    const matches = options.filter((option) =>
      option.label.toLowerCase().includes(term),
    );
    if (matches.length === 0) return;

    event.preventDefault();
    onValueChange(matches[matchIndex % matches.length]);
    inputRef.current?.blur();
    setMatchIndex(0);
  };

  return { inputRef, desktopAnchorRef, handleKeyDown };
};
