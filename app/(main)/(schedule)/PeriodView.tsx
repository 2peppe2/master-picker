import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { range } from "lodash";
import { BlockView } from "./BlockView";
import { FC } from "react";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PeriodViewProps {
  semesterNumber: number;
  periodNumber: number;
}

export const PeriodView: FC<PeriodViewProps> = ({
  semesterNumber,
  periodNumber,
}) => {
  const {
    getters: { getSlotBlocks },
  } = useScheduleStore();
  const blocks = getSlotBlocks({
    semester: semesterNumber,
    period: periodNumber + 1,
  });

  return (
    <div className="flex w-full max-w-full gap-5 overflow-x-auto pb-4 justify-around">
      {range(0, blocks.length).map((index: number) => (
        <BlockView
          key={index}
          semesterNumber={semesterNumber}
          periodNumber={periodNumber}
          blockNumber={index}
        />
      ))}
      <div>
        <Separator orientation="vertical" className="h-full" />
      </div>
      
      <div className="flex items-center justify-center p-2 border-2 rounded-md h-20 w-20 shrink-0 border-zinc-500">
        <Plus className="text-zinc-500 hover:text-foreground size-12" />
        Add Block
      </div>
      
    </div>
  );
};
