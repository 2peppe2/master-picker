"use client";

import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import MasterOverflowList from "./MasterOverflowList";
import MastersRequirementsSmallBar from "./MastersRequirementsSmallBar";
import Translate from "@/common/components/translate/Translate";
import { useIsLandscapePhone } from "@/common/hooks/useResponsiveLayout";
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

  const { barRef, badgeRef, visibleItems, overflowItems } =
    useMasterOverflowLayout({
      gap: GAP_SIZE,
      masters: processed,
    });

  const { scrollRef, showFade, handleScroll } = useBottomScrollFade([
    overflowItems,
  ]);

  /*
   * Landscape sends the overflow to a side sheet rather than expanding it
   * under the bar. The bar lives in a sticky header, and the inline panel is
   * at least 11rem tall -- close to half the viewport -- so opening it pushed
   * the whole dashboard down.
   */
  if (isLandscapePhone) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <MastersRequirementsSmallBar
          badgeRef={badgeRef}
          barRef={barRef}
          measurementMaster={processed[0]}
          overflowCount={overflowItems.length}
          presentation="sheet"
          visibleItems={visibleItems}
        />
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
              <Translate text="_dashboard_master_progress" />
            </SheetDescription>
          </SheetHeader>
          <MasterOverflowList masters={overflowItems} className="pr-1" />
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
      <MastersRequirementsSmallBar
        badgeRef={badgeRef}
        barRef={barRef}
        measurementMaster={processed[0]}
        overflowCount={overflowItems.length}
        presentation="collapsible"
        visibleItems={visibleItems}
      />

      <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="max-h-[max(11rem,60dvh)] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20"
          >
            <div className="pt-4 pb-4">
              <MasterOverflowList masters={overflowItems} className="pr-1" />
              {overflowItems.length === 0 && (
                <div className="py-4 text-center text-xs text-muted-foreground italic">
                  <Translate text="_all_master_profiles_visible_above" />
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
