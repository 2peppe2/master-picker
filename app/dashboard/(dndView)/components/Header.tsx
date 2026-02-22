import MastersRequirementsBar from "../../(mastersRequirementsBar)";
import SettingsModal from "./SettingsModal";
import { FC, useState } from "react";

const Header: FC = ({}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="bg-card sticky top-0 z-40 w-full border-b border-border backdrop-blur-md bg-opacity-80">
      <div className="px-8 h-20 flex items-center justify-between gap-6">
        <div className="flex flex-1 min-w-0 border-r h-12 px-4 items-center">
          <MastersRequirementsBar />
        </div>
        <SettingsModal
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      </div>
    </header>
  );
};

export default Header;
