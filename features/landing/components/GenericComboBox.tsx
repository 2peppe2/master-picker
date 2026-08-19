"use client";

import { FC } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import ComboboxOptions from "./ComboboxOptions";
import { useComboboxKeyboardSelection } from "../hooks/useComboboxKeyboardSelection";
import type { ComboboxDisplay, ComboboxOption } from "./GenericComboBox.types";

export type { ComboboxDisplay, ComboboxOption } from "./GenericComboBox.types";

interface GenericComboboxProps {
  options: ComboboxOption[];
  value: ComboboxOption | null;
  onValueChange: (item: ComboboxOption | null) => void;
  disabled?: boolean;
  displayStates: ComboboxDisplay;
}

const GenericCombobox: FC<GenericComboboxProps> = ({
  options,
  value,
  onValueChange,
  displayStates,
  disabled = false,
}) => {
  const { inputRef, desktopAnchorRef, handleKeyDown } =
    useComboboxKeyboardSelection({ options, onValueChange });

  return (
    <div className="mx-auto w-full max-w-80">
      <div className="hidden pointer-coarse:block">
        <Combobox
          items={options}
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
        >
          <ComboboxTrigger
            className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-transparent px-4 text-left text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={displayStates.placeholder}
          >
            <span
              className={
                value ? "truncate text-foreground" : "truncate text-muted-foreground"
              }
            >
              {value?.label ?? displayStates.placeholder}
            </span>
          </ComboboxTrigger>
          <ComboboxOptions
            empty={displayStates.empty}
          />
        </Combobox>
      </div>

      <div ref={desktopAnchorRef} className="block pointer-coarse:hidden">
        <Combobox
          items={options}
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
        >
          <ComboboxInput
            ref={inputRef}
            placeholder={displayStates.placeholder}
            onKeyDown={handleKeyDown}
            className="h-12 w-full [&_[data-slot=input-group-control]]:px-4 [&_[data-slot=input-group-control]]:text-base md:[&_[data-slot=input-group-control]]:text-lg"
          />
          <ComboboxOptions
            empty={displayStates.empty}
            anchor={desktopAnchorRef}
          />
        </Combobox>
      </div>
    </div>
  );
};

export default GenericCombobox;
