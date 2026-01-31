import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FC } from "react";

interface WildcardExpansionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  courseCode: string;
  onConfirm: () => void;
}

export const WildcardExpansionDialog: FC<WildcardExpansionDialogProps> = ({
  open,
  setOpen,
  courseCode,
  onConfirm,
}) => (
  <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Add block to semester</AlertDialogTitle>
        <AlertDialogDescription>
          There are no empty blocks available in this semester. Adding this
          course will create a new extra block.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            onConfirm();
            setOpen(false);
          }}
        >
          Add {courseCode}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
