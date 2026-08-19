import type { ProcessedMaster } from "../types";
import type { ReactElement } from "react";

export interface MasterRequirementSheetProps {
  master: ProcessedMaster;
  trigger?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
