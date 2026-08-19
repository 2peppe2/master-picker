import ShareButton from "../../Drawer/components/ShareButton";
import SettingsModal from "./SettingsModal";
import { FC } from "react";

interface DashboardHeaderActionsProps {
  isSettingsOpen: boolean;
  onSettingsOpenChange: (open: boolean) => void;
}

const DashboardHeaderActions: FC<DashboardHeaderActionsProps> = ({
  isSettingsOpen,
  onSettingsOpenChange,
}) => (
  <div className="flex shrink-0 items-center gap-1 sm:gap-2">
    <ShareButton compact />
    <SettingsModal
      isOpen={isSettingsOpen}
      onOpenChange={onSettingsOpenChange}
    />
  </div>
);

export default DashboardHeaderActions;
