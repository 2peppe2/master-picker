import MastersRequirementsBar from "../../(mastersRequirementsBar)/MastersRequirementsBar";
import SettingsModal from "./SettingsModal";
import { FC, useState } from "react";

const Header: FC = ({}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-card sticky top-0 z-40 w-full border-b border-border backdrop-blur-md bg-opacity-80">
      <div className="px-8 h-20 flex items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <MastersRequirementsBar />
        </div>
        <SettingsModal isOpen={isOpen} onOpenChange={setIsOpen} />
      </div>
    </header>
  );
};

export default Header;
