import MasterOverflowRowTrigger from "./MasterOverflowRowTrigger";
import MasterRequirementTooltip from "./MasterRequirementTooltip";
import { MasterOverflowRowProps } from "./MasterOverflowRow.types";
import { FC } from "react";

const MasterOverflowRowLarge: FC<MasterOverflowRowProps> = ({
  master,
  side,
}) => (
  <MasterRequirementTooltip
    master={master}
    side={side}
    sideOffset={15}
    className="p-0 border-none bg-transparent shadow-none z-50"
    trigger={
      <MasterOverflowRowTrigger master={master} presentation="tooltip" />
    }
  />
);

export default MasterOverflowRowLarge;
