import { Droppable } from "@/components/Droppable";
import { Plus } from "lucide-react";
import { FC } from "react";

interface GhostBlockProps {
  semesterNumber: number;
  periodNumber: number;
  blockNumber: number;
}

const GhostBlock: FC<GhostBlockProps> = ({
  semesterNumber,
  periodNumber,
  blockNumber,
}) => {
  const blockId = `ghost-semester-${semesterNumber}-period${periodNumber}-block-${blockNumber}`;

  return (
    <Droppable
      id={blockId}
      data={{
        semesterNumber,
        periodNumber,
        blockNumber,
      }}
    >
      <div className="flex h-40 w-40 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Plus className="h-6 w-6" />
          <span className="text-sm font-medium">New Block</span>
        </div>
      </div>
    </Droppable>
  );
};

export default GhostBlock;
