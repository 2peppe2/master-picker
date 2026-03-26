"use client";

import { Trans, useTranslation } from "react-i18next";
import { FC, memo, useEffect, useState } from "react";
import "@/lib/i18n";

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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    const componentsToUse = isBold
      ? { b: <strong />, ...components }
      : components;

    if (!mounted) {
      return <>&nbsp;</>;
    }

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
