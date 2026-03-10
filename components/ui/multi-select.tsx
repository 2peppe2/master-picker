"use client";

import { XCircle, ChevronDown, CircleCheck, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import React, { forwardRef, useEffect, useMemo, useState, useRef } from "react";

const multiSelectVariants = cva(
  "m-0.5 transition-colors duration-200 font-medium select-none h-7 flex items-center px-2.5",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface MultiSelectOption {
  label: React.ReactNode;
  dropdownLabel?: React.ReactNode;
  searchKey: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface MultiSelectGroup {
  heading: string;
  options: MultiSelectOption[];
}

export interface BadgeData {
  label: React.ReactNode;
  value: string;
  isGroup: boolean;
  prefix?: string;
}

export interface MultiSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  options: MultiSelectOption[] | MultiSelectGroup[];
  onValueChange: (value: string[]) => void;
  onCreateOption?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  defaultValue?: string[];
  placeholder?: string;
  categoryLabels: Record<string, string>;
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      onCreateOption,
      onSearchChange,
      categoryLabels,
      defaultValue = [],
      placeholder = "Search...",
      className,
      ...props
    },
    ref,
  ) => {
    const [selected, setSelected] = useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setIsPopoverOpen((open) => !open);
          if (!isPopoverOpen) {
            inputRef.current?.focus();
          }
        }
      };
      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
    }, [isPopoverOpen]);

    useEffect(() => {
      setSelected(defaultValue);
    }, [defaultValue]);

    const allOptionsFlat = useMemo(() => {
      if (options.length === 0) return [];
      return "heading" in options[0]
        ? (options as MultiSelectGroup[]).flatMap((g) => g.options)
        : (options as MultiSelectOption[]);
    }, [options]);

    const exactMatch = useMemo(() => {
      const searchLower = searchValue.trim().toLowerCase();
      if (!searchLower) return false;
      return allOptionsFlat.some(
        (o) =>
          o.searchKey.toLowerCase() === searchLower ||
          o.label?.toString().toLowerCase() === searchLower ||
          o.value.toLowerCase() === searchLower,
      );
    }, [allOptionsFlat, searchValue]);

    const hasMatchingOptions = useMemo(() => {
      const hasMatches = allOptionsFlat.some((o) =>
        o.searchKey.toLowerCase().includes(searchValue.toLowerCase()),
      );
      const hasSearchFallback = searchValue.trim() && !exactMatch;
      return hasMatches || hasSearchFallback;
    }, [allOptionsFlat, searchValue, exactMatch]);

    const toggleOption = (value: string) => {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      setSelected(next);
      onValueChange(next);

      setSearchValue("");
      onSearchChange?.("");

      inputRef.current?.focus();
    };

    const removeGroup = (prefix: string) => {
      const next = selected.filter((v) => !v.startsWith(`${prefix}:`));

      if (prefix === "search") {
        setSearchValue("");
        onSearchChange?.("");
      }

      setSelected(next);
      onValueChange(next);
    };

    const clearAll = () => {
      setSearchValue("");
      onSearchChange?.("");
      onValueChange([]);
    };

    const commitSearchTerm = (term: string) => {
      if (onCreateOption) {
        onCreateOption(term);
      } else {
        const searchVal = `search:${term}`;
        if (!selected.includes(searchVal)) {
          const next = [...selected, searchVal];
          setSelected(next);
          onValueChange(next);
        }
      }
      setSearchValue("");
      onSearchChange?.("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // We removed the manual Enter override here so cmdk can handle it natively.
      
      if (e.key === "Backspace" && searchValue === "" && selected.length > 0) {
        const lastValue = selected[selected.length - 1];
        if (lastValue.startsWith("search:")) {
          toggleOption(lastValue);
        } else if (lastValue.includes(":")) {
          const [prefix] = lastValue.split(":");
          removeGroup(prefix);
        } else {
          toggleOption(lastValue);
        }
      }
    };

    const consolidatedBadges = useMemo(() => {
      const groups: Record<
        string,
        { node: React.ReactNode; sortKey: string }[]
      > = {};
      const uniqueItems: { label: React.ReactNode; value: string }[] = [];

      selected.forEach((val) => {
        if (val.startsWith("search:")) {
          const content = val.replace("search:", "");
          if (content !== searchValue) {
            uniqueItems.push({ label: `"${content}"`, value: val });
          }
          return;
        }

        if (val.includes(":")) {
          const [prefix, ...rest] = val.split(":");
          const content = rest.join(":");
          const opt = allOptionsFlat.find((o) => o.value === val);
          const displayLabel = opt?.label || content;
          const sortKey = opt?.searchKey || content;
          groups[prefix] = [
            ...(groups[prefix] || []),
            { node: displayLabel, sortKey },
          ];
        } else {
          const opt = allOptionsFlat.find((o) => o.value === val);
          uniqueItems.push({ label: opt?.label || val, value: val });
        }
      });

      const badges: BadgeData[] = [];
      const order = ["semester", "block", "period", "master"];
      const sortedEntries = Object.entries(groups).sort(
        (a, b) => order.indexOf(a[0]) - order.indexOf(b[0]),
      );

      sortedEntries.forEach(([prefix, items]) => {
        const isProfile = prefix === "master";
        const title = categoryLabels[prefix] || prefix;
        const sortedItems = items.sort((a, b) =>
          a.sortKey.localeCompare(b.sortKey, undefined, { numeric: true }),
        );

        badges.push({
          label: (
            <div className="flex items-center gap-x-1 max-w-full">
              <span className="font-bold text-[10px] uppercase tracking-tighter opacity-50 whitespace-nowrap">
                {title}:
              </span>
              <div
                className={cn(
                  "flex items-center",
                  isProfile ? "gap-0.5" : "gap-1",
                )}
              >
                {sortedItems.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <span className="inline-flex items-center scale-[0.95] origin-left">
                      {item.node}
                    </span>
                    {idx < sortedItems.length - 1 && !isProfile && (
                      <span className="opacity-30 text-[10px]">,</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ),
          value: prefix,
          isGroup: true,
          prefix: prefix,
        });
      });

      uniqueItems.forEach((item) => {
        badges.push({ label: item.label, value: item.value, isGroup: false });
      });

      return badges;
    }, [selected, allOptionsFlat, categoryLabels, searchValue]);

    return (
      <Command
        shouldFilter={false}
        className="w-full overflow-visible bg-transparent border-none shadow-none"
      >
        <Popover
          open={isPopoverOpen}
          onOpenChange={(open) => {
            setIsPopoverOpen(open);
            if (!open) {
              setSearchValue("");
              onSearchChange?.("");
            }
          }}
          modal={false}
        >
          <PopoverTrigger asChild>
            <div
              ref={ref}
              className={cn(
                "group cursor-text flex p-1.5 rounded-lg border min-h-[3rem] h-auto items-center justify-between bg-background w-full shadow-sm hover:bg-background/90 transition-all focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-ring",
                className,
              )}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest(".clear-action")) {
                  e.preventDefault();
                  return;
                }
                inputRef.current?.focus();
              }}
              {...props}
            >
              <div className="flex flex-wrap items-center gap-1.5 overflow-hidden ml-1 flex-1 relative min-h-[28px]">
                <Search className="h-4 w-4 text-muted-foreground opacity-50 shrink-0" />

                {selected.length === 0 && !searchValue && (
                  <div className="absolute left-6 right-10 flex items-center text-sm text-muted-foreground pointer-events-none">
                    <span className="truncate">{placeholder}</span>
                  </div>
                )}

                {consolidatedBadges.map((badge) => (
                  <MultiSelectBadge
                    key={badge.value}
                    badge={badge}
                    onRemove={() =>
                      badge.isGroup
                        ? removeGroup(badge.prefix!)
                        : toggleOption(badge.value)
                    }
                  />
                ))}

                <div
                  className={cn(
                    "flex items-center transition-all h-7 z-10",
                    searchValue
                      ? "bg-primary/10 border border-primary/20 rounded-md px-2 m-0.5"
                      : "",
                  )}
                >
                  {searchValue && (
                    <span className="text-[10px] uppercase font-bold text-primary mr-1.5 opacity-70">
                      Search:
                    </span>
                  )}
                  <CommandPrimitive.Input
                    ref={inputRef}
                    value={searchValue}
                    onValueChange={(val) => {
                      setSearchValue(val);
                      onSearchChange?.(val);
                      if (!isPopoverOpen) setIsPopoverOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent outline-none text-sm min-w-[2px] w-auto placeholder:text-transparent"
                    style={{
                      width: searchValue
                        ? `${searchValue.length + 1}ch`
                        : "2px",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center flex-shrink-0 ml-2 z-10">
                {selected.length > 0 && (
                  <GlobalClearButton onClear={clearAll} />
                )}
                <div className="p-1 cursor-pointer">
                  <ChevronDown className="h-4 mr-[3] text-muted-foreground hover:text-foreground" />
                </div>
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent
            className={cn(
              "w-[var(--radix-popover-trigger-width)] p-0 overflow-hidden",
              !hasMatchingOptions &&
                "hidden border-none shadow-none bg-transparent",
            )}
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <CommandList className="max-h-[400px] w-full relative">
              {(options as MultiSelectGroup[]).map((group) => {
                const filteredOptions = group.options.filter((o) =>
                  o.searchKey.toLowerCase().includes(searchValue.toLowerCase()),
                );

                if (filteredOptions.length === 0) return null;

                return (
                  <CommandGroup key={group.heading} heading={group.heading}>
                    {filteredOptions.map((option) => (
                      <OptionItem
                        key={option.value}
                        option={option}
                        isSelected={selected.includes(option.value)}
                        onSelect={() => toggleOption(option.value)}
                      />
                    ))}
                  </CommandGroup>
                );
              })}

              <SearchFallbackItem
                searchValue={searchValue}
                exactMatch={exactMatch}
                onSelect={() => {
                  commitSearchTerm(searchValue.trim());
                  setIsPopoverOpen(false);
                }}
              />
            </CommandList>
          </PopoverContent>
        </Popover>
      </Command>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

interface MultiSelectBadgeProps {
  badge: BadgeData;
  onRemove: () => void;
}

const MultiSelectBadge: React.FC<MultiSelectBadgeProps> = ({
  badge,
  onRemove,
}) => (
  <Badge
    className={cn(
      multiSelectVariants(),
      "rounded-md border-foreground/5 transition-all flex items-center pr-1 max-w-full whitespace-normal hover:bg-muted/80 hover:text-foreground cursor-default has-[.clear-action:hover]:bg-destructive/10 has-[.clear-action:hover]:text-destructive has-[.clear-action:hover]:border-destructive/30",
    )}
  >
    <div className="flex-1 min-w-0 flex items-center">{badge.label}</div>
    <div
      role="button"
      tabIndex={0}
      className="group ml-1 p-0.5 rounded-full hover:bg-destructive/20 transition-colors clear-action cursor-pointer flex-shrink-0"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove();
      }}
    >
      <XCircle className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
    </div>
  </Badge>
);

interface GlobalClearButtonProps {
  onClear: () => void;
}

const GlobalClearButton: React.FC<GlobalClearButtonProps> = ({ onClear }) => (
  <button
    type="button"
    tabIndex={0}
    className="group transition-colors clear-action flex items-center justify-center p-1 mr-1 rounded-md cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/30"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClear();
    }}
  >
    <XCircle className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
  </button>
);

interface SearchFallbackItemProps {
  searchValue: string;
  exactMatch: boolean;
  onSelect: () => void;
}

const SearchFallbackItem: React.FC<SearchFallbackItemProps> = ({
  searchValue,
  exactMatch,
  onSelect,
}) => {
  if (!searchValue.trim() || exactMatch) return null;

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

interface OptionItemProps {
  option: MultiSelectOption;
  isSelected: boolean;
  onSelect: () => void;
}

const OptionItem: React.FC<OptionItemProps> = ({
  option,
  isSelected,
  onSelect,
}) => (
  <CommandItem
    value={option.value}
    onSelect={onSelect}
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
    className="cursor-pointer group flex items-center py-2.5 px-3 w-full"
  >
    <div className="mr-3 flex h-4 w-4 items-center justify-center flex-shrink-0">
      {isSelected ? (
        <CircleCheck
          className="text-green-500 animate-in zoom-in-50"
          size={18}
        />
      ) : (
        <div className="h-4 w-4 rounded-full border-2 border-slate-300 opacity-40 group-hover:opacity-100 group-hover:border-primary transition-all" />
      )}
    </div>
    <div className="truncate flex items-center gap-2 flex-1 min-w-0 text-sm">
      {option.dropdownLabel || (
        <>
          {option.icon && <option.icon className="h-4 w-4 shrink-0" />}
          <span className="truncate">{option.label}</span>
        </>
      )}
    </div>
  </CommandItem>
);