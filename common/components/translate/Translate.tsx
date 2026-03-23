"use client";

import { Trans, useTranslation } from "react-i18next";
import { FC, memo } from "react";

interface TranslateProps {
  text: string;
  args?: Record<string, unknown>;
  isBold?: boolean;
  namespace?: string;
}

const Translate: FC<TranslateProps> = memo(
  ({ text, args, isBold, namespace = "common" }) => {
    const { t: translate } = useTranslation(namespace);

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
  },
);



Translate.displayName = "Translate";

export default Translate;
