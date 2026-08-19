"use client";

import { cn } from "@/lib/utils";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { MultiSelectGroup } from "@/components/ui/MultiSelect/types";
import type { FC } from "react";
import CourseFilterPanel from "./CourseFilterPanel";

interface FilterPanelOverlayProps {
  /**
   * Short landscape phones get a side sheet because they have width to spare
   * but too little height for the category drill-down. Portrait phones and
   * tablets use a bottom sheet.
   */
  sideSheet: boolean;
  open: boolean;
  title: string;
  description: string;
  groups: MultiSelectGroup[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  onOpenChange: (open: boolean) => void;
}

const FilterPanelOverlay: FC<FilterPanelOverlayProps> = ({
  sideSheet,
  open,
  title,
  description,
  groups,
  selectedValues,
  onToggle,
  onClear,
  onOpenChange,
}) => {
  if (sideSheet) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className={cn(
            "w-[min(28rem,92vw)] gap-0 p-0 sm:max-w-none",
            "[&>button]:hidden",
            // Clears the notch, which sits on a side edge when rotated.
            "landscape-phone:pe-[env(safe-area-inset-right)]",
          )}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <CourseFilterPanel
            groups={groups}
            selectedValues={selectedValues}
            onToggle={onToggle}
            onClear={onClear}
            onClose={() => onOpenChange(false)}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    // Opens fully: the panel is a drill-down, so every category has to be
    // reachable without first dragging the sheet up.
    <BottomSheet open={open} onOpenChange={onOpenChange} initialSnapPoint={1}>
      <BottomSheetContent>
        <BottomSheetTitle className="sr-only">{title}</BottomSheetTitle>
        <BottomSheetDescription className="sr-only">
          {description}
        </BottomSheetDescription>
        <CourseFilterPanel
          groups={groups}
          selectedValues={selectedValues}
          onToggle={onToggle}
          onClear={onClear}
          onClose={() => onOpenChange(false)}
        />
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default FilterPanelOverlay;
