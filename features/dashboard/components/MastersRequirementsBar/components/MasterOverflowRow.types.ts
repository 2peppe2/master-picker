import { ProcessedMaster } from "../types";

export interface MasterOverflowRowProps {
  master: ProcessedMaster;
  side: "left" | "right";
  onMasterSelect?: (master: ProcessedMaster) => void;
}
