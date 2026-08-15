import { ReactNode, ComponentType } from "react";

export interface MultiSelectOption {
  label: ReactNode;
  dropdownLabel?: ReactNode;
  searchKey: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
}

/** A step inside a category, e.g. "Har" and "Utan". */
export interface MultiSelectSection {
  key: string;
  label: string;
  /** Shown as the header once drilled in, e.g. "Har examinationer". */
  headerLabel: string;
  icon?: ComponentType<{ className?: string }>;
  options: MultiSelectOption[];
}

/**
 * One category in the dropdown. The list shows a row per group and drills into
 * its sections, so the top level stays a short menu.
 */
export interface MultiSelectGroup {
  heading: string;
  icon?: ComponentType<{ className?: string }>;
  /** Every option of the category, both polarities -- used by search. */
  options: MultiSelectOption[];
  sections?: MultiSelectSection[];
}

export interface BadgeData {
  label: ReactNode;
  value: string;
  isGroup: boolean;
  prefix?: string;
}
