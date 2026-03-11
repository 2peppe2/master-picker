import { ReactNode, ComponentType } from "react";

export interface MultiSelectOption {
  label: ReactNode;
  dropdownLabel?: ReactNode;
  searchKey: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
}

export interface MultiSelectGroup {
  heading: string;
  options: MultiSelectOption[];
}

export interface BadgeData {
  label: ReactNode;
  value: string;
  isGroup: boolean;
  prefix?: string;
}
