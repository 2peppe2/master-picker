import CourseSelectionRow from "./rows/CourseSelectionRow";
import MainFieldRow from "./rows/MainFieldRow";
import CreditRow from "./rows/CreditRow";
import { RequirementUnion } from "@/common/types";
import { FC } from "react";

interface MasterRequirementRowContentProps {
  requirement: RequirementUnion;
}

const MasterRequirementRowContent: FC<
  MasterRequirementRowContentProps
> = ({ requirement }) => {
  switch (requirement.type) {
    case "COURSE_SELECTION":
      return <CourseSelectionRow requirement={requirement} />;

    case "CREDITS_MAIN_FIELD_TOTAL":
      return (
        <MainFieldRow
          requirement={requirement}
          fieldProgress={requirement.fieldProgress}
        />
      );

    case "CREDITS_TOTAL":
    case "CREDITS_MASTER_TOTAL":
    case "CREDITS_PROFILE_TOTAL":
    case "CREDITS_ADVANCED_PROFILE":
    case "CREDITS_ADVANCED_MASTER":
      return (
        <CreditRow requirement={requirement} current={requirement.current} />
      );

    default:
      throw new Error(
        `Unhandled requirement type: ${JSON.stringify(requirement)}`,
      );
  }
};

export default MasterRequirementRowContent;
