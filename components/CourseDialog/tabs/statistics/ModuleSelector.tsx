"use client";

import Translate from "@/common/components/translate/Translate";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FC, useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import ExamSelectItem from "./ExamSelectItem";
import { ProcessedModule } from "./types";
import ExamBadge from "./ExamBadge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";

interface ModuleSelectorProps {
  selectedModule: string;
  setSelectedModule: (mod: string) => void;
  categorizedModules: (readonly [string, ProcessedModule[]])[];
  selectedItem?: ProcessedModule;
}

const ModuleSelector: FC<ModuleSelectorProps> = ({
  selectedModule,
  setSelectedModule,
  categorizedModules,
  selectedItem,
}) => {
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(
    {},
  );

  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
        <Translate text="examination_history" />
      </Label>
      <Select
        value={selectedModule}
        onValueChange={(val) => {
          if (!val.startsWith("show-more-")) {
            setSelectedModule(val);
          }
        }}
      >
        <SelectTrigger className="w-full overflow-hidden cursor-pointer">
          <div className="flex items-center justify-between w-full pr-4">
            <span className="truncate">
              {selectedModule === "all" ? (
                <Translate text="all_examinations" />
              ) : (
                `${selectedItem?.moduleCode}: ${selectedItem?.displayDate}`
              )}
            </span>
            {selectedItem && (
              <ExamBadge
                moduleCode={selectedItem.moduleCode}
                isOriginal={selectedItem.isOriginal}
              />
            )}
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[350px]" data-no-drag="true">
          <SelectItem value="all" className="font-bold cursor-pointer">
            <Translate text="all_examinations" />
          </SelectItem>
          {categorizedModules.map(([code, modules]) => (
            <CategoryGroup
              key={code}
              code={code}
              modules={modules}
              visibleCount={visibleCounts[code] || 5}
              setVisibleCount={(count) =>
                setVisibleCounts((prev) => ({ ...prev, [code]: count }))
              }
            />
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModuleSelector;

interface CategoryGroupProps {
  code: string;
  modules: ProcessedModule[];
  visibleCount: number;
  setVisibleCount: (count: number) => void;
}

const CategoryGroup: FC<CategoryGroupProps> = ({
  code,
  modules,
  visibleCount,
  setVisibleCount,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sortedModules = useMemo(
    () =>
      [...modules].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [modules],
  );

  return (
    <SelectGroup>
      <SelectLabel
        className="sticky top-[-5px] z-20 bg-popover text-primary font-bold mt-2 border-t pt-2 pb-1 shadow-[0_1px_0_0_rgba(0,0,0,0.05)] flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
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
              className="relative flex w-full cursor-pointer select-none items-center justify-center rounded-sm py-2 text-xs font-medium outline-none hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors"
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
                <Translate text="show_more" /> (
                {sortedModules.length - visibleCount})
              </span>
            </SelectItem>
          )}
        </>
      )}
    </SelectGroup>
  );
};
