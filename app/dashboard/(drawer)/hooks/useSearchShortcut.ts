import { RefObject, useCallback, useEffect } from "react";

const isSearchShortcut = (event: KeyboardEvent) =>
  (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

interface UseSearchShortcutArgs {
  inputRef: RefObject<HTMLInputElement | null>;
}

export const useSearchShortcut = ({ inputRef }: UseSearchShortcutArgs) => {
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isSearchShortcut(event)) return;
      event.preventDefault();

      if (!inputRef.current) return;

      inputRef.current.focus();
      inputRef.current.select();
    },
    [inputRef]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);
};
