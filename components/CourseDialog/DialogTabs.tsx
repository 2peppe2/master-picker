"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC, ReactNode, useState, useRef, useEffect, useCallback } from "react";

interface Tab {
  name: string;
  value: string;
  content: ReactNode;
}

interface DialogTabsProps {
  tabs: Tab[];
  value?: string;
  onValueChange?: (value: string) => void;
}

const DialogTabs: FC<DialogTabsProps> = ({ tabs, value, onValueChange }) => (
  <Tabs
    defaultValue={tabs[0]?.value ?? ""}
    value={value}
    onValueChange={onValueChange}
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
      <ScrollableTabsContent key={tab.value} value={tab.value}>
        {tab.content}
      </ScrollableTabsContent>
    ))}
  </Tabs>
);

export default DialogTabs;

interface ScrollableTabsContentProps {
  value: string;
  children: ReactNode;
}

const ScrollableTabsContent: FC<ScrollableTabsContentProps> = ({
  value,
  children,
}) => {
  const [showFade, setShowFade] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setShowFade(scrollHeight > clientHeight + scrollTop + 2);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    handleScroll();
    const observer = new ResizeObserver(handleScroll);
    observer.observe(container);
    const content = container.firstElementChild;
    if (content) observer.observe(content);
    return () => observer.disconnect();
  }, [children, handleScroll]);

  return (
    <TabsContent
      value={value}
      ref={containerRef}
      onScroll={handleScroll}
      className="mt-0 h-0 flex-1 min-h-0 focus-visible:outline-none overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative"
    >
      <div className="text-muted-foreground text-sm w-full min-h-full pb-6">
        {children}
      </div>
      {showFade && (
        <div className="pointer-events-none sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background via-background/60 to-transparent shrink-0" />
      )}
    </TabsContent>
  );
};
