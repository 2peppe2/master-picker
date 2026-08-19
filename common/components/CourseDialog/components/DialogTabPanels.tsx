import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface DialogTabPanelsProps {
  children: ReactNode;
  wrapped: boolean;
}

const DialogTabPanels: FC<DialogTabPanelsProps> = ({ children, wrapped }) => {
  if (!wrapped) {
    return children;
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 touch-pan-y flex-col",
        "overflow-hidden",
      )}
    >
      {children}
    </div>
  );
};

export default DialogTabPanels;
