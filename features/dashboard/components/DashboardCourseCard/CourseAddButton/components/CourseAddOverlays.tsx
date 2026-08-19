import ConflictResolverModal from "@/common/components/ConflictResolverModal";
import WildcardExpansionDialog from "@/common/components/WildcardExpansionDialog";
import type { ConflictData } from "@/common/components/ConflictResolverModal";
import { FC } from "react";

interface CourseAddOverlaysProps {
  conflictData: ConflictData | null;
  conflictOpen: boolean;
  expansionAlertOpen: boolean;
  courseCode: string;
  setConflictOpen: (open: boolean) => void;
  setExpansionAlertOpen: (open: boolean) => void;
  onConfirmExpansion: () => void;
  onResolveConflict: (type: "replace" | "extra") => void;
}

const CourseAddOverlays: FC<CourseAddOverlaysProps> = ({
  conflictData,
  conflictOpen,
  expansionAlertOpen,
  courseCode,
  setConflictOpen,
  setExpansionAlertOpen,
  onConfirmExpansion,
  onResolveConflict,
}) => (
  <>
    {conflictOpen && conflictData && (
      <ConflictResolverModal
        open={conflictOpen}
        setOpen={setConflictOpen}
        conflictData={conflictData}
        onResolve={onResolveConflict}
      />
    )}
    <WildcardExpansionDialog
      open={expansionAlertOpen}
      setOpen={setExpansionAlertOpen}
      courseCode={courseCode}
      onConfirm={onConfirmExpansion}
    />
  </>
);

export default CourseAddOverlays;
