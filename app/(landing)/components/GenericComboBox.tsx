"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { FC } from "react";

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
}) => (
  <Combobox items={options} value={value} onValueChange={onValueChange}>
    <ComboboxInput
      placeholder={displayStates.placeholder}
      className={`w-80 h-12 [&_[data-slot=input-group-control]]:text-base md:[&_[data-slot=input-group-control]]:text-lg [&_[data-slot=input-group-control]]:px-4`}
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

export default GenericCombobox;
