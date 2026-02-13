import { RequirementsUnion } from "../page";

export interface ProcessedMaster {
  name: string;
  master: string;
  progress: number;
  fulfilled: RequirementsUnion[];
  requirements: RequirementsUnion[];
}
