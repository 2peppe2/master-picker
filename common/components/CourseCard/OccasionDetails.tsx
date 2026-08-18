import Translate from "@/common/components/translate/Translate";
import { FC } from "react";

interface OccasionDetailsProps {
  relativeSemester: number;
  periods: string;
  blocks: string;
}

const OccasionDetails: FC<OccasionDetailsProps> = ({
  relativeSemester,
  periods,
  blocks,
}) => (
  <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
    <span className="font-semibold text-foreground">
      <Translate text="_semester_label" args={{ s: relativeSemester }} />
    </span>
    <span className="text-xs text-muted-foreground">
      {periods ? `Period ${periods}` : "Unknown Period"} &bull;{" "}
      {blocks ? `Block ${blocks}` : "No Block"}
    </span>
  </div>
);

export default OccasionDetails;
