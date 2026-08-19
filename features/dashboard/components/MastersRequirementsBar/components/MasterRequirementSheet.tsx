import MasterRequirementBottomSheet from "./MasterRequirementBottomSheet";
import MasterRequirementSideSheet from "./MasterRequirementSideSheet";
import type { MasterRequirementSheetProps } from "./MasterRequirementSheet.types";
import { FC } from "react";

interface MasterRequirementSheetRouterProps
  extends MasterRequirementSheetProps {
  /** Landscape phones lack the height for a bottom sheet; portrait doesn't. */
  sideSheet: boolean;
}

const MasterRequirementSheet: FC<MasterRequirementSheetRouterProps> = ({
  sideSheet,
  ...props
}) =>
  sideSheet ? (
    <MasterRequirementSideSheet {...props} />
  ) : (
    <MasterRequirementBottomSheet {...props} />
  );

export default MasterRequirementSheet;
