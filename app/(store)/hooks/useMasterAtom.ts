"use client";

import { MasterAtomContext } from "../MasterAtomContext";
import { useAtomValue } from "jotai";
import { useContext } from "react";

export const useMasterAtom = () => {
  const atom = useContext(MasterAtomContext);

  if (!atom) {
    throw new Error("useMasterAtom must be used within MasterProvider");
  }

  return useAtomValue(atom);
};
