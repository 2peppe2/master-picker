import Translate from "@/common/components/translate/Translate";
import type { ShareButtonStatus } from "../types";
import type { FC } from "react";

interface ShareButtonLabelProps {
  status: ShareButtonStatus;
}

const ShareButtonLabel: FC<ShareButtonLabelProps> = ({ status }) => {
  if (status === "loading") return <Translate text="loading" />;
  if (status === "copied") {
    return <Translate text="dashboard_share_copied" />;
  }
  return <Translate text="dashboard_share" />;
};

export default ShareButtonLabel;
