"use client";

import Translate from "@/common/components/translate/Translate";
import { FC } from "react";

const EvaluationSourceLink: FC = () => (
  <div className="flex flex-col gap-2">
    <p className="text-[11px] leading-relaxed text-muted-foreground italic">
      <Translate text="_course_eval_data_via" />{" "}
      <a
        href="https://admin.evaliuate.liu.se/search"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline font-medium"
      >
        LiU Evaliuate
      </a>
      . <Translate text="_course_eval_desc" />
    </p>
  </div>
);

export default EvaluationSourceLink;
