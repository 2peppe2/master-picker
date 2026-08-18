import OptionLabel from "./OptionLabel";
import { optionRowClasses } from "./settingsRowStyles";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface ChoiceSettingsOptionProps {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  phone?: boolean;
}

const ChoiceSettingsOption: FC<ChoiceSettingsOptionProps> = ({
  label,
  description,
  selected,
  onSelect,
  phone = false,
}) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onSelect}
    className={optionRowClasses(phone)}
  >
    <div
      className={cn(
        "size-4 shrink-0 rounded-full border flex items-center justify-center transition-all",
        selected
          ? "border-primary"
          : "border-input group-hover:border-muted-foreground",
      )}
    >
      {selected && <div className="size-2 rounded-full bg-primary" />}
    </div>
    <OptionLabel label={label} description={description} />
  </button>
);

export default ChoiceSettingsOption;
