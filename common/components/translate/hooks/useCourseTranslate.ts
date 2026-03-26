"use client";

import { useTranslation } from "react-i18next";
import { useMemo } from "react";

/**
 * Custom hook that provides the translation function for the 'courses' namespace.
 */
export const useCourseTranslate = () => {
  const { t } = useTranslation("courses");

  return useMemo(() => t, [t]);
};
