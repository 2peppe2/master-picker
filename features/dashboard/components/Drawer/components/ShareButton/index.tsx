"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { shareButtonLoadingUntilAtom } from "@/features/dashboard/state/schedule/atoms";
import ShareButtonIcon from "./components/ShareButtonIcon";
import ShareButtonLabel from "./components/ShareButtonLabel";
import { useCopyToClipboard } from "./hooks/useCopyToClipboard";
import type { ShareButtonStatus } from "./types";
import { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAtomValue } from "jotai";
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
  const translate = useCommonTranslate();
  const { copied, copy } = useCopyToClipboard();
  const shareButtonLoadingUntil = useAtomValue(shareButtonLoadingUntilAtom);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (shareButtonLoadingUntil <= Date.now()) {
      setNow(Date.now());
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNow(Date.now());
    }, shareButtonLoadingUntil - Date.now());

    return () => window.clearTimeout(timeoutId);
  }, [shareButtonLoadingUntil]);

  const isAddCourseLoading = shareButtonLoadingUntil > now;
  let status: ShareButtonStatus = "idle";
  if (isAddCourseLoading) status = "loading";
  else if (copied) status = "copied";

  const handleShare = async () => {
    if (isAddCourseLoading) return;

    const url = window.location.href;
    const shareData = {
      title: "Master Picker",
      text: translate("_dashboard_share_text"),
      url: url,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log("Native share failed, falling back to copy: ", err);
      }
    }

    copy(url);
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
        isAddCourseLoading && "cursor-default",
        copied &&
          !isAddCourseLoading &&
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
