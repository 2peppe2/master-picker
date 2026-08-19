"use client";

import {
  type LandingQueryState,
  readLandingQuery,
  updateLandingQuery,
} from "@/common/navigation/queryState";
import { useCallback, useEffect, useState } from "react";

export const useLandingSelection = (initialSelection: LandingQueryState) => {
  const [selection, setSelection] = useState(initialSelection);

  const updateSelection = useCallback((next: LandingQueryState) => {
    setSelection(next);
    const params = updateLandingQuery(
      new URLSearchParams(window.location.search),
      next,
    );
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  }, []);

  useEffect(() => {
    const syncSelectionFromUrl = () => {
      setSelection(readLandingQuery(new URLSearchParams(window.location.search)));
    };
    window.addEventListener("popstate", syncSelectionFromUrl);
    return () => window.removeEventListener("popstate", syncSelectionFromUrl);
  }, []);

  return { selection, updateSelection };
};
