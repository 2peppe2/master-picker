"use client";

import { useTranslation } from "react-i18next";

/**
 * Hook to manage language state and synchronize it with the URL.
 */
export const useLanguage = () => {
  const { i18n } = useTranslation();

  return i18n.language;
};
