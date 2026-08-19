"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { useCopyToClipboard } from "./useCopyToClipboard";

export const useShareAction = () => {
  const translate = useCommonTranslate();
  const { copied, copy } = useCopyToClipboard();

  const share = async () => {
    const url = window.location.href;
    const shareData = {
      title: "Master Picker",
      text: translate("_dashboard_share_text"),
      url,
    };
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        console.log("Native share failed, falling back to copy: ", error);
      }
    }
    copy(url);
  };

  return { copied, share };
};
