"use client";

import { Trans, useTranslation } from "react-i18next";
import { FC, memo } from "react";

interface TranslateProps {
  text: string;
  args?: Record<string, unknown>;
  isBold?: boolean;
}

const Translate: FC<TranslateProps> = memo(({ text, args, isBold }) => {
  const { t: translate } = useTranslation("common");

  if (isBold) {
    return (
      <Trans
        i18nKey={text}
        values={args}
        components={{ b: <strong /> }}
        t={translate}
      />
    );
  }

  return <>{translate(text, args)}</>;
});

Translate.displayName = "Translate";

export default Translate;
