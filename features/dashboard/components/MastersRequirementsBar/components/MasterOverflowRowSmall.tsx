import MasterOverflowRowTrigger from "./MasterOverflowRowTrigger";
import MasterRequirementSheet from "./MasterRequirementSheet";
import { MasterOverflowRowProps } from "./MasterOverflowRow.types";
import { FC } from "react";

const MasterOverflowRowSmall: FC<MasterOverflowRowProps> = ({
  master,
  onMasterSelect,
}) => {
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
      trigger={
        <MasterOverflowRowTrigger master={master} presentation="sheet" />
      }
    />
  );
};

export default MasterOverflowRowSmall;
