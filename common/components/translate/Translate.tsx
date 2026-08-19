"use client";

import { Trans, useTranslation } from "react-i18next";
import { FC, memo } from "react";
import { useTranslationReady } from "./TranslationReadyContext";
import TranslationBold from "./TranslationBold";
import "@/lib/i18n";
import { useIsMounted } from "@/common/hooks/useIsMounted";

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
    const translationReady = useTranslationReady();
    const mounted = useIsMounted();

    if (!mounted && !translationReady) {
      return <>&nbsp;</>;
    }

    if (isBold || components) {
      return (
        <Trans
          i18nKey={text}
          values={args}
          t={translate}
          components={
            isBold ? { b: <TranslationBold />, ...components } : components
          }
        />
      );
    }

    return <>{translate(text, args)}</>;
  },
);

Translate.displayName = "Translate";

export default Translate;
