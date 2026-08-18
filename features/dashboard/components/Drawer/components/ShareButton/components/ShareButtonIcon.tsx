import type { ShareButtonStatus } from "../types";
import { Check, Loader2, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FC } from "react";

interface ShareButtonIconProps {
  status: ShareButtonStatus;
  compact: boolean;
}

const ShareButtonIcon: FC<ShareButtonIconProps> = ({ status, compact }) => {
  const compactClassName = compact && "max-[379px]:mr-0";

  if (status === "loading") {
    return (
      <Loader2
        className={cn(
          "-mr-1 animate-spin text-foreground",
          compactClassName,
        )}
      />
    );
  }

  if (status === "copied") {
    return (
      <Check
        className={cn(
          "-mr-1 text-emerald-600 dark:text-emerald-400",
          compactClassName,
        )}
      />
    );
  }

  return (
    <Share2
      className={cn(
        "-mr-1 text-foreground group-hover:text-accent-foreground",
        compactClassName,
      )}
    />
  );
};

export default ShareButtonIcon;
