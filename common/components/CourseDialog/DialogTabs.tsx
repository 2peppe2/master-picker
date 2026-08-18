"use client";

import { useCourseTabSwipe } from "./hooks/useCourseTabSwipe";
import DialogTabList from "./components/DialogTabList";
import { Tabs } from "@/components/ui/tabs";
import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DialogChrome, DialogTab } from "./types";

interface DialogTabsProps {
  tabs: DialogTab[];
  value?: string;
  onValueChange?: (value: string) => void;
  chrome?: DialogChrome;
  /** The tab panels, rendered inside the Tabs context. */
  children: ReactNode;
}

const DialogTabs: FC<DialogTabsProps> = ({
  tabs,
  value,
  onValueChange,
  chrome = "top",
  children,
}) => {
  const swipeBindings = useCourseTabSwipe({
    // Both touch shells keep the gesture. The rail sits outside the swipeable
    // pane, so a horizontal drag on content never contends with it.
    enabled: chrome !== "top",
    tabValues: tabs.map((tab) => tab.value),
    value,
    onValueChange,
  });

  const isRail = chrome === "rail";

  /*
   * The panels need a column flex parent: ScrollableTabsContent sizes itself
   * with h-0 min-h-0 flex-1, which only means "fill the remaining height"
   * inside a column. Dropped straight into the rail's row, flex-1 would size
   * the inline axis and h-0 would collapse the panel to nothing. So the rail
   * reuses the phone wrapper rather than rendering children bare.
   */
  const panels =
    chrome === "top" ? (
      children
    ) : (
      <div
        className={cn(
          "flex min-h-0 flex-1 touch-pan-y flex-col",
          "overflow-hidden",
        )}
      >
        {children}
      </div>
    );

  return (
    <Tabs
      defaultValue={tabs[0]?.value ?? ""}
      value={value}
      onValueChange={onValueChange}
      orientation={isRail ? "vertical" : undefined}
      className={cn(
        "flex h-full min-h-0 flex-1 overflow-hidden",
        isRail ? "flex-row gap-0" : "flex-col",
      )}
      {...swipeBindings}
    >
      {/* Phones put the tab bar below the content, like a native tab bar; the
          rail and the desktop row both come first. */}
      {chrome !== "bottom" && <DialogTabList tabs={tabs} chrome={chrome} />}
      {panels}
      {chrome === "bottom" && <DialogTabList tabs={tabs} chrome={chrome} />}
    </Tabs>
  );
};

export default DialogTabs;
