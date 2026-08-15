"use client";

import { CommandItem } from "@/components/ui/command";
import { ChevronRight } from "lucide-react";
import { ComponentType, FC } from "react";

interface CategoryItemProps {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  /** How many options behind this row are currently selected. */
  selectedCount: number;
  value: string;
  onSelect: () => void;
}

/** A row that drills one level deeper: a category, or one of its sections. */
const CategoryItem: FC<CategoryItemProps> = ({
  label,
  icon: Icon,
  selectedCount,
  value,
  onSelect,
}) => (
  <CommandItem
    value={value}
    onSelect={onSelect}
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
    className="cursor-pointer group flex items-center gap-3 py-2.5 px-3 w-full"
  >
    {Icon && (
      <Icon className="h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100" />
    )}
    <span className="truncate text-sm flex-1 min-w-0">{label}</span>
    {selectedCount > 0 && (
      <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
        {selectedCount}
      </span>
    )}
    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
  </CommandItem>
);

export default CategoryItem;
