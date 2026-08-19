import { ProcessedMaster } from "../types";

export interface MasterProgressBadgeProps {
  master: ProcessedMaster;
  onHover?: () => void;
  tooltipOpen?: boolean;
  onTooltipOpenChange?: (open: boolean) => void;
}
