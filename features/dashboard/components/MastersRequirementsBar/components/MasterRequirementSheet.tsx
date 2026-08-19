import MasterRequirementSheetContent from "./MasterRequirementSheetContent";
import { ProcessedMaster } from "../types";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { FC, ReactElement } from "react";

interface MasterRequirementSheetProps {
  master: ProcessedMaster;
  trigger?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MasterRequirementSheet: FC<MasterRequirementSheetProps> = ({
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

export default MasterRequirementSheet;
