"use client";

import { CommandGroup, CommandItem } from "@/components/ui/command";
import { Search } from "lucide-react";
import { FC } from "react";

interface SearchFallbackItemProps {
  searchValue: string;
  exactMatch: boolean;
  onSelect: () => void;
}

const SearchFallbackItem: FC<SearchFallbackItemProps> = ({
  searchValue,
  exactMatch,
  onSelect,
}) => {
  if (!searchValue.trim() || exactMatch) {
    return null;
  }

  return (
    <CommandGroup heading="Search">
      <CommandItem
        value={`search:${searchValue}`}
        onSelect={onSelect}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="cursor-pointer group flex items-center py-2.5 px-3 w-full"
      >
        <div className="mr-3 flex h-4 w-4 items-center justify-center flex-shrink-0">
          <Search className="h-4 w-4 opacity-50" />
        </div>
        <div className="truncate flex items-center gap-2 flex-1 min-w-0 text-sm">
          Search for <span className="font-semibold">{searchValue}</span>
        </div>
      </CommandItem>
    </CommandGroup>
  );
};

export default SearchFallbackItem;
