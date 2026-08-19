import MasterBadgeRequirementTooltip from "./MasterBadgeRequirementTooltip";
import { ProcessedMaster } from "../types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FC, ReactElement } from "react";

interface MasterRequirementTooltipProps {
  master: ProcessedMaster;
  trigger: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disableHoverableContent?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  className?: string;
}

const MasterRequirementTooltip: FC<MasterRequirementTooltipProps> = ({
  master,
  trigger,
  open,
  onOpenChange,
  disableHoverableContent,
  side = "bottom",
  sideOffset,
  className,
}) => (
  <Tooltip
    open={open}
    delayDuration={0}
    disableHoverableContent={disableHoverableContent}
    onOpenChange={onOpenChange}
  >
    <TooltipTrigger asChild>{trigger}</TooltipTrigger>
    <TooltipContent
      side={side}
      sideOffset={sideOffset}
      className={className}
    >
      <MasterBadgeRequirementTooltip
        name={master.name}
        master={master.master}
        all={master.requirements}
        fulfilled={master.fulfilled}
      />
    </TooltipContent>
  </Tooltip>
);

export default MasterRequirementTooltip;
