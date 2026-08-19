export interface SemesterSettingsModalProps {
  semester: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface SemesterSettingsViewProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBlock: () => void;
}
