import { useSearchShortcut } from "../hooks/useSearchShortcut";
import { useFilterStore } from "@/app/atoms/filter/filterStore";
import { usePlatform } from "../hooks/usePlatform";
import { Button } from "@/components/ui/button";
import FilterDropdown from "./FilterDropdown";
import { Input } from "@/components/ui/input";
import { ListFilter } from "lucide-react";
import { useAtomValue } from "jotai";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRef } from "react";

const SearchInput = () => (
  <div className="flex gap-4 w-full">
    <SearchField />
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="text-muted-foreground">
          <ListFilter className="size-fit text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <FilterDropdown />
      </PopoverContent>
    </Popover>
  </div>
);

export default SearchInput;

const SearchField = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  useSearchShortcut({ inputRef });

  const {
    atoms: { searchAtom },
    mutators: { filterByTerm },
  } = useFilterStore();
  const { isMac } = usePlatform();

  const search = useAtomValue(searchAtom);

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        value={search}
        type="search"
        placeholder="Search..."
        className="peer pr-11 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
        onChange={(e) => filterByTerm(e.target.value)}
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50">
        <kbd className="text-muted-foreground bg-accent inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </div>
    </div>
  );
};
