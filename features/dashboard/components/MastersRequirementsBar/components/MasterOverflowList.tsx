import MasterOverflowRow from "./MasterOverflowRow";
import { ProcessedMaster } from "../types";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface MasterOverflowListProps {
  masters: ProcessedMaster[];
  className?: string;
  onMasterSelect?: (master: ProcessedMaster) => void;
}

const MasterOverflowList: FC<MasterOverflowListProps> = ({
  masters,
  className,
  onMasterSelect,
}) => (
  <div
    className={cn(
      "grid grid-cols-1 min-[360px]:grid-cols-2 gap-2",
      className,
    )}
  >
    {masters.map((master, index) => (
      <MasterOverflowRow
        key={master.master}
        master={master}
        side={index % 2 === 0 ? "left" : "right"}
        onMasterSelect={onMasterSelect}
      />
    ))}
  </div>
);

export default MasterOverflowList;
