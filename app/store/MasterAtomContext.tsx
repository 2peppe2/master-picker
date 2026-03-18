"use client";

import { Master } from "@/app/dashboard/page";
import { createContext, FC } from "react";
import { Atom } from "jotai";

export const MasterAtomContext = createContext<Atom<
  Record<string, Master>
> | null>(null);

interface MasterProviderProps {
  atom: Atom<Record<string, Master>>;
  children: React.ReactNode;
}

const MasterProvider: FC<MasterProviderProps> = ({ atom, children }) => (
  <MasterAtomContext.Provider value={atom}>
    {children}
  </MasterAtomContext.Provider>
);

export default MasterProvider;
