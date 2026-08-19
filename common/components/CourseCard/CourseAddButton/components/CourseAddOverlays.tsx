import ConflictResolverModal from "@/common/components/ConflictResolverModal";
import WildcardExpansionDialog from "../../../WildcardExpansionDialog";
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
}

const CourseAddOverlays: FC<CourseAddOverlaysProps> = ({
  conflictData,
  conflictOpen,
  expansionAlertOpen,
  courseCode,
  setConflictOpen,
  setExpansionAlertOpen,
  onConfirmExpansion,
}) => (
  <>
    {conflictOpen && conflictData && (
      <ConflictResolverModal
        open={conflictOpen}
        setOpen={setConflictOpen}
        conflictData={conflictData}
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
