"use client";

import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";
import { scheduleAtoms } from "@/app/dashboard/(store)/schedule/atoms";
import Translate from "@/common/components/translate/Translate";
import { FC, useState, useCallback, useEffect } from "react";
import { Loader2, Share2, Check } from "lucide-react";
import copyToClipboard from "copy-to-clipboard";
import { Button } from "@/components/ui/button";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";

export const useCopyToClipboard = (resetInterval = 2000) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    (text: string) => {
      const success = copyToClipboard(text);

      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), resetInterval);
      }

      return success;
    },
    [resetInterval],
  );

  return { copied, copy };
};

const ShareButton: FC = () => {
  const translate = useCommonTranslate();
  const { copied, copy } = useCopyToClipboard();
  const shareButtonLoadingUntil = useAtomValue(
    scheduleAtoms.shareButtonLoadingUntilAtom,
  );
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
      className={cn(
        "flex gap-2 w-[100px] cursor-pointer group h-9 px-4 text-sm font-medium transition-all duration-200",
        "border-input text-foreground hover:bg-accent hover:text-accent-foreground",
        isAddCourseLoading && "cursor-default",
        copied &&
          !isAddCourseLoading &&
          "border-emerald-600 bg-emerald-600/10 hover:bg-emerald-600/20 dark:border-emerald-400 dark:bg-emerald-400/10 dark:hover:bg-emerald-400/20",
      )}
    >
      {isAddCourseLoading ? (
        <Loader2 className="-mr-1 animate-spin text-foreground" />
      ) : copied ? (
        <Check className="-mr-1 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <Share2 className="text-foreground group-hover:text-accent-foreground" />
      )}

      <span
        className={cn(
          "text-sm font-medium",
          isAddCourseLoading
            ? "text-foreground"
            : copied
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-foreground",
        )}
      >
        {isAddCourseLoading ? (
          <Translate text="loading" />
        ) : copied ? (
          <Translate text="_dashboard_share_copied" />
        ) : (
          <Translate text="_dashboard_share" />
        )}
      </span>
    </Button>
  );
};

export default ShareButton;
