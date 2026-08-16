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
    <header className="sticky top-0 z-40 flex w-full shrink-0 flex-col border-b border-border bg-card/90 backdrop-blur-md lg:hidden">
      <div>
        <Disclaimer />
      </div>

      <div className="flex min-h-16 items-center justify-between border-b border-border/50 px-4 py-3 sm:px-6">
        <BackButton
          title="MasterPicker"
          subtitle="_dashboard_header_subtitle"
          returnText="_dashboard_return_to_landing"
        />
        <div className="flex items-center gap-1 sm:gap-2">
          <ShareButton compact />
          <SettingsModal
            isOpen={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
          />
        </div>
      </div>

      <div className="flex min-w-0 items-center bg-muted/10 px-4 py-2 sm:px-6">
        <MastersRequirementsBar />
      </div>
    </header>
  );
};

export default DashboardHeader;
