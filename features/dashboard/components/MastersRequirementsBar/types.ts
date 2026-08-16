import { RequirementUnion } from "@/common/types";

export interface ProcessedMaster {
  name: string;
  master: string;
  progress: number;
  fulfilled: RequirementUnion[];
  requirements: RequirementUnion[];
}
