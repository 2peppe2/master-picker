"use client";

import MobileCategoryGroup from "./components/MobileCategoryGroup";
import Translate from "@/common/components/translate/Translate";
import SelectedModule from "./components/SelectedModule";
import { ModuleSelectorViewProps } from "./types";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { FC, useState } from "react";
import { cn } from "@/lib/utils";

const ModuleSelectorSmall: FC<ModuleSelectorViewProps> = ({
  selectedModule,
  setSelectedModule,
  categorizedModules,
  selectedItem,
  visibleCounts,
  setVisibleCount,
}) => {
  const [open, setOpen] = useState(false);

  return (
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
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </Button>

      {open && (
        <div
          data-no-drag="true"
          className={cn(
            "mt-1 max-h-[max(11rem,50dvh)] overflow-y-auto",
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
            <Translate text="_all_examinations" />
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
                setVisibleCount={(count) => setVisibleCount(code, count)}
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
  );
};

export default ModuleSelectorSmall;
