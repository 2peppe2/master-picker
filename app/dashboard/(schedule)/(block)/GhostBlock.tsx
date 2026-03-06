import { Droppable } from "@/components/Droppable";
import { Plus } from "lucide-react";
import { BlockProps } from ".";
import { FC } from "react";

const GhostBlock: FC<BlockProps> = ({ data }) => (
  <Droppable
    id={`ghost-semester-${data.semesterNumber}-period${data.periodNumber}-block-${data.blockNumber}`}
    data={data}
  >
    <div className="flex h-40 w-40 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Plus className="h-6 w-6" />
        <span className="text-sm font-medium">New Block</span>
      </div>
    </div>
  </Droppable>
);

export default GhostBlock;
