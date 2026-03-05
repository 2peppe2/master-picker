"use client";

import { FC, useState, useCallback } from "react";
import copyToClipboard from "copy-to-clipboard";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const useCopyToClipboard = (resetInterval = 2000) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    (text: string) => {
      const success = copyToClipboard(text);

      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), resetInterval);
      } else {
        console.error("Could not copy the link.");
      }

      return success;
    },
    [resetInterval],
  );

  return { copied, copy };
};

const ShareButton: FC = () => {
  const { copied, copy } = useCopyToClipboard();

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: "Master Picker",
      text: "Check out my Master Picker schedule!",
      url: url,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        console.error("Native share failed, falling back to copy: ", err);
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
        copied &&
          "border-emerald-600 bg-emerald-600/10 hover:bg-emerald-600/20 dark:border-emerald-400 dark:bg-emerald-400/10 dark:hover:bg-emerald-400/20",
      )}
    >
      {copied ? (
        <Check className="-mr-1 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <Share2 className="text-foreground group-hover:text-accent-foreground" />
      )}

      <span
        className={cn(
          "text-sm font-medium",
          copied ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
        )}
      >
        {copied ? "Copied" : "Share"}
      </span>
    </Button>
  );
};

export default ShareButton;
