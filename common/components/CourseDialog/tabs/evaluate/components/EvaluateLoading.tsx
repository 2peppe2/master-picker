"use client";

import { cn } from "@/lib/utils";

import Translate from "@/common/components/translate/Translate";
import { Loader2 } from "lucide-react";
import { FC } from "react";

const EvaluateLoading: FC = () => (
  <div
    className={cn(
      "mt-3 flex min-h-[260px] w-full flex-col items-center",
      "justify-center gap-4 rounded-2xl bg-muted/30",
      "text-muted-foreground",
    )}
  >
    <Loader2 className="h-8 w-8 animate-spin" />
    <p className="text-sm font-medium">
      <Translate text="_course_eval_loading" />
    </p>
  </div>
);

export default EvaluateLoading;
