"use client";

import { useTranslation } from "react-i18next";
import { FC, memo } from "react";

interface TranslateTextProps {
  text: string;
}

const TranslateText: FC<TranslateTextProps> = memo(({ text }) => {
  const { t: translate } = useTranslation("common");
  return <>{translate(text)}</>;
});

TranslateText.displayName = "TranslateText";

export default TranslateText;
