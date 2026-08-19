import type { PhoneScheduleLayout } from "@/features/dashboard/state/preferences/atoms";
import { WILDCARD_BLOCK_START } from "@/features/dashboard/state/schedule/atoms";
import WildcardDivider from "./WildcardDivider";
import { slotSizeClasses } from "./periodSlotStyles";
import { FC, Fragment } from "react";
import Block from "./block";

interface PeriodBlockSlotProps {
  index: number;
  layout: PhoneScheduleLayout;
  semesterNumber: number;
  periodNumber: number;
}

const PeriodBlockSlot: FC<PeriodBlockSlotProps> = ({
  index,
  layout,
  semesterNumber,
  periodNumber,
}) => {
  const isWildcardStart = index === WILDCARD_BLOCK_START;
  const isWildcardBlock = index >= WILDCARD_BLOCK_START;
  const carousel = layout === "carousel";

  return (
    <Fragment>
      {isWildcardStart && <WildcardDivider carousel={carousel} />}
      <div className={slotSizeClasses(carousel)}>
        <Block
          variant={isWildcardBlock ? "wildcard" : "standard"}
          data={{ semesterNumber, periodNumber, blockNumber: index }}
        />
      </div>
    </Fragment>
  );
};

export default PeriodBlockSlot;
