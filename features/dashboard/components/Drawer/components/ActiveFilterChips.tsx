"use client";

import { cn } from "@/lib/utils";

import type { MultiSelectOption } from "@/components/ui/MultiSelect/types";
import { X } from "lucide-react";
import type { FC } from "react";

interface ActiveFilterChipsProps {
  ariaLabel: string;
  optionMap: Map<string, MultiSelectOption>;
  values: string[];
  onToggle: (value: string) => void;
}

const ActiveFilterChips: FC<ActiveFilterChipsProps> = ({
  ariaLabel,
  optionMap,
  values,
  onToggle,
}) => {
  if (values.length === 0) return null;

  return (
    <div
      aria-label={ariaLabel}
      data-no-swipe="true"
      className={cn(
        "-mx-1 flex touch-pan-x gap-1.5 overflow-x-auto",
        "overscroll-x-contain px-1 pb-1",
        "[scrollbar-width:none]",
        "[-webkit-overflow-scrolling:touch]",
        "[&::-webkit-scrollbar]:hidden",
      )}
    >
      {values.map((value) => {
        const option = optionMap.get(value);
        if (!option) return null;

        return (
          <button
            type="button"
            key={value}
            onClick={() => onToggle(value)}
            className={cn(
              "flex h-8 shrink-0 touch-manipulation items-center",
              "gap-1.5 whitespace-nowrap rounded-full border",
              "bg-background px-3 text-xs font-medium",
            )}
          >
            {option.badgeLabel ?? option.label}
            <X className="size-3 text-muted-foreground" />
          </button>
        );
      })}
    </div>
  );
};

export default ActiveFilterChips;
