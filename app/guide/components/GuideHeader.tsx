"use client";

import { MasterBadge } from "@/components/MasterBadge";
import { FC, useEffect, useState } from "react";
import { GEN_Z_TITLES } from "../titles";

interface GuideHeaderProps {
  selectedMaster: string;
}

const GuideHeader: FC<GuideHeaderProps> = ({ selectedMaster }) => {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    if (GEN_Z_TITLES.length === 0) {
      return;
    }
    setTitleIndex(Math.floor(Math.random() * GEN_Z_TITLES.length));
  }, []);

  return (
    <header className="flex flex-col gap-2">
      <MasterBadge name={selectedMaster} title={true} style="text-base" />
      <h1 className="text-3xl font-semibold tracking-tight">
        {GEN_Z_TITLES[titleIndex]}
      </h1>
      <div className="mt-4 max-w-2xl">
        <p className="text-base text-muted-foreground">
          {
            "Required courses are added automatically. This master requires you to choose between several course options. Dont worry, you can change your choices later if you change your mind!"
          }
        </p>
      </div>
    </header>
  );
};

export default GuideHeader;
