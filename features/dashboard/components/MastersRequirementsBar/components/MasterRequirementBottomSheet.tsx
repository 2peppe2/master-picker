import MasterRequirementSheetContent from "./MasterRequirementSheetContent";
import type { MasterRequirementSheetProps } from "./MasterRequirementSheet.types";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { FC } from "react";

const MasterRequirementBottomSheet: FC<MasterRequirementSheetProps> = ({
  master,
  trigger,
  open,
  onOpenChange,
}) => (
  <BottomSheet open={open} onOpenChange={onOpenChange}>
    {trigger && <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>}
    <BottomSheetContent className="overflow-hidden">
      <MasterRequirementSheetContent master={master} />
    </BottomSheetContent>
  </BottomSheet>
);

export default MasterRequirementBottomSheet;
