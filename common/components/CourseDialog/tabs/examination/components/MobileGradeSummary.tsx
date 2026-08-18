"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { Scale } from "@/prisma/generated/client/enums";
import { Module } from "liu-tentor-package";
import { FC } from "react";

interface MobileGradeSummaryProps {
  scale: Scale;
  stats: Module | null;
  isLoading: boolean;
}

const MobileGradeSummary: FC<MobileGradeSummaryProps> = ({ scale, stats, isLoading }) => {
  const translate = useCommonTranslate();
  if (isLoading) return <span aria-label={translate("loading")}>•••</span>;
  if (!stats) return <>–</>;

  const getCount = (grade: string) =>
    stats.grades.find((item) => item.grade === grade)?.quantity ?? 0;

  if (scale === Scale.G_OR_U) {
    const passed = getCount("G") + getCount("3") + getCount("4") + getCount("5");
    return <span className="whitespace-nowrap">G: {passed} · U: {getCount("U")}</span>;
  }

  return <span className="whitespace-nowrap">5: {getCount("5")} · 4: {getCount("4")} · 3: {getCount("3")} · U: {getCount("U")}</span>;
};

export default MobileGradeSummary;
