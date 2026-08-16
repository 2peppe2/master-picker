"use client";

import { createContext, FC, PropsWithChildren, useContext } from "react";

const TranslationReadyContext = createContext(false);

interface TranslationReadyProviderProps extends PropsWithChildren {
  ready: boolean;
}

export const TranslationReadyProvider: FC<TranslationReadyProviderProps> = ({
  ready,
  children,
}) => (
  <TranslationReadyContext.Provider value={ready}>
    {children}
  </TranslationReadyContext.Provider>
);

export const useTranslationReady = () => useContext(TranslationReadyContext);
