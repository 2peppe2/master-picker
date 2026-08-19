"use client";

import {
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import Translate from "@/common/components/translate/Translate";
import { useSortedModules } from "../hooks/useSortedModules";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CategoryGroupProps } from "../types";
import ExamSelectItem from "../../ExamSelectItem";
import { FC, useState } from "react";
import { cn } from "@/lib/utils";

const CategoryGroup: FC<CategoryGroupProps> = ({
  code,
  modules,
  visibleCount,
  setVisibleCount,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sortedModules = useSortedModules(modules);

  return (
    <SelectGroup>
      <SelectLabel
        className={cn(
          "sticky top-[-5px] z-20 bg-popover text-primary",
          "font-bold mt-2 border-t pt-2 pb-1",
          "shadow-[0_1px_0_0_rgba(0,0,0,0.05)] flex",
          "items-center justify-between cursor-pointer",
          "hover:bg-muted/50 transition-colors",
        )}
        onPointerUp={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsCollapsed((prev) => !prev);
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <span>{code}</span>
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </SelectLabel>
      {!isCollapsed && (
        <>
          {sortedModules.slice(0, visibleCount).map((m) => (
            <ExamSelectItem key={`${m.moduleCode}-${m.date}`} moduleData={m} />
          ))}
          {visibleCount < sortedModules.length && (
            <SelectItem
              value={`show-more-${code}`}
              className={cn(
                "relative flex w-full cursor-pointer select-none",
                "items-center justify-center rounded-sm py-2 text-xs",
                "font-medium outline-none hover:bg-accent",
                "hover:text-accent-foreground text-muted-foreground",
                "transition-colors",
              )}
              onPointerUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setVisibleCount(visibleCount + 5);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  setVisibleCount(visibleCount + 5);
                }
              }}
            >
              <span className="w-full text-center">
                <Translate text="_show_more" /> (
                {sortedModules.length - visibleCount})
              </span>
            </SelectItem>
          )}
        </>
      )}
    </SelectGroup>
  );
};

export default CategoryGroup;
