"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import Translate from "@/common/components/translate/Translate";
import { CourseRequirement } from "@/app/dashboard/page";
import { FC, useMemo } from "react";

interface CourseSelectionRowProps {
  requirement: CourseRequirement;
}

const CourseSelectionRow: FC<CourseSelectionRowProps> = ({ requirement }) => {
  const isOneCourse = requirement.courses.length === 1;
  const isMandatory = isOneCourse && requirement.minCount === 1;

  const translate = useCommonTranslate();

  const NUM_TO_TYPED: Record<number, string> = useMemo(
    () => ({
      1: translate("_num_one"),
      2: translate("_num_two"),
      3: translate("_num_three"),
      4: translate("_num_four"),
      5: translate("_num_five"),
      6: translate("_num_six"),
      7: translate("_num_seven"),
      8: translate("_num_eight"),
      9: translate("_num_nine"),
      10: translate("_num_ten"),
      11: translate("_num_eleven"),
      12: translate("_num_twelve"),
    }),
    [translate],
  );

  return (
    <span className="leading-snug">
      {isMandatory ? (
        <Translate text="_dashboard_complete_one" />
      ) : (
        <Translate
          text="_dashboard_complete_many_of"
          args={{
            num: NUM_TO_TYPED[requirement.minCount] || requirement.minCount,
          }}
        />
      )}{" "}
      <b className="text-foreground font-semibold">
        {requirement.courses.map((c) => c.courseCode).join(", ")}
      </b>
      .
    </span>
  );
};

export default CourseSelectionRow;
