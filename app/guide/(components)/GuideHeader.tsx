"use client";

import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";
import MasterBadge from "@/components/MasterBadge";
import { FC, useEffect, useState } from "react";

interface GuideHeaderProps {
  selectedMaster: string;
}

const GuideHeader: FC<GuideHeaderProps> = ({ selectedMaster }) => {
  const t = useCommonTranslate();
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    // We have 15 titles (0-14)
    setTitleIndex(Math.floor(Math.random() * 15));
  }, []);

  return (
    <header className="flex flex-col gap-2">
      <MasterBadge name={selectedMaster} title={true} style="text-base" />
      <h1 className="text-3xl font-semibold tracking-tight">
        {t(`_guide_title_${titleIndex}`)}
      </h1>
      <div className="mt-4 max-w-2xl">
        <p className="text-base text-muted-foreground">
          {t("_guide_description")}
        </p>
      </div>
    </header>
  );
};

export default GuideHeader;
