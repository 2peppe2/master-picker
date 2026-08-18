"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface LandscapeSideSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Rendered as the sheet's trigger, so it keeps its own button styling. */
  trigger: ReactNode;
  title: ReactNode;
  /** Shown under the title; falls back to a screen-reader-only copy of it. */
  description?: ReactNode;
  children: ReactNode;
}

/**
 * The menu shell for landscape phones.
 *
 * A bottom sheet needs height it does not have here -- half a rotated phone is
 * barely 200px -- so these menus come in from the side instead, matching the
 * filter panel and the master profiles overflow.
 */
const LandscapeSideSheet: FC<LandscapeSideSheetProps> = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
}) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetTrigger asChild>{trigger}</SheetTrigger>

    {/*
     * Padding on the content rather than a header row, and the kit's own close
     * button rather than a custom one: that is what puts the title on the same
     * line as the close, the way the master profiles sheet does it.
     */}
    <SheetContent
      side="right"
      className={cn(
        // Shrink-wraps its content instead of taking a fixed slice of the
        // screen: these menus are a couple of rows each, and a fixed panel
        // covered most of the schedule for no reason. The sm: cap has to be
        // restated -- the kit's sm:max-w-sm would otherwise win at every
        // landscape width.
        "w-auto min-w-60 max-w-[min(24rem,85vw)]",
        "sm:max-w-[min(24rem,85vw)]",
        "gap-0 overflow-y-auto p-4",
        "pe-[calc(1rem+env(safe-area-inset-right))]",
      )}
    >
      {/* Clears the close button, which is absolutely positioned. */}
      <SheetHeader className="p-0 pb-3 pe-8">
        <SheetTitle className="text-base">{title}</SheetTitle>
        <SheetDescription className={description ? "text-xs" : "sr-only"}>
          {description ?? title}
        </SheetDescription>
      </SheetHeader>

      {children}
    </SheetContent>
  </Sheet>
);

export default LandscapeSideSheet;
