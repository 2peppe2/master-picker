import { ProcessedMaster } from "../types";

export interface MasterOverflowBadgeProps {
  minWidth: number;
  masters: ProcessedMaster[];
  count: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
