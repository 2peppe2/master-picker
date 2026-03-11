"use client";

import { cva } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { XCircle } from "lucide-react";
import { BadgeData } from "../types";
import { cn } from "@/lib/utils";
import { FC } from "react";

const multiSelectVariants = cva(
  "m-0.5 transition-all duration-200 font-medium select-none min-h-7 h-auto py-1 flex items-center px-2.5",
  {
    variants: {
      variant: {
        default:
          "bg-background border-border shadow-sm text-foreground hover:bg-muted/50 dark:bg-card dark:hover:bg-card/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface MultiSelectBadgeProps {
  badge: BadgeData;
  onRemove: () => void;
}

const MultiSelectBadge: FC<MultiSelectBadgeProps> = ({ badge, onRemove }) => (
  <Badge
    className={cn(
      multiSelectVariants(),
      "rounded-md border-foreground/5 transition-all flex items-center pr-1 max-w-full whitespace-normal hover:bg-muted/80 hover:text-foreground cursor-default dark:has-[.clear-action:hover]:bg-destructive/20 has-[.clear-action:hover]:bg-destructive/10 has-[.clear-action:hover]:text-destructive has-[.clear-action:hover]:border-destructive/30",
    )}
  >
    <div className="flex-1 min-w-0 flex items-center">{badge.label}</div>
    <div
      role="button"
      tabIndex={0}
      className="group ml-1 p-0.5 rounded-full hover:bg-destructive/20 transition-colors clear-action cursor-pointer flex-shrink-0"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove();
      }}
    >
      <XCircle className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
    </div>
  </Badge>
);

export default MultiSelectBadge;
