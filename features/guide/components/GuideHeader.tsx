"use client";

import Translate from "@/common/components/translate/Translate";
import MasterBadge from "@/common/components/MasterBadge";
import { FC, useEffect, useState } from "react";

/**
 * Spelled out rather than built from an index so every key stays greppable --
 * an interpolated key silently renders itself when it goes missing.
 */
const GUIDE_TITLE_KEYS = [
  "_guide_title_0",
  "_guide_title_1",
  "_guide_title_2",
  "_guide_title_3",
  "_guide_title_4",
  "_guide_title_5",
  "_guide_title_6",
  "_guide_title_7",
  "_guide_title_8",
  "_guide_title_9",
  "_guide_title_10",
  "_guide_title_11",
  "_guide_title_12",
  "_guide_title_13",
  "_guide_title_14",
];

interface GuideHeaderProps {
  selectedMaster: string;
}

const GuideHeader: FC<GuideHeaderProps> = ({ selectedMaster }) => {
  const [titleKey, setTitleKey] = useState(GUIDE_TITLE_KEYS[0]);

  useEffect(() => {
    setTitleKey(
      GUIDE_TITLE_KEYS[Math.floor(Math.random() * GUIDE_TITLE_KEYS.length)],
    );
  }, []);

  return (
    <header className="flex flex-col gap-2 landscape-phone:gap-1">
      <MasterBadge name={selectedMaster} title={true} style="text-base" />
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl landscape-phone:text-xl">
        <Translate text={titleKey} />
      </h1>
      <div className="mt-2 max-w-2xl sm:mt-4 landscape-phone:mt-1">
        <p className="text-sm text-muted-foreground sm:text-base landscape-phone:text-xs">
          <Translate text="_guide_description" />
        </p>
      </div>
    </header>
  );
};

export default GuideHeader;
