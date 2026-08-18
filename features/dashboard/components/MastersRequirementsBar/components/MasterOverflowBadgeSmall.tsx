"use client";

import MasterOverflowList from "./MasterOverflowList";
import MasterOverflowTrigger from "./MasterOverflowTrigger";
import { MasterOverflowBadgeProps } from "./MasterOverflowBadge.types";
import Translate from "@/common/components/translate/Translate";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { FC } from "react";

const MasterOverflowBadgeSmall: FC<MasterOverflowBadgeProps> = ({
  minWidth,
  masters,
  count,
  open,
  onOpenChange,
}) => (
  <BottomSheet open={open} onOpenChange={onOpenChange}>
    <BottomSheetTrigger asChild>
      <MasterOverflowTrigger
        count={count}
        minWidth={minWidth}
        presentation="sheet"
      />
    </BottomSheetTrigger>
    <BottomSheetContent className="overflow-hidden">
      <div className="min-h-0 overflow-y-auto p-6 pt-4">
        <BottomSheetTitle className="mb-3 text-base font-bold">
          <Translate text="_master_profiles" />
        </BottomSheetTitle>
        <BottomSheetDescription className="sr-only">
          <Translate text="_dashboard_master_progress" />
        </BottomSheetDescription>
        <MasterOverflowList masters={masters} />
      </div>
    </BottomSheetContent>
  </BottomSheet>
);

export default MasterOverflowBadgeSmall;
