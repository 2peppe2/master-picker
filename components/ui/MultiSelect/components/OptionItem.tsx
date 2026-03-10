"use client";

import { CommandItem } from "@/components/ui/command";
import { MultiSelectOption } from "../types";
import { CircleCheck } from "lucide-react";
import { FC } from "react";

interface OptionItemProps {
  option: MultiSelectOption;
  isSelected: boolean;
  onSelect: () => void;
}

const OptionItem: FC<OptionItemProps> = ({ option, isSelected, onSelect }) => (
  <CommandItem
    value={option.value}
    onSelect={onSelect}
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
    className="cursor-pointer group flex items-center py-2.5 px-3 w-full"
  >
    <div className="mr-3 flex h-4 w-4 items-center justify-center flex-shrink-0">
      {isSelected ? (
        <CircleCheck
          className="text-green-500 animate-in zoom-in-50"
          size={18}
        />
      ) : (
        <div className="h-4 w-4 rounded-full border-2 border-slate-300 opacity-40 group-hover:opacity-100 group-hover:border-primary transition-all" />
      )}
    </div>
    <div className="truncate flex items-center gap-2 flex-1 min-w-0 text-sm">
      {option.dropdownLabel || (
        <>
          {option.icon && <option.icon className="h-4 w-4 shrink-0" />}
          <span className="truncate">{option.label}</span>
        </>
      )}
    </div>
  </CommandItem>
);

export default OptionItem;
