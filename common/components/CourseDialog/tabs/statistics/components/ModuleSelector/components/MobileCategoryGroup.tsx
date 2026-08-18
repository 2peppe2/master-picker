"use client";

import Translate from "@/common/components/translate/Translate";
import { useSortedModules } from "../hooks/useSortedModules";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { CategoryGroupProps } from "../types";
import ExamBadge from "../../ExamBadge";
import { FC, useState } from "react";
import { cn } from "@/lib/utils";

interface MobileCategoryGroupProps extends CategoryGroupProps {
  selectedModule: string;
  onSelect: (value: string) => void;
}

const MobileCategoryGroup: FC<MobileCategoryGroupProps> = ({
  code,
  modules,
  selectedModule,
  visibleCount,
  setVisibleCount,
  onSelect,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sortedModules = useSortedModules(modules);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsCollapsed((current) => !current)}
        className={cn(
          "flex min-h-10 w-full items-center justify-between",
          "rounded-lg px-3 text-left text-sm font-semibold",
          "text-primary transition-colors hover:bg-accent",
        )}
      >
        <span>{code}</span>
        {isCollapsed ? (
          <ChevronRight className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </button>
      {!isCollapsed && (
        <div className="space-y-0.5 pb-0.5">
          {sortedModules.slice(0, visibleCount).map((moduleData) => {
            const value = `${moduleData.moduleCode}-${moduleData.date}`;

            return (
              <button
                key={value}
                type="button"
                onClick={() => onSelect(value)}
                className={cn(
                  "flex min-h-11 w-full items-center gap-3 rounded-lg",
                  "px-3 text-left text-sm transition-colors",
                  "hover:bg-accent",
                )}
              >
                <span className="min-w-0 flex-1 truncate">
                  {moduleData.displayDate}
                </span>
                <ExamBadge
                  moduleCode={moduleData.moduleCode}
                  isOriginal={moduleData.isOriginal}
                />
                {selectedModule === value && (
                  <Check className="size-4 shrink-0 text-primary" />
                )}
              </button>
            );
          })}
          {visibleCount < sortedModules.length && (
            <button
              type="button"
              onClick={() => setVisibleCount(visibleCount + 5)}
              className={cn(
                "min-h-10 w-full rounded-lg px-3 text-center text-xs",
                "font-medium text-muted-foreground transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Translate text="_show_more" /> (
              {sortedModules.length - visibleCount})
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileCategoryGroup;
