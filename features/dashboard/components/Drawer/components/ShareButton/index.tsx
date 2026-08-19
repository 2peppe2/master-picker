"use client";

import ShareButtonIcon from "./components/ShareButtonIcon";
import ShareButtonLabel from "./components/ShareButtonLabel";
import { useShareAction } from "./hooks/useShareAction";
import { useShareLoading } from "./hooks/useShareLoading";
import type { ShareButtonStatus } from "./types";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  compact?: boolean;
  className?: string;
}

const statusClassNames: Record<ShareButtonStatus, string> = {
  loading: "text-foreground",
  copied: "text-emerald-600 dark:text-emerald-400",
  idle: "text-foreground",
};

const ShareButton: FC<ShareButtonProps> = ({ compact = false, className }) => {
  const { copied, share } = useShareAction();
  const isLoading = useShareLoading();
  let status: ShareButtonStatus = "idle";
  if (isLoading) status = "loading";
  else if (copied) status = "copied";

  const handleShare = () => {
    if (!isLoading) void share();
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      data-density-exempt
      className={cn(
        cn(
          "group flex h-9 w-auto gap-2 px-4 text-sm font-medium",
          "transition-all duration-200",
        ),
        cn(
          "landscape-phone:relative landscape-phone:h-8",
          "landscape-phone:after:absolute landscape-phone:after:inset-x-0",
          "landscape-phone:after:-inset-y-1.5 landscape-phone:after:content-['']",
        ),
        compact &&
          cn(
            "h-9 gap-2 px-3 max-[379px]:size-11 max-[379px]:gap-0",
            "max-[379px]:px-0",
          ),
        isLoading && "cursor-default",
        copied &&
          !isLoading &&
          cn(
            "border-emerald-600 bg-emerald-600/10",
            "hover:bg-emerald-600/20 dark:border-emerald-400",
            "dark:bg-emerald-400/10 dark:hover:bg-emerald-400/20",
          ),
        className,
      )}
    >
      <ShareButtonIcon status={status} compact={compact} />

      <span
        className={cn(
          "text-sm font-medium",
          compact && "max-[379px]:sr-only",
          statusClassNames[status],
        )}
      >
        <ShareButtonLabel status={status} />
      </span>
    </Button>
  );
};

export default ShareButton;
export { useCopyToClipboard } from "./hooks/useCopyToClipboard";
