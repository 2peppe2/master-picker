"use client";

import MastersRequirementsBar from "../../MastersRequirementsBar";
import SettingsModal from "./SettingsModal";
import Disclaimer from "./Disclaimer";
import { FC, useState } from "react";

const Header: FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="bg-card sticky top-0 z-40 w-full border-b border-border backdrop-blur-md bg-opacity-80 overflow-hidden">
      <Disclaimer />
      <div className="px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-6">
        <div className="flex-1 min-w-0 border-r h-10 md:h-12 px-2 md:px-4 flex flex-col items-center justify-center">
          <MastersRequirementsBar />
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <SettingsModal
            isOpen={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
