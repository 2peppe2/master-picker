"use client";

import Translate from "@/common/components/translate/Translate";
import { Loader2 } from "lucide-react";
import { FC } from "react";

const EvaluateLoading: FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[300px] h-full gap-4 text-muted-foreground w-full">
    <Loader2 className="h-8 w-8 animate-spin" />
    <p className="text-sm font-medium">
      <Translate text="_course_eval_loading" />
    </p>
  </div>
);

export default EvaluateLoading;
