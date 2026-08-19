import OptionLabel from "./OptionLabel";
import { optionRowClasses } from "./settingsRowStyles";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface ToggleSettingsOptionProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  phone?: boolean;
}

const ToggleSettingsOption: FC<ToggleSettingsOptionProps> = ({
  label,
  description,
  value,
  onChange,
  phone = false,
}) => (
  <button
    type="button"
    aria-pressed={value}
    onClick={() => onChange(!value)}
    className={optionRowClasses(phone)}
  >
    <div
      className={cn(
        "w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-all",
        value
          ? "bg-primary border-primary"
          : "border-input group-hover:border-muted-foreground",
      )}
    >
      {value && <Check className="w-3 h-3 text-primary-foreground stroke-[3]" />}
    </div>
    <OptionLabel label={label} description={description} />
  </button>
);

export default ToggleSettingsOption;
