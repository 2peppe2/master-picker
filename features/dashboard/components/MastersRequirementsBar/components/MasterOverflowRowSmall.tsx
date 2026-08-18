import MasterOverflowRowTrigger from "./MasterOverflowRowTrigger";
import MasterRequirementSheet from "./MasterRequirementSheet";
import { MasterOverflowRowProps } from "./MasterOverflowRow.types";
import { FC } from "react";

const MasterOverflowRowSmall: FC<MasterOverflowRowProps> = ({ master }) => (
  <MasterRequirementSheet
    master={master}
    trigger={
      <MasterOverflowRowTrigger master={master} presentation="sheet" />
    }
  />
);

export default MasterOverflowRowSmall;
