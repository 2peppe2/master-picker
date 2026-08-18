import MasterBadgeRequirementTooltip from "./MasterBadgeRequirementTooltip";
import Translate from "@/common/components/translate/Translate";
import { ProcessedMaster } from "../types";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { FC, ReactElement } from "react";

interface MasterRequirementSheetProps {
  master: ProcessedMaster;
  trigger: ReactElement;
}

const MasterRequirementSheet: FC<MasterRequirementSheetProps> = ({
  master,
  trigger,
}) => (
  <BottomSheet>
    <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>
    <BottomSheetContent className="overflow-hidden">
      <div className="min-h-0 overflow-y-auto p-6 pt-4">
        <BottomSheetTitle className="sr-only">
          <Translate text="_master_requirements" />
        </BottomSheetTitle>
        <BottomSheetDescription className="sr-only">
          <Translate text="_master_requirements_details" />
        </BottomSheetDescription>
        <MasterBadgeRequirementTooltip
          name={master.name}
          master={master.master}
          all={master.requirements}
          fulfilled={master.fulfilled}
          className="p-0 max-w-none w-full border-none shadow-none bg-transparent backdrop-blur-none"
        />
      </div>
    </BottomSheetContent>
  </BottomSheet>
);

export default MasterRequirementSheet;
