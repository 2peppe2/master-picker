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
  <Tabs defaultValue={tabs[0]?.value ?? ""} className="flex flex-col h-[420px]">
    <TabsList className="bg-background rounded-none border-b p-0 justify-start shrink-0">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="bg-background data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 h-10 rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none transition-all"
        >
          {tab.name}
        </TabsTrigger>
      ))}
    </TabsList>

    {tabs.map((tab) => (
      <TabsContent
        key={tab.value}
        value={tab.value}
        className={cn(
          "h-full mt-0 focus-visible:outline-none overflow-y-auto overflow-x-hidden",
        )}
      >
        <div className="text-muted-foreground text-sm w-full">
          {tab.content}
        </div>
      </TabsContent>
    ))}
  </Tabs>
);

export default DialogTabs;
