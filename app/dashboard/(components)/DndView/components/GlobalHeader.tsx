"use client";

import BackButton from "@/common/components/BackButton";
import MastersRequirementsBar from "../../MastersRequirementsBar";
import SettingsModal from "./SettingsModal";
import ShareButton from "../../Drawer/components/ShareButton";
import Disclaimer from "./Disclaimer";
import { FC, useState } from "react";

const GlobalHeader: FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="bg-card sticky top-0 z-40 w-full border-b border-border backdrop-blur-md bg-opacity-80 flex flex-col shrink-0">
      <Disclaimer />
      
      {/* Top Row: Navigation and Actions */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 border-b border-border/50">
        <BackButton
          title="MasterPicker"
          subtitle="_dashboard_header_subtitle"
          returnText="_dashboard_return_to_landing"
        />
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ShareButton />
          </div>
          <SettingsModal
            isOpen={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
          />
        </div>
      </div>

      {/* Bottom Row: Masters Requirements */}
      <div className="flex items-center justify-center px-4 md:px-8 py-2 md:py-3 bg-muted/10 xl:bg-transparent overflow-x-auto">
        <MastersRequirementsBar />
      </div>
    </header>
  );
};

export default GlobalHeader;
