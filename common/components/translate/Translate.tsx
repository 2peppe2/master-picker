"use client";

import { Trans, useTranslation } from "react-i18next";
import { FC, memo } from "react";

interface TranslateProps {
  text: string;
  args?: Record<string, unknown>;
  isBold?: boolean;
  namespace?: string;
  components?: Record<string, React.ReactElement> | React.ReactElement[];
}

const Translate: FC<TranslateProps> = memo(
  ({ text, args, isBold, namespace = "common", components }) => {
    const { t: translate } = useTranslation(namespace);

    const componentsToUse = isBold
      ? { b: <strong />, ...components }
      : components;

    if (componentsToUse) {
      return (
        <Trans
          i18nKey={text}
          values={args}
          t={translate}
          components={componentsToUse}
        />
      );
    }

    return <>{translate(text, args)}</>;
  },
);

Translate.displayName = "Translate";

export default Translate;
