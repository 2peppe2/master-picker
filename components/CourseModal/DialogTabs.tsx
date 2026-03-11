"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  name: string;
  value: string;
  content: ReactNode;
}

interface DialogTabsProps {
  tabs: Tab[];
}

const DialogTabs: FC<DialogTabsProps> = ({ tabs }) => (
  <Tabs
    defaultValue={tabs[0]?.value ?? ""}
    className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
  >
    <TabsList
      className="bg-background grid w-full shrink-0 rounded-none p-0"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="cursor-pointer bg-background data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 h-10 min-w-0 rounded-none border-0 border-b-2 border-transparent px-2 text-xs data-[state=active]:shadow-none transition-colors sm:text-sm"
        >
          <span className="truncate">{tab.name}</span>
        </TabsTrigger>
      ))}
    </TabsList>

    {tabs.map((tab) => (
      <TabsContent
        key={tab.value}
        value={tab.value}
        className={cn(
          "mt-0 h-0 flex-1 min-h-0 focus-visible:outline-none overflow-y-scroll overflow-x-hidden",
        )}
      >
        <div className="text-muted-foreground text-sm w-full min-h-full">
          {tab.content}
        </div>
      </TabsContent>
    ))}
  </Tabs>
);

export default DialogTabs;
