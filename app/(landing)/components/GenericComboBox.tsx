"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import { FC, useRef, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

export interface ComboboxOption {
  label: string;
  value: string;
}

export interface ComboboxDisplay {
  placeholder: string;
  empty: string;
}

interface GenericComboboxProps {
  options: ComboboxOption[];
  value: ComboboxOption | null;
  onValueChange: (item: ComboboxOption | null) => void;
  displayStates: ComboboxDisplay;
}

const GenericCombobox: FC<GenericComboboxProps> = ({
  options,
  value,
  onValueChange,
  displayStates,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [matchIndex, setMatchIndex] = useState(0);

  const getMatches = () => {
    const term = inputRef.current?.value.toLowerCase().trim() || "";

    if (!term) {
      return [];
    }

    return options.filter((opt) => opt.label.toLowerCase().includes(term));
  };

  useHotkey(
    "Enter",
    (e) => {
      if (document.activeElement !== inputRef.current) return;

      const matches = getMatches();
      if (matches.length > 0) {
        e.preventDefault();
        onValueChange(matches[matchIndex % matches.length]);
        inputRef.current?.blur();
        setMatchIndex(0);
      }
    },
    { ignoreInputs: false },
  );

  return (
    <Combobox items={options} value={value} onValueChange={onValueChange}>
      <ComboboxInput
        ref={inputRef}
        placeholder={displayStates.placeholder}
        className="w-80 h-12 [&_[data-slot=input-group-control]]:text-base md:[&_[data-slot=input-group-control]]:text-lg [&_[data-slot=input-group-control]]:px-4"
      />
      <ComboboxContent>
        <ComboboxEmpty>{displayStates.empty}</ComboboxEmpty>
        <ComboboxList>
          {(item: ComboboxOption) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default GenericCombobox;
