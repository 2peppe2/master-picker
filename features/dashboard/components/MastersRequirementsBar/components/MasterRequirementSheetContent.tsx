import MasterBadgeRequirementTooltip from "./MasterBadgeRequirementTooltip";
import Translate from "@/common/components/translate/Translate";
import { ProcessedMaster } from "../types";
import {
  BottomSheetDescription,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import { FC } from "react";

interface MasterRequirementSheetContentProps {
  master: ProcessedMaster;
}

const MasterRequirementSheetContent: FC<
  MasterRequirementSheetContentProps
> = ({ master }) => (
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
);

export default MasterRequirementSheetContent;
