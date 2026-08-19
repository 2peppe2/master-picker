import MasterOverflowRowTrigger from "./MasterOverflowRowTrigger";
import MasterRequirementSheet from "./MasterRequirementSheet";
import { MasterOverflowRowProps } from "./MasterOverflowRow.types";
import { FC } from "react";

const MasterOverflowRowSmall: FC<
  MasterOverflowRowProps & { sideSheet: boolean }
> = ({ master, onMasterSelect, sideSheet }) => {
  if (onMasterSelect) {
    return (
      <MasterOverflowRowTrigger
        master={master}
        presentation="sheet"
        onClick={() => onMasterSelect(master)}
      />
    );
  }

  return (
    <MasterRequirementSheet
      master={master}
      sideSheet={sideSheet}
      trigger={
        <MasterOverflowRowTrigger master={master} presentation="sheet" />
      }
    />
  );
};

export default MasterOverflowRowSmall;
