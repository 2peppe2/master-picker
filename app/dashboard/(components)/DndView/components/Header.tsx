"use client";

import MastersRequirementsBar from "../../MastersRequirementsBar";
import LanguageSwitcher from "@/common/components/LanguageSwitcher";
import SettingsModal from "./SettingsModal";
import Disclaimer from "./Disclaimer";
import { FC, useState } from "react";

const Header: FC = ({}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="bg-card sticky top-0 z-40 w-full border-b border-border backdrop-blur-md bg-opacity-80">
      <div className="px-8 h-25 flex items-center justify-between gap-6">
        <div className="flex flex-col w-full border-r h-12 px-4 items-center">
          <MastersRequirementsBar />
          <Disclaimer  />
          
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
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
