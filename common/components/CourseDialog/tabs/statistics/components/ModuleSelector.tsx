"use client";

import { cn } from "@/lib/utils";

import Translate from "@/common/components/translate/Translate";
import { useIsPhone } from "@/common/hooks/useResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { FC, useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import ExamSelectItem from "./ExamSelectItem";
import { ProcessedModule } from "../types";
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
  const isPhone = useIsPhone();
  const [open, setOpen] = useState(false);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(
    {},
  );

  return (
    <div className="space-y-2" data-no-swipe="true">
      <Label className="text-sm font-medium text-foreground">
        <Translate text="examination_history" />
      </Label>
      {isPhone ? (
        <div>
          <Button
            type="button"
            variant="outline"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className={cn(
              "h-11 w-full justify-between overflow-hidden",
              "rounded-xl px-3 font-normal",
            )}
          >
            <SelectedModule
              selectedModule={selectedModule}
              selectedItem={selectedItem}
            />
            <ChevronDown
              className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </Button>
          {open && (
            <div
              data-no-drag="true"
              className={cn(
                "mt-1 max-h-[50dvh] overflow-y-auto",
                "overscroll-contain rounded-xl bg-muted/30 p-1",
                "[touch-action:pan-y]",
              )}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedModule("all");
                  setOpen(false);
                }}
                className={cn(
                  "flex min-h-11 w-full items-center justify-between",
                  "rounded-lg px-3 text-left text-sm font-semibold",
                  "transition-colors hover:bg-accent",
                )}
              >
                <Translate text="all_examinations" />
                {selectedModule === "all" && (
                  <Check className="size-4 text-primary" />
                )}
              </button>
              <div className="mt-0.5 space-y-0.5">
                {categorizedModules.map(([code, modules]) => (
                  <MobileCategoryGroup
                    key={code}
                    code={code}
                    modules={modules}
                    selectedModule={selectedModule}
                    visibleCount={visibleCounts[code] || 5}
                    setVisibleCount={(count) =>
                      setVisibleCounts((prev) => ({
                        ...prev,
                        [code]: count,
                      }))
                    }
                    onSelect={(value) => {
                      setSelectedModule(value);
                      setOpen(false);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Select
          value={selectedModule}
          onValueChange={(val) => {
            if (!val.startsWith("show-more-")) {
              setSelectedModule(val);
            }
          }}
        >
          <SelectTrigger className="w-full cursor-pointer overflow-hidden">
            <div className="flex w-full items-center justify-between pr-4">
              <SelectedModule
                selectedModule={selectedModule}
                selectedItem={selectedItem}
              />
            </div>
          </SelectTrigger>
          <SelectContent className="max-h-[350px]" data-no-drag="true">
            <SelectItem value="all" className="cursor-pointer font-bold">
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
      )}
    </div>
  );
};

export default ModuleSelector;

interface SelectedModuleProps {
  selectedModule: string;
  selectedItem?: ProcessedModule;
}

const SelectedModule: FC<SelectedModuleProps> = ({
  selectedModule,
  selectedItem,
}) => (
  <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
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
);

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
  const sortedModules = useMemo(
    () =>
      [...modules].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [modules],
  );

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
              <Translate text="show_more" /> (
              {sortedModules.length - visibleCount})
            </button>
          )}
        </div>
      )}
    </div>
  );
};
