"use client";

import Translate from "@/common/components/translate/Translate";
import MasterBadge from "@/components/MasterBadge";
import { FC, useEffect, useState } from "react";

const NUM_GUIDE_TITLES = 15;

interface GuideHeaderProps {
  selectedMaster: string;
}

const GuideHeader: FC<GuideHeaderProps> = ({ selectedMaster }) => {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    setTitleIndex(Math.floor(Math.random() * NUM_GUIDE_TITLES));
  }, []);

  return (
    <header className="flex flex-col gap-2">
      <MasterBadge name={selectedMaster} title={true} style="text-base" />
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        <Translate text={`_guide_title_${titleIndex}`} />
      </h1>
      <div className="mt-4 max-w-2xl">
        <p className="text-base text-muted-foreground">
          <Translate text="_guide_description" />
        </p>
      </div>
    </header>
  );
};

export default GuideHeader;
