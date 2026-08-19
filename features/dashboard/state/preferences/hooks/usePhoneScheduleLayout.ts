"use client";

import {
  phoneScheduleLayoutAtom,
  type PhoneScheduleLayout,
} from "../atoms";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";

/**
 * Reads the phone block layout preference. The stored value is client-only, so
 * the default is reported until mount to keep the server markup and the first
 * client render in agreement.
 */
export const usePhoneScheduleLayout = () => {
  const [stored, setLayout] = useAtom(phoneScheduleLayoutAtom);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const layout: PhoneScheduleLayout = mounted ? stored : "grid";

  return { layout, setLayout };
};
