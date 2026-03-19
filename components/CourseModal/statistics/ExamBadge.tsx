"use client";

import { FC } from "react";

interface ExamBadgeProps {
  moduleCode: string;
  isOriginal?: boolean;
}

const ExamBadge: FC<ExamBadgeProps> = ({ moduleCode, isOriginal }) => {
  if (
    !moduleCode.startsWith("TEN") &&
    !moduleCode.startsWith("DAT") &&
    !moduleCode.startsWith("PRA")
  ) {
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
      {isOriginal ? "Original" : "Retake"}
    </span>
  );
};

export default ExamBadge;
