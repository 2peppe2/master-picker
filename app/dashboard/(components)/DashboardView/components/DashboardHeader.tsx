"use client";

import MastersRequirementsBar from "../../MastersRequirementsBar";
import ShareButton from "../../Drawer/components/ShareButton";
import BackButton from "@/common/components/BackButton";
import SettingsModal from "./SettingsModal";
import Disclaimer from "./Disclaimer";
import { FC, useState } from "react";

const DashboardHeader: FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="bg-card sticky top-0 z-40 w-full border-b border-border backdrop-blur-md bg-opacity-80 flex flex-col shrink-0 xl:hidden">
      <div className="xl:hidden">
        <Disclaimer />
      </div>

      <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 border-b border-border/50">
        <BackButton
          title="MasterPicker"
          subtitle="_dashboard_header_subtitle"
          returnText="_dashboard_return_to_landing"
        />
        <div className="flex items-center gap-2 xl:hidden">
          <ShareButton />
          <SettingsModal
            isOpen={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
          />
        </div>
      </div>

      <div className="flex items-center px-4 md:px-8 py-2 md:py-3 bg-muted/10 xl:hidden min-w-0">
        <MastersRequirementsBar />
      </div>
    </header>
  );
};

export default DashboardHeader;
