"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MasterProgressBadge from "./MasterProgressBadge";
import MasterOverflowRow from "./MasterOverflowRow";
import Translate from "@/common/components/translate/Translate";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { useIsLandscapePhone } from "@/common/hooks/useResponsiveLayout";
import { Badge } from "@/components/ui/badge";
import { ProcessedMaster } from "../types";
import { useMasterOverflowLayout } from "../hooks/useMasterOverflowLayout";
import { useBottomScrollFade } from "@/common/hooks/useBottomScrollFade";
import BottomFade from "@/common/components/BottomFade";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";

interface MastersRequirementsSmallProps {
  processed: ProcessedMaster[];
}

const GAP_SIZE = 8;

const MastersRequirementsSmall: FC<MastersRequirementsSmallProps> = ({
  processed,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isLandscapePhone = useIsLandscapePhone();
  const translate = useCommonTranslate();

  const { barRef, badgeRef, visibleItems, overflowItems } =
    useMasterOverflowLayout({
      gap: GAP_SIZE,
      masters: processed,
    });

  const { scrollRef, showFade, handleScroll } = useBottomScrollFade([
    overflowItems,
  ]);

  const moreLabel = (
    <Translate
      text="_wildcard_more_count"
      args={{ count: overflowItems.length }}
    />
  );

  const moreBadgeClassName = cn(
    "h-8 text-2xs font-bold text-muted-foreground flex-1 min-w-0",
    "bg-background/50 cursor-pointer hover:bg-muted/80 transition-colors",
    "justify-center px-3",
  );

  const bar = (
    <div
      className={cn(
        "flex items-center justify-between w-full gap-2 select-none group",
        // min-h, not h: h-10 is a --spacing multiple and collapsed to 32px in
        // landscape, squeezing the badges it is meant to contain.
        "min-h-(--touch-sm) h-auto",
      )}
    >
      {/* Invisible measurement template */}
      <div className="absolute -top-[1000px] invisible pointer-events-none">
        <div ref={badgeRef} className="inline-block">
          {processed[0] && <MasterProgressBadge master={processed[0]} />}
        </div>
      </div>

      <div
        ref={barRef}
        className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden h-full"
      >
        {visibleItems.map((master) => (
          <div key={master.master} className="shrink-0 h-8">
            <MasterProgressBadge master={master} />
          </div>
        ))}
        {overflowItems.length > 0 &&
          (isLandscapePhone ? (
            <SheetTrigger asChild>
              <Badge variant="outline" className={moreBadgeClassName}>
                {moreLabel}
              </Badge>
            </SheetTrigger>
          ) : (
            <CollapsibleTrigger asChild>
              <Badge variant="outline" className={moreBadgeClassName}>
                {moreLabel}
              </Badge>
            </CollapsibleTrigger>
          ))}
      </div>
    </div>
  );

  const overflowList = (
    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2 pr-1">
      {overflowItems.map((master, index) => (
        <MasterOverflowRow
          key={master.master}
          master={master}
          side={index % 2 === 0 ? "left" : "right"}
        />
      ))}
    </div>
  );

  /*
   * Landscape sends the overflow to a side sheet rather than expanding it
   * under the bar. The bar lives in a sticky header, and the inline panel is
   * at least 11rem tall -- close to half the viewport -- so opening it pushed
   * the whole dashboard down.
   */
  if (isLandscapePhone) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {bar}
        <SheetContent
          side="right"
          className={cn(
            "w-[min(26rem,90vw)] gap-0 sm:max-w-none",
            "overflow-y-auto p-4",
            "pe-[calc(1rem+env(safe-area-inset-right))]",
          )}
        >
          <SheetHeader className="p-0 pb-3">
            <SheetTitle className="text-base">
              <Translate text="_master_profiles" />
            </SheetTitle>
            <SheetDescription className="sr-only">
              {translate("_dashboard_master_progress")}
            </SheetDescription>
          </SheetHeader>
          {overflowList}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full flex flex-col"
    >
      {bar}

      <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="max-h-[max(11rem,60dvh)] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20"
          >
            <div className="pt-4 pb-4">
              {overflowList}
              {overflowItems.length === 0 && (
                <div className="py-4 text-center text-xs text-muted-foreground italic">
                  All profiles visible above
                </div>
              )}
            </div>
          </div>
          {showFade && <BottomFade />}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MastersRequirementsSmall;
