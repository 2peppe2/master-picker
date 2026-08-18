import copyToClipboard from "copy-to-clipboard";
import { useCallback, useState } from "react";

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
