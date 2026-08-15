"use client";

import { CommandItem } from "@/components/ui/command";
import { ChevronLeft } from "lucide-react";
import { FC } from "react";

interface DrilldownHeaderProps {
  heading: string;
  /** Read by screen readers only -- the row shows the category name. */
  backLabel: string;
  onBack: () => void;
}

/** Names the category the options below belong to, and leads back out of it. */
const DrilldownHeader: FC<DrilldownHeaderProps> = ({
  heading,
  backLabel,
  onBack,
}) => (
  <div className="sticky top-0 z-10 bg-popover">
    <CommandItem
      value="__back"
      onSelect={onBack}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      aria-label={`${backLabel}: ${heading}`}
      className="cursor-pointer flex items-center gap-2 py-2 px-3"
    >
      <ChevronLeft className="h-4 w-4 shrink-0" />
      <span className="truncate text-sm font-semibold">{heading}</span>
    </CommandItem>
  </div>
);

export default DrilldownHeader;
