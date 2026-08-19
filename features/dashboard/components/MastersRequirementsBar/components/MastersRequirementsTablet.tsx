"use client";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import MasterOverflowList from "./MasterOverflowList";
import MasterRequirementSheetContent from "./MasterRequirementSheetContent";
import MastersRequirementsSmallBar from "./MastersRequirementsSmallBar";
import Translate from "@/common/components/translate/Translate";
import { useMasterOverflowLayout } from "../hooks/useMasterOverflowLayout";
import { MastersRequirementsPresentationProps } from "./MastersRequirementsPresentation.types";
import { FC } from "react";
import { useMasterRequirementsSheet } from "../hooks/useMasterRequirementsSheet";

const GAP_SIZE = 8;

const MastersRequirementsTablet: FC<MastersRequirementsPresentationProps> = ({
  processed,
}) => {
  const { activeMaster, isOpen, selectMaster, setOpen } =
    useMasterRequirementsSheet();
  const { barRef, badgeRef, visibleItems, overflowItems } =
    useMasterOverflowLayout({
      gap: GAP_SIZE,
      masters: processed,
    });

  return (
    <BottomSheet open={isOpen} onOpenChange={setOpen}>
      <MastersRequirementsSmallBar
        badgeRef={badgeRef}
        barRef={barRef}
        measurementMaster={processed[0]}
        overflowCount={overflowItems.length}
        presentation="bottom-sheet"
        visibleItems={visibleItems}
      />
      <BottomSheetContent className="overflow-hidden">
        {activeMaster ? (
          <MasterRequirementSheetContent master={activeMaster} />
        ) : (
          <div className="min-h-0 overflow-y-auto p-6 pt-4">
            <BottomSheetTitle className="mb-3 text-base font-bold">
              <Translate text="_master_profiles" />
            </BottomSheetTitle>
            <BottomSheetDescription className="sr-only">
              <Translate text="_dashboard_master_progress" />
            </BottomSheetDescription>
            <MasterOverflowList
              masters={overflowItems}
              onMasterSelect={selectMaster}
            />
          </div>
        )}
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default MastersRequirementsTablet;
