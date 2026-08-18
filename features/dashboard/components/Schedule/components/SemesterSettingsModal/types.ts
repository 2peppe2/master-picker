export interface SemesterSettingsModalProps {
  semester: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/** What each presentation needs; the semester is resolved by the picker. */
export interface SemesterSettingsViewProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBlock: () => void;
}
