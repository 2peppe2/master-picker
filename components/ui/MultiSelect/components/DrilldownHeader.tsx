"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { FC } from "react";

interface DrilldownHeaderProps {
  heading: string;
  /** Read by screen readers only -- the row shows the category name. */
  backLabel: string;
  onBack: () => void;
}

/**
 * Names the category the options below belong to, and leads back out of it.
 * Sized and spaced like the option rows it sits above, so the whole row is
 * the target and the heading lines up with the labels below it.
 */
const DrilldownHeader: FC<DrilldownHeaderProps> = ({
  heading,
  backLabel,
  onBack,
}) => (
  <div className="sticky top-0 z-10 bg-popover p-1">
    <button
      type="button"
      onClick={onBack}
      // Keeps the search input focused, the way the option rows do.
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      aria-label={`${backLabel}: ${heading}`}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5",
        "text-left hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring/50",
      )}
    >
      <ChevronLeft className="size-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">
        {heading}
      </span>
    </button>
  </div>
);

export default DrilldownHeader;
