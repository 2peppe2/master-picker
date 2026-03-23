"use client";

import { useTranslation } from "react-i18next";
import { useMemo } from "react";

/**
 * Custom hook that provides the translation function for the 'common' namespace.
 */
export const useCommonTranslate = () => {
  const { t } = useTranslation("common");

  return useMemo(() => t, [t]);
};
