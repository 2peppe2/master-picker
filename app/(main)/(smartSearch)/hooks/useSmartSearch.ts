import { useState, useMemo, useRef, useEffect } from "react";
import { SearchOption, SearchSchema, SearchToken, DraftState } from "./types";

interface UseSmartSearchProps {
  schema: SearchSchema;
  value: SearchToken[];
  onChange: (tokens: SearchToken[]) => void;
}

export const useSmartSearch = ({
  schema,
  value,
  onChange,
}: UseSmartSearchProps) => {
  const [draft, setDraft] = useState<DraftState>({});
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- 1. Calculate Available Options ---
  const currentOptions = useMemo(() => {
    let options: SearchOption[] = [];

    // Schema Traversal
    if (!draft.category) {
      options = schema["root"] || [];
    } else if (!draft.operator) {
      options = draft.category.next ? schema[draft.category.next] || [] : [];
    } else {
      options = schema[`${draft.category.id}_values`] || [];
    }

    // Filter by Input
    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(inputValue.toLowerCase()),
    );

    // Add Free Search capability
    if (!draft.category && inputValue.trim().length > 0) {
      filtered.push({
        id: "free_search",
        label: `Search for "${inputValue}"`,
        value: inputValue,
        type: "search_free",
      });
    }

    return filtered;
  }, [draft, schema, inputValue]);

  useEffect(() => setActiveIndex(0), [currentOptions.length]);

  // --- 2. Actions ---

  const commitToken = (token: SearchToken) => {
    onChange([...value, token]);
    setDraft({});
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleSelect = (option: SearchOption) => {
    if (option.type === "search_free") {
      commitToken({
        type: "text",
        id: Date.now().toString(),
        label: option.value,
        value: option.value,
      });
      return;
    }

    const newDraft = { ...draft };
    if (option.type === "category") newDraft.category = option;
    else if (option.type === "operator") newDraft.operator = option;
    else if (option.type === "value") {
      if (draft.category && draft.operator) {
        commitToken({
          type: "filter",
          id: Date.now().toString(),
          label: `${draft.category.label} ${draft.operator.label} ${option.label}`,
          category: draft.category,
          operator: draft.operator,
          value: option,
        });
        return;
      }
    }

    setDraft(newDraft);
    setInputValue("");
    // Important: Keep focus so the blur event doesn't fire
    inputRef.current?.focus();
  };

  const removeToken = (id: string) => {
    onChange(value.filter((t) => t.id !== id));
    inputRef.current?.focus();
  };

  // --- 3. Blur & Rewind Logic ---

  // NEW: Handles clicking outside
  const handleBlur = () => {
    // We use a small timeout to allow click events on UI elements to register first
    // if strictly necessary, but relying on onMouseDown+preventDefault in the dropdown
    // allows us to clear immediately here.
    setIsOpen(false);

    // "Throw it away" logic:
    // If we have a draft in progress, or text typed, clear it all.
    setDraft({});
    setInputValue("");
  };

  const editDraft = (part: "category" | "operator") => {
    if (part === "category" && draft.category) {
      setInputValue(draft.category.label);
      setDraft({});
    } else if (part === "operator" && draft.operator) {
      setInputValue(draft.operator.label);
      setDraft((prev) => ({ ...prev, operator: undefined }));
    }
    inputRef.current?.focus();
  };

  const editToken = (
    token: SearchToken,
    part: "category" | "operator" | "value" | "full",
  ) => {
    onChange(value.filter((t) => t.id !== token.id));

    if (token.type === "text") {
      setInputValue(token.value);
      setDraft({});
    } else {
      if (part === "category") {
        setDraft({});
        setInputValue(token.category.label);
      } else if (part === "operator") {
        setDraft({ category: token.category });
        setInputValue(token.operator.label);
      } else {
        setDraft({ category: token.category, operator: token.operator });
        setInputValue(token.value.label);
      }
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % currentOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (prev) => (prev - 1 + currentOptions.length) % currentOptions.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentOptions[activeIndex])
        handleSelect(currentOptions[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      // Optional: Clear draft on Escape too?
      // handleBlur();
    } else if (e.key === "Backspace" && inputValue === "") {
      e.preventDefault();
      if (draft.operator) editDraft("operator");
      else if (draft.category) editDraft("category");
      else if (value.length > 0) {
        editToken(
          value[value.length - 1],
          value[value.length - 1].type === "filter" ? "value" : "full",
        );
      }
    }
  };

  return {
    inputRef,
    inputValue,
    setInputValue,
    draft,
    isOpen,
    setIsOpen,
    activeIndex,
    currentOptions,
    handleSelect,
    handleKeyDown,
    handleBlur,
    removeToken,
    editToken,
    editDraft,
  };
};
