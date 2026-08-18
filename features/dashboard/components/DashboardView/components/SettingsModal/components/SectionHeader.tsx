import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface SectionHeaderProps {
  phone: boolean;
  children: ReactNode;
}

const SectionHeader: FC<SectionHeaderProps> = ({ phone, children }) => (
  <div
    className={cn(
      "border-border",
      phone
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

export default SectionHeader;
