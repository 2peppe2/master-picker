"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import MasterProgressBadge from "./MasterProgressBadge";
import MasterOverflowRow from "./MasterOverflowRow";
import Translate from "@/common/components/translate/Translate";
import { Badge } from "@/components/ui/badge";
import { ProcessedMaster } from "../types";
import { useMasterOverflowLayout } from "../hooks/useMasterOverflowLayout";
import { useBottomScrollFade } from "@/common/hooks/useBottomScrollFade";
import BottomFade from "@/common/components/BottomFade";
import { FC, useState } from "react";

interface MastersRequirementsSmallProps {
  processed: ProcessedMaster[];
}

const GAP_SIZE = 8;

const MastersRequirementsSmall: FC<MastersRequirementsSmallProps> = ({
  processed,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { barRef, badgeRef, visibleItems, overflowItems } =
    useMasterOverflowLayout({
    gap: GAP_SIZE,
    masters: processed,
  });

  const { scrollRef, showFade, handleScroll } =
    useBottomScrollFade([overflowItems]);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full flex flex-col"
    >
      <div className="flex items-center justify-between w-full h-10 gap-2 select-none group">
        {/* Invisible measurement template */}
        <div className="absolute -top-[1000px] invisible pointer-events-none">
          <div ref={badgeRef} className="inline-block">
            {processed[0] && <MasterProgressBadge master={processed[0]} />}
          </div>
        </div>

        <div ref={barRef} className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden h-full">
          {visibleItems.map((master) => (
            <div key={master.master} className="shrink-0 h-8">
              <MasterProgressBadge master={master} />
            </div>
          ))}
          {overflowItems.length > 0 && (
            <CollapsibleTrigger asChild>
              <Badge
                variant="outline"
                className="h-8 text-[10px] font-bold text-muted-foreground flex-1 min-w-0 bg-background/50 cursor-pointer hover:bg-muted/80 transition-colors justify-center px-3"
              >
                <Translate text="_wildcard_more_count" args={{ count: overflowItems.length }} />
              </Badge>
            </CollapsibleTrigger>
          )}
        </div>
      </div>

      <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="max-h-[60dvh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20"
          >
            <div className="pt-4 pb-4">
              <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2 pr-1">
                {overflowItems.map((master, index) => (
                  <MasterOverflowRow
                    key={master.master}
                    master={master}
                    side={index % 2 === 0 ? "left" : "right"}
                  />
                ))}
              </div>
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
