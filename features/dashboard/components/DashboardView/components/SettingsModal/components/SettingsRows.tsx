"use client";

import { FC, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  phone: boolean;
  children: ReactNode;
}

export const SectionHeader: FC<SectionHeaderProps> = ({
  phone,
  children,
}) => (
  <div
    className={cn(
      "border-border",
      phone
        // Landscape drops the indent so headings line up with the sheet title.
        ? "px-5 pb-1.5 pt-5 landscape-phone:px-0 landscape-phone:pt-3"
        : "px-4 py-2.5 bg-muted/40 border-b first:border-t-0 [&:not(:first-child)]:border-t",
    )}
  >
    <p
      className={cn(
        "font-semibold tracking-normal text-muted-foreground",
        phone ? "text-sm" : "text-xs",
      )}
    >
      {children}
    </p>
  </div>
);

const optionRowClasses = (phone: boolean) =>
  cn(
    "cursor-pointer w-full flex items-center gap-3 text-sm",
    "rounded-md hover:bg-accent transition-colors group",
    // Aligns the row with the sheet title instead of indenting past it.
    phone ? "min-h-12 px-0 py-2" : "px-3 py-2",
  );

interface OptionLabelProps {
  label: string;
  description?: string;
}

const OptionLabel: FC<OptionLabelProps> = ({
  label,
  description,
}) => (
  <div className="flex flex-col items-start leading-tight text-left">
    <span className="font-medium text-foreground">{label}</span>
    {description && (
      <span className="text-2xs text-muted-foreground">{description}</span>
    )}
  </div>
);

interface ToggleSettingsOptionProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  phone?: boolean;
}

/** An independent on/off setting. */
export const ToggleSettingsOption: FC<ToggleSettingsOptionProps> = ({
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
        "w-4 h-4 shrink-0 rounded border flex items-center",
        "justify-center transition-all",
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

interface ChoiceSettingsOptionProps {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  phone?: boolean;
}

/** One option of a mutually exclusive set; wrap siblings in a `radiogroup`. */
export const ChoiceSettingsOption: FC<ChoiceSettingsOptionProps> = ({
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
        "size-4 shrink-0 rounded-full border flex items-center",
        "justify-center transition-all",
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
