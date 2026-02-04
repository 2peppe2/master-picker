import { useScheduleGetters } from "@/app/atoms/schedule/hooks/useScheduleGetters";
import { WILDCARD_BLOCK_START } from "@/app/atoms/schedule/atoms";
import { useFilterStore } from "@/app/atoms/filter/filterStore";
import { SemesterOption } from "@/app/atoms/filter/types";
import { FC, useCallback, useMemo } from "react";
import WildcardBlock from "./WildcardBlock";
import StandardBlock from "./StandardBlock";
import { Course } from "../../page";

export interface BlockProps {
  semesterNumber: number;
  periodNumber: number;
  blockNumber: number;
}

export interface BlockViewProps {
  courseSlot: Course | null;
  data: BlockProps;
  blockId: string;
  onFilterChange: () => void;
  displayNumber: number;
}

const Block: FC<BlockProps> = ({
  semesterNumber,
  periodNumber,
  blockNumber,
}) => {
  const { getSlotCourse } = useScheduleGetters();

  const {
    mutators: { selectBlocks, selectPeriods, selectSemester },
  } = useFilterStore();

  const courseSlot = getSlotCourse({
    semester: semesterNumber,
    period: periodNumber + 1,
    block: blockNumber + 1,
  });

  const data = useMemo(
    () => ({
      semesterNumber,
      periodNumber,
      blockNumber,
    }),
    [blockNumber, periodNumber, semesterNumber],
  );

  const isWildcard = blockNumber >= WILDCARD_BLOCK_START;
  const blockId = `semester-${semesterNumber}-period${periodNumber}-block-${blockNumber}`;

  const handleFilterChange = useCallback(() => {
    selectSemester((semesterNumber + 1) as SemesterOption);
    selectPeriods([periodNumber + 1]);

    if (!isWildcard) {
      selectBlocks([blockNumber + 1]);
    }
  }, [
    blockNumber,
    periodNumber,
    selectBlocks,
    selectPeriods,
    selectSemester,
    semesterNumber,
    isWildcard,
  ]);

  if (isWildcard) {
    return (
      <WildcardBlock
        courseSlot={courseSlot}
        data={data}
        blockId={blockId}
        onFilterChange={handleFilterChange}
        displayNumber={blockNumber + 1}
      />
    );
  }

  return (
    <StandardBlock
      courseSlot={courseSlot}
      data={data}
      blockId={blockId}
      onFilterChange={handleFilterChange}
      displayNumber={blockNumber + 1}
    />
  );
};

export default Block;
