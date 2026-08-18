"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  ClipboardList,
  LayoutGrid,
  Star,
  type LucideIcon,
} from "lucide-react";
import { DialogChrome, DialogTab } from "../types";
import { FC } from "react";
import { cn } from "@/lib/utils";

/** Used by both touch chromes; the desktop row is text-only. */
const TAB_ICONS: Record<string, LucideIcon> = {
  overview: LayoutGrid,
  examination: ClipboardList,
  statistics: BarChart3,
  "evaliuate-score": Star,
};

interface DialogTabListProps {
  tabs: DialogTab[];
  chrome: DialogChrome;
}

const DialogTabList: FC<DialogTabListProps> = ({ tabs, chrome }) => (
  <TabsList
    className={cn(
      "shrink-0 rounded-none bg-background p-0",
      chrome === "top" && "grid w-full",
      chrome === "bottom" &&
        cn(
          "relative z-50 flex h-auto w-full items-center gap-0",
          "overflow-hidden rounded-t-2xl border-x border-t",
          "border-border/60 bg-background/95 px-3",
          "pb-[calc(0.25rem+env(safe-area-inset-bottom))]",
          "pt-1 shadow-none backdrop-blur-xl",
        ),
      chrome === "rail" &&
        cn(
          // 6.75rem is absolute on purpose: a w-28 would render at 89px under
          // the landscape --spacing rescale and squeeze the labels out.
          "flex w-[6.75rem] flex-col items-stretch justify-start gap-1",
          // Full height so the divider runs to the bottom of the dialog; the
          // triggers stay flex-none and justify-start, so they still hug the
          // top rather than stretching to fill it.
          "h-full",
          "overflow-y-auto overscroll-contain border-e border-border/60",
          "px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        ),
    )}
    style={
      chrome === "top"
        ? { gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }
        : undefined
    }
  >
    {tabs.map((tab) => (
      <DialogTabTrigger key={tab.value} tab={tab} chrome={chrome} />
    ))}
  </TabsList>
);

export default DialogTabList;

interface DialogTabTriggerProps {
  tab: DialogTab;
  chrome: DialogChrome;
}

const DialogTabTrigger: FC<DialogTabTriggerProps> = ({ tab, chrome }) => {
  const Icon = TAB_ICONS[tab.value] ?? LayoutGrid;
  const showIcon = chrome !== "top";

  return (
    <TabsTrigger
      value={tab.value}
      title={chrome === "rail" ? tab.name : undefined}
      // The rail sizes itself from padding; the landscape hit-area floor would
      // otherwise hold every tab at 32px and bring the blocks back.
      data-density-exempt={chrome === "rail" ? "" : undefined}
      className={cn(
        cn(
          "cursor-pointer bg-background text-muted-foreground",
          "transition-colors hover:text-foreground",
          "data-[state=active]:text-foreground",
          "data-[state=active]:shadow-none",
        ),
        chrome === "bottom" &&
          cn(
            "group min-h-(--touch) min-w-0 flex-1 flex-col gap-0",
            // Landscape has inline room and no block room, so the icon moves
            // beside the label instead of above it.
            "landscape-phone:flex-row landscape-phone:gap-1.5",
            "rounded-xl border-0 bg-transparent px-1 py-0.5",
            "text-2xs font-medium",
            "data-[state=active]:bg-transparent",
            "data-[state=active]:text-primary",
            "dark:data-[state=active]:border-transparent",
            "dark:data-[state=active]:bg-transparent",
          ),
        chrome === "rail" &&
          cn(
            // flex-none because the kit sets flex-1, which in a column rail
            // would stretch the tabs over the rail's whole height. Height then
            // comes from the padding rather than a --touch floor, so the items
            // stay compact instead of reading as stacked blocks; the rail
            // itself is still h-full, so its divider reaches the bottom.
            "group h-auto min-h-0 w-full flex-none justify-start gap-1.5",
            "rounded-lg border-0 px-2 py-1.5 text-2xs font-medium",
            // A filled pill, not a border: the trigger's inline edge is exactly
            // where the rail's own border-e sits, so an active side border
            // would read as a gap in the divider.
            "data-[state=active]:bg-primary/12",
            "data-[state=active]:font-semibold",
            "data-[state=active]:text-primary",
            "dark:data-[state=active]:border-transparent",
          ),
        chrome === "top" &&
          cn(
            "h-10 min-w-0 rounded-none border-0 border-b-2",
            "border-transparent px-2 text-xs",
            "hover:border-muted-foreground/30",
            "data-[state=active]:border-primary sm:text-sm",
          ),
      )}
    >
      {showIcon && (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center",
            "rounded-full transition-colors",
            chrome === "bottom" &&
              cn(
                "h-6 w-10",
                // The pill only reads as a selection cue behind a stacked
                // icon; in a row it just eats inline width.
                "landscape-phone:h-auto landscape-phone:w-auto",
                "group-data-[state=active]:bg-primary/12",
                "landscape-phone:group-data-[state=active]:bg-transparent",
              ),
          )}
        >
          <Icon aria-hidden className="size-4" />
        </span>
      )}
      <span className="max-w-full truncate">{tab.name}</span>
    </TabsTrigger>
  );
};
