"use client";

import Translate from "@/common/components/translate/Translate";
import { EXAM_MODULE_CODES } from "./constants";
import { FC } from "react";

interface ExamBadgeProps {
  moduleCode: string;
  isOriginal?: boolean;
}

const ExamBadge: FC<ExamBadgeProps> = ({ moduleCode, isOriginal }) => {
  if (!EXAM_MODULE_CODES.some((code) => moduleCode.startsWith(code))) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center justify-center text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter shrink-0 leading-none ${
        isOriginal
          ? "bg-emerald-500 text-white"
          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      }`}
    >
      {isOriginal ? <Translate text="original" /> : <Translate text="retake" />}
    </span>
  );
};

export default ExamBadge;
