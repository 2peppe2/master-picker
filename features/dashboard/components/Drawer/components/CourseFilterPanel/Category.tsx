import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import type { ComponentType, FC } from "react";

interface CourseFilterCategoryProps {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  /** How many options behind this row are currently selected. */
  selectedCount: number;
  onSelect: () => void;
}

/** A row that drills one level deeper: a category, or one of its sections. */
export const CourseFilterCategory: FC<CourseFilterCategoryProps> = ({
  label,
  icon: Icon,
  selectedCount,
  onSelect,
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      "flex min-h-14 w-full items-center gap-3 rounded-lg px-2",
      "text-left text-sm transition-colors hover:bg-muted/70",
    )}
  >
    {Icon && <Icon className="size-4 shrink-0 opacity-70" />}
    <span className="min-w-0 flex-1 truncate">{label}</span>
    {selectedCount > 0 && (
      <span
        className={cn(
          "shrink-0 rounded-full bg-primary/15 px-2 py-0.5",
          "text-xs font-medium text-primary",
        )}
      >
        {selectedCount}
      </span>
    )}
    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
  </button>
);
