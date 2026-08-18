"use client";

import { TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, ClipboardList, LayoutGrid, Star, type LucideIcon } from "lucide-react";
import { DialogChrome, DialogTab } from "../types";
import { createElement, FC } from "react";
import { cn } from "@/lib/utils";

const TAB_ICONS: Record<string, LucideIcon> = {
  overview: LayoutGrid,
  examination: ClipboardList,
  statistics: BarChart3,
  "evaliuate-score": Star,
};

interface DialogTabTriggerProps {
  tab: DialogTab;
  chrome: DialogChrome;
}

const DialogTabTrigger: FC<DialogTabTriggerProps> = ({ tab, chrome }) => {
  const showIcon = chrome !== "top";

  return (
    <TabsTrigger
      value={tab.value}
      title={chrome === "rail" ? tab.name : undefined}
      data-density-exempt={chrome === "rail" ? "" : undefined}
      className={cn(
        cn("cursor-pointer bg-background text-muted-foreground", "transition-colors hover:text-foreground", "data-[state=active]:text-foreground", "data-[state=active]:shadow-none"),
        chrome === "bottom" && cn("group min-h-(--touch) min-w-0 flex-1 flex-col gap-0", "landscape-phone:flex-row landscape-phone:gap-1.5", "rounded-xl border-0 bg-transparent px-1 py-0.5", "text-2xs font-medium", "data-[state=active]:bg-transparent", "data-[state=active]:text-primary", "dark:data-[state=active]:border-transparent", "dark:data-[state=active]:bg-transparent"),
        chrome === "rail" && cn("group h-auto min-h-0 w-full flex-none justify-start gap-1.5", "rounded-lg border-0 px-2 py-1.5 text-2xs font-medium", "data-[state=active]:bg-primary/12", "data-[state=active]:font-semibold", "data-[state=active]:text-primary", "dark:data-[state=active]:border-transparent"),
        chrome === "top" && cn("h-10 min-w-0 rounded-none border-0 border-b-2", "border-transparent px-2 text-xs", "hover:border-muted-foreground/30", "data-[state=active]:border-primary sm:text-sm"),
      )}
    >
      {showIcon && (
        <span className={cn("flex shrink-0 items-center justify-center", "rounded-full transition-colors", chrome === "bottom" && cn("h-6 w-10", "landscape-phone:h-auto landscape-phone:w-auto", "group-data-[state=active]:bg-primary/12", "landscape-phone:group-data-[state=active]:bg-transparent"))}>
          {createElement(TAB_ICONS[tab.value] ?? LayoutGrid, {
            "aria-hidden": true,
            className: "size-4",
          })}
        </span>
      )}
      <span className="max-w-full truncate">{tab.name}</span>
    </TabsTrigger>
  );
};

export default DialogTabTrigger;
