"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useCourseTabSwipe } from "./hooks/useCourseTabSwipe";
import { useBottomScrollFade } from "@/common/hooks/useBottomScrollFade";
import BottomFade from "@/common/components/BottomFade";
import {
  BarChart3,
  ClipboardList,
  LayoutGrid,
  Star,
  type LucideIcon,
} from "lucide-react";
import { FC, ReactNode } from "react";

interface Tab {
  name: string;
  value: string;
  content: ReactNode;
}

interface DialogTabsProps {
  tabs: Tab[];
  value?: string;
  onValueChange?: (value: string) => void;
  phone?: boolean;
}

const PHONE_TAB_ICONS: Record<string, LucideIcon> = {
  overview: LayoutGrid,
  examination: ClipboardList,
  statistics: BarChart3,
  "evaliuate-score": Star,
};

const DialogTabs: FC<DialogTabsProps> = ({
  tabs,
  value,
  onValueChange,
  phone = false,
}) => {
  const swipeBindings = useCourseTabSwipe({
    enabled: phone,
    tabValues: tabs.map((tab) => tab.value),
    value,
    onValueChange,
  });

  const tabList = (
    <TabsList
      className={cn(
        "w-full shrink-0 rounded-none bg-background p-0",
        phone
          ? cn(
              "relative z-50 flex h-auto items-center gap-0",
              "overflow-hidden rounded-t-2xl border-x border-t",
              "border-border/60 bg-background/95 px-3",
              "pb-[calc(0.35rem+env(safe-area-inset-bottom))]",
              "pt-1.5 shadow-none backdrop-blur-xl",
            )
          : "grid",
      )}
      style={
        phone
          ? undefined
          : { gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }
      }
    >
      {tabs.map((tab) => (
        <DialogTabTrigger key={tab.value} tab={tab} phone={phone} />
      ))}
    </TabsList>
  );

  const tabContents = tabs.map((tab) => (
    <ScrollableTabsContent key={tab.value} value={tab.value} phone={phone}>
      {tab.content}
    </ScrollableTabsContent>
  ));

  return (
    <Tabs
      defaultValue={tabs[0]?.value ?? ""}
      value={value}
      onValueChange={onValueChange}
      className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
      {...swipeBindings}
    >
      {phone ? (
        <div
          className={cn(
            "flex min-h-0 flex-1 touch-pan-y flex-col",
            "overflow-hidden",
          )}
        >
          {tabContents}
        </div>
      ) : (
        tabList
      )}
      {phone ? tabList : tabContents}
    </Tabs>
  );
};

export default DialogTabs;

interface DialogTabTriggerProps {
  tab: Tab;
  phone: boolean;
}

const DialogTabTrigger: FC<DialogTabTriggerProps> = ({ tab, phone }) => {
  const Icon = PHONE_TAB_ICONS[tab.value] ?? LayoutGrid;

  return (
    <TabsTrigger
      value={tab.value}
      className={cn(
        cn(
          "cursor-pointer bg-background text-muted-foreground",
          "transition-colors hover:text-foreground",
          "data-[state=active]:text-foreground",
          "data-[state=active]:shadow-none",
        ),
        phone
          ? cn(
              "group min-h-14 min-w-0 flex-1 flex-col gap-0.5",
              "rounded-xl border-0 bg-transparent px-1 py-1",
              "text-[11px] font-medium",
              "data-[state=active]:bg-transparent",
              "data-[state=active]:text-primary",
              "dark:data-[state=active]:border-transparent",
              "dark:data-[state=active]:bg-transparent",
            )
          : cn(
              "h-10 min-w-0 rounded-none border-0 border-b-2",
              "border-transparent px-2 text-xs",
              "hover:border-muted-foreground/30",
              "data-[state=active]:border-primary sm:text-sm",
            ),
      )}
    >
      {phone && (
        <span
          className={cn(
            "flex h-7 w-12 shrink-0 items-center justify-center",
            "rounded-full transition-colors",
            "group-data-[state=active]:bg-primary/12",
          )}
        >
          <Icon aria-hidden className="size-[18px]" />
        </span>
      )}
      <span className="max-w-full truncate">{tab.name}</span>
    </TabsTrigger>
  );
};

interface ScrollableTabsContentProps {
  value: string;
  children: ReactNode;
  phone: boolean;
}

const ScrollableTabsContent: FC<ScrollableTabsContentProps> = ({
  value,
  children,
  phone,
}) => {
  const { scrollRef, showFade, handleScroll } = useBottomScrollFade([children]);

  return (
    <TabsContent
      value={value}
      className={cn(
        "relative mt-0 h-0 min-h-0 flex-1 overflow-hidden",
        "focus-visible:outline-none",
      )}
    >
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          "h-full overflow-x-hidden overflow-y-auto",
          "[scrollbar-width:none] [-ms-overflow-style:none]",
          "[&::-webkit-scrollbar]:hidden",
        )}
      >
        <div
          className={cn(
            "min-h-full w-full text-sm",
            phone ? "px-4 pb-6 text-foreground" : "pb-6 text-muted-foreground",
          )}
        >
          {children}
        </div>
      </div>
      {showFade && <BottomFade />}
    </TabsContent>
  );
};
