"use client";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { ComboboxItemType } from "./types";
import { FC } from "react";

interface ComboboxProps {
  items: ComboboxItemType[];
  value: ComboboxItemType | null;
  onValueChange: (item: ComboboxItemType | null) => void;
  placeholder: string;
  noResultsText: string;
  className?: string;
}

const GenericCombobox: FC<ComboboxProps> = ({
  items,
  value,
  onValueChange,
  placeholder,
  noResultsText,
  className,
}) => {
  return (
    <Combobox items={items} value={value} onValueChange={onValueChange}>
      <ComboboxInput
        placeholder={placeholder}
        className={`w-80 h-12 [&_[data-slot=input-group-control]]:text-base md:[&_[data-slot=input-group-control]]:text-lg [&_[data-slot=input-group-control]]:px-4 ${className}`}
      />
      <ComboboxContent>
        <ComboboxEmpty>{noResultsText}</ComboboxEmpty>
        <ComboboxList>
          {(item: ComboboxItemType) => (
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