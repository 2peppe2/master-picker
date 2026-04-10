"use client";

import { useCopyToClipboard } from "@/app/dashboard/(components)/Drawer/components/ShareButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Loader2, Share2 } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface InviteFriendsButtonProps {
  groupId: string;
}

const InviteFriendsButton: FC<InviteFriendsButtonProps> = ({ groupId }) => {
  const { copied, copy } = useCopyToClipboard();
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, [groupId]);

  const handleShare = async () => {
    if (!shareUrl || isSharing) {
      return;
    }

    setIsSharing(true);

    const shareData = {
      title: "Master Picker",
      text: "Join my group on Master Picker.",
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        setIsSharing(false);
        return;
      } catch (error) {
        console.log("Native share failed, falling back to copy:", error);
      }
    }

    copy(shareUrl);
    setIsSharing(false);
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className={cn(
        "w-full justify-center",
        copied &&
          "border-emerald-600 bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20 hover:text-emerald-700 dark:border-emerald-400 dark:bg-emerald-400/10 dark:text-emerald-400 dark:hover:bg-emerald-400/20 dark:hover:text-emerald-300",
      )}
      onClick={handleShare}
      disabled={!shareUrl || isSharing}
    >
      {isSharing ? (
        <Loader2 className="size-4 animate-spin" />
      ) : copied ? (
        <Check className="size-4" />
      ) : (
        <Share2 className="size-4" />
      )}
      {isSharing ? "Sharing..." : copied ? "Copied" : "Invite friends"}
    </Button>
  );
};

export default InviteFriendsButton;
