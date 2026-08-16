"use client";

import { cn } from "@/lib/utils";

import Translate from "@/common/components/translate/Translate";
import { AlertCircle, FileText } from "lucide-react";
import { FC } from "react";

interface EvaluateErrorStateProps {
  hasError: boolean;
}

const EvaluateErrorState: FC<EvaluateErrorStateProps> = ({ hasError }) => (
  <div
    className={cn(
      "flex h-full min-h-[300px] w-full flex-col",
      "items-center justify-center gap-4",
      "text-muted-foreground",
    )}
  >
    <div
      className={cn(
        "w-12 h-12 rounded-full bg-muted flex items-center",
        "justify-center",
      )}
    >
      {hasError ? (
        <AlertCircle className="h-6 w-6 opacity-50" />
      ) : (
        <FileText className="h-6 w-6 opacity-50" />
      )}
    </div>
    <p className="text-sm font-medium">
      {hasError ? (
        <Translate text="_course_eval_error" />
      ) : (
        <Translate text="_course_eval_none" />
      )}
    </p>
  </div>
);

export default EvaluateErrorState;
