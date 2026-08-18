"use client";

import { TabsList } from "@/components/ui/tabs";
import { DialogChrome, DialogTab } from "../types";
import DialogTabTrigger from "./DialogTabTrigger";
import { FC } from "react";
import { cn } from "@/lib/utils";

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
          "flex w-[6.75rem] flex-col items-stretch justify-start gap-1 h-full",
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
