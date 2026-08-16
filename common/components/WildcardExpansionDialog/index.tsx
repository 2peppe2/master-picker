"use client";

import Translate from "@/common/components/translate/Translate";
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

const WildcardExpansionDialog: FC<WildcardExpansionDialogProps> = ({
  open,
  setOpen,
  courseCode,
  onConfirm,
}) => (
  <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          <Translate text="add_block_to_semester" />
        </AlertDialogTitle>
        <AlertDialogDescription>
          <Translate text="no_empty_blocks_available" />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="cursor-pointer">
          <Translate text="cancel" />
        </AlertDialogCancel>
        <AlertDialogAction
          className="cursor-pointer"
          onClick={() => {
            onConfirm();
            setOpen(false);
          }}
        >
          <Translate text="_add_course" args={{ courseCode }} />
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default WildcardExpansionDialog;