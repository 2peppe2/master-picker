"use client";

import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import MasterOverflowList from "./MasterOverflowList";
import MastersRequirementsSmallBar from "./MastersRequirementsSmallBar";
import Translate from "@/common/components/translate/Translate";
import { useMasterOverflowLayout } from "../hooks/useMasterOverflowLayout";
import { useBottomScrollFade } from "@/common/hooks/useBottomScrollFade";
import BottomFade from "@/common/components/BottomFade";
import { MastersRequirementsPresentationProps } from "./MastersRequirementsPresentation.types";
import { FC, useState } from "react";

const GAP_SIZE = 8;

const MastersRequirementsPhone: FC<MastersRequirementsPresentationProps> = ({
  processed,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { barRef, badgeRef, visibleItems, overflowItems } =
    useMasterOverflowLayout({
      gap: GAP_SIZE,
      masters: processed,
    });
  const { scrollRef, showFade, handleScroll } = useBottomScrollFade([
    overflowItems,
  ]);

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

export default MastersRequirementsPhone;
