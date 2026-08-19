"use client";

import type { ProcessedMaster } from "../types";
import { useState } from "react";

export const useMasterRequirementsSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMaster, setActiveMaster] = useState<ProcessedMaster | null>(null);

  const setOpen = (nextOpen: boolean) => {
    if (nextOpen) setActiveMaster(null);
    setIsOpen(nextOpen);
  };

  return { activeMaster, isOpen, selectMaster: setActiveMaster, setOpen };
};
