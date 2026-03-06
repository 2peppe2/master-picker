import { RequirementUnion } from "../page";

export interface ProcessedMaster {
  name: string;
  master: string;
  progress: number;
  fulfilled: RequirementUnion[];
  requirements: RequirementUnion[];
}
