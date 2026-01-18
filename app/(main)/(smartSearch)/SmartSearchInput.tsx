import React from "react";
import { Search } from "lucide-react";
import { SearchSchema, SearchToken } from "./types";
import { SearchDropdown } from "./SearchDropdown";
import { useSmartSearch } from "./hooks/useSmartSearch";
import { SearchTokenItem } from "./SearchTokenItem";
import { DraftPill } from "./DraftPill";

interface SmartSearchInputProps {
  schema: SearchSchema;
  value: SearchToken[];
  onChange: (tokens: SearchToken[]) => void;
  placeholder?: string;
  className?: string;
}

const SmartSearchInput: React.FC<SmartSearchInputProps> = (props) => {
  const {
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
  } = useSmartSearch(props);

  return (
    <div className={`w-full font-sans ${props.className}`}>
      <div
        className="flex flex-wrap items-center gap-2 border border-gray-700 bg-gray-900 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500 cursor-text min-h-[46px]"
        onClick={() => inputRef.current?.focus()}
      >
        <Search className="w-4 h-4 text-gray-500 ml-1" />

        {props.value.map((token) => (
          <SearchTokenItem
            key={token.id}
            token={token}
            onRemove={removeToken}
            onEdit={editToken}
          />
        ))}

        <DraftPill draft={draft} onEdit={editDraft} />

        <div className="relative flex-1 min-w-[100px]">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none text-gray-100 focus:outline-none placeholder-gray-500 h-8 text-sm"
            placeholder={
              props.value.length === 0 && !draft.category
                ? props.placeholder
                : ""
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            onBlur={handleBlur}
          />

          {isOpen && (
            <SearchDropdown
              options={currentOptions}
              activeIndex={activeIndex}
              draft={draft}
              onSelect={handleSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartSearchInput;
