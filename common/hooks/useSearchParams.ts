"use client";

import { useCallback } from "react";
import {
  useRouter,
  usePathname,
  useSearchParams as useNextSearchParams,
} from "next/navigation";

export const useSearchParams = () => {
  const searchParams = useNextSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setSearchParam = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const setSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      let hasChanged = false;

      for (const [name, value] of Object.entries(updates)) {
        if (params.get(name) !== value) {
          hasChanged = true;
          if (value === null) params.delete(name);
          else params.set(name, value);
        }
      }

      if (hasChanged) {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    },
    [searchParams, pathname, router],
  );

  return { setSearchParam, setSearchParams, searchParams };
};
