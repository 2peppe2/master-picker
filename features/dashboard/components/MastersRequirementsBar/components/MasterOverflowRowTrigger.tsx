"use client";

import MasterOverflowRowContent from "./MasterOverflowRowContent";
import { useMasterAtom } from "@/features/catalog/hooks/useMasterAtom";
import { ProcessedMaster } from "../types";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";

interface MasterOverflowRowTriggerProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  master: ProcessedMaster;
  presentation: "sheet" | "tooltip";
}

const MasterOverflowRowTrigger = forwardRef<
  HTMLButtonElement,
  MasterOverflowRowTriggerProps
>(({ master, presentation, className, ...props }, ref) => {
  const masterMeta = useMasterAtom()[master.master];
  const progressPercentage = Math.round(
    Math.max(0, Math.min(100, master.progress)),
  );

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      data-master-overflow-row={master.master}
      className={cn(
        "group relative px-3 py-2.5 rounded-lg transition-all duration-200 flex flex-col gap-2 text-left",
        presentation === "sheet"
          ? "min-w-full cursor-pointer"
          : "min-w-[200px] cursor-default",
        masterMeta?.style,
        className,
      )}
    >
      <MasterOverflowRowContent
        iconName={masterMeta.icon}
        master={master}
        progressPercentage={progressPercentage}
      />
    </button>
  );
});

MasterOverflowRowTrigger.displayName = "MasterOverflowRowTrigger";

export default MasterOverflowRowTrigger;
