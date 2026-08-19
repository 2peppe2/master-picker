"use client";

import { useBottomScrollFade } from "@/common/hooks/useBottomScrollFade";
import BottomFade from "@/common/components/BottomFade";
import { TabsContent } from "@/components/ui/tabs";
import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DialogChrome } from "../types";

interface ScrollableTabsContentProps {
  value: string;
  children: ReactNode;
  chrome: DialogChrome;
}

/**
 * The rail already owns the left gutter, so its panel only pads the far edge,
 * where a landscape notch can otherwise sit over the content.
 */
const PANEL_PADDING: Record<DialogChrome, string> = {
  top: "pb-6 text-muted-foreground",
  bottom: "px-4 pb-6 text-foreground",
  rail: "ps-3 pe-[calc(1rem+env(safe-area-inset-right))] pb-6 text-foreground",
};

const ScrollableTabsContent: FC<ScrollableTabsContentProps> = ({
  value,
  children,
  chrome,
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
          className={cn("min-h-full w-full text-sm", PANEL_PADDING[chrome])}
        >
          {children}
        </div>
      </div>
      {showFade && <BottomFade />}
    </TabsContent>
  );
};

export default ScrollableTabsContent;
