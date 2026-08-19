"use client";

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
import { useMasterOverflowLayout } from "../hooks/useMasterOverflowLayout";
import { MastersRequirementsPresentationProps } from "./MastersRequirementsPresentation.types";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";

const GAP_SIZE = 8;

const MastersRequirementsLandscape: FC<
  MastersRequirementsPresentationProps
> = ({ processed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { barRef, badgeRef, visibleItems, overflowItems } =
    useMasterOverflowLayout({
      gap: GAP_SIZE,
      masters: processed,
    });

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
};

export default MastersRequirementsLandscape;
