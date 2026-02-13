import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { Check, ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FC, useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAtom } from "jotai";

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onOpenChange }) => {
  const [preferences, setPreferences] = useAtom(userPreferencesAtom);
  const { showBachelorYears } = preferences;

  const handleToggleBachelorYears = useCallback(
    (state: boolean) => {
      setPreferences((preferences) => ({
        ...preferences,
        showBachelorYears: state,
      }));
    },
    [setPreferences],
  );

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="cursor-pointer ml-auto px-4 h-10 gap-2 hover:bg-accent hover:text-accent-foreground"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Settings</span>
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="p-0 overflow-hidden w-64">
        <div className="px-4 py-3 bg-muted/40 border-b border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Layout settings
          </p>
        </div>

        <div className="p-1">
          <ToggleSettingsOption
            value={showBachelorYears}
            onChange={handleToggleBachelorYears}
            label="Show bachelor years"
            description="Semesters 1 - 6"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SettingsModal;

interface ToggleSettingsOptionProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const ToggleSettingsOption: FC<ToggleSettingsOptionProps> = ({
  label,
  description,
  value,
  onChange,
}) => (
  <button
    onClick={() => onChange(!value)}
    className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors group"
  >
    <div
      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
        value
          ? "bg-primary border-primary"
          : "border-input group-hover:border-muted-foreground"
      }`}
    >
      {value && (
        <Check className="w-3 h-3 text-primary-foreground stroke-[3]" />
      )}
    </div>

    <div className="flex flex-col items-start leading-tight">
      <span className="font-medium text-foreground">{label}</span>
      <span className="text-[11px] text-muted-foreground">{description}</span>
    </div>
  </button>
);
