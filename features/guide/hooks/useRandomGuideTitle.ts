"use client";

import { useEffect, useState } from "react";

export const useRandomGuideTitle = (titleKeys: readonly string[]) => {
  const [titleKey, setTitleKey] = useState(titleKeys[0]);

  useEffect(() => {
    setTitleKey(titleKeys[Math.floor(Math.random() * titleKeys.length)]);
  }, [titleKeys]);

  return titleKey;
};
