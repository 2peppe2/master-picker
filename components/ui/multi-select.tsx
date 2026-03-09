"use client";

import {
  XCircle,
  ChevronDown,
  XIcon,
  Plus,
  CircleCheck,
  CornerDownLeft,
  X,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import React, { forwardRef, useEffect, useMemo, useState } from "react";

const multiSelectVariants = cva(
  "m-0.5 transition-colors duration-200 font-medium select-none h-auto py-1 px-2.5",
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

interface MultiSelectProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: MultiSelectOption[] | MultiSelectGroup[];
  onValueChange: (value: string[]) => void;
  onCreateOption?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  defaultValue?: string[];
  placeholder?: string;
  categoryLabels: Record<string, string>;
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(
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
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] =
      useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    // Keyboard Shortcut: Cmd/Ctrl + K
    useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setIsPopoverOpen((open) => !open);
        }
      };
      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
    }, []);

    useEffect(() => {
      setSelectedValues(defaultValue);
    }, [defaultValue]);

    const allOptionsFlat = useMemo(() => {
      if (options.length === 0) return [];
      return "heading" in options[0]
        ? (options as MultiSelectGroup[]).flatMap((g) => g.options)
        : (options as MultiSelectOption[]);
    }, [options]);

    const handleCommitSearch = () => {
      if (searchValue.trim() && onCreateOption) {
        onCreateOption(searchValue);
        setSearchValue("");
        setIsPopoverOpen(false);
      }
    };

    const consolidatedBadges = useMemo(() => {
      const groups: Record<
        string,
        { node: React.ReactNode; sortKey: string }[]
      > = {};
      const uniqueItems: { label: React.ReactNode; value: string }[] = [];

      selectedValues.forEach((val) => {
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

      const badges: {
        label: React.ReactNode;
        value: string;
        isGroup: boolean;
        prefix?: string;
      }[] = [];

      const order = ["semester", "block", "period", "master"];
      const sortedEntries = Object.entries(groups).sort((a, b) => {
        return order.indexOf(a[0]) - order.indexOf(b[0]);
      });

      sortedEntries.forEach(([prefix, items]) => {
        const isProfile = prefix === "master";
        const title = categoryLabels[prefix] || prefix;
        const sortedItems = items.sort((a, b) =>
          a.sortKey.localeCompare(b.sortKey, undefined, { numeric: true }),
        );

        badges.push({
          label: (
            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 py-0.5 max-w-full">
              <span className="font-bold text-[10px] uppercase tracking-tighter opacity-50 mr-0.5 whitespace-nowrap">
                {title}:
              </span>
              <div
                className={cn(
                  "flex flex-wrap items-center",
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
    }, [selectedValues, allOptionsFlat, categoryLabels]);

    const toggleOption = (value: string) => {
      const next = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setSelectedValues(next);
      onValueChange(next);
    };

    const removeGroup = (prefix: string) => {
      const next = selectedValues.filter((v) => !v.startsWith(`${prefix}:`));
      if (prefix === "search") setSearchValue("");
      setSelectedValues(next);
      onValueChange(next);
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            className={cn(
              "cursor-pointer flex p-1 rounded-lg border min-h-[3rem] h-auto items-center justify-between bg-background w-full shadow-sm hover:bg-background/90 text-left transition-all",
              className,
            )}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest(".clear-action")) {
                e.preventDefault();
                return;
              }
            }}
          >
            <div className="flex flex-wrap items-center gap-1 overflow-hidden ml-1 flex-1">
              {consolidatedBadges.length > 0 ? (
                consolidatedBadges.map((badge) => (
                  <Badge
                    key={badge.value}
                    className={cn(
                      multiSelectVariants(),
                      "rounded-md border-foreground/5 transition-all flex items-center pr-1 max-w-full whitespace-normal",
                      "hover:bg-muted/80 hover:text-foreground cursor-default",
                      "has-[.clear-action:hover]:bg-destructive/10 has-[.clear-action:hover]:text-destructive has-[.clear-action:hover]:border-destructive/30",
                    )}
                  >
                    <div className="flex-1 min-w-0">{badge.label}</div>
                    <div
                      role="button"
                      tabIndex={0}
                      className="ml-1 p-0.5 rounded-full hover:bg-destructive/20 transition-colors clear-action cursor-pointer flex-shrink-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (badge.isGroup) {
                          removeGroup(badge.prefix!);
                        } else {
                          toggleOption(badge.value);
                        }
                      }}
                    >
                      <XCircle className="h-3.5 w-3.5 opacity-40 hover:opacity-100" />
                    </div>
                  </Badge>
                ))
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground ml-3 w-full">
                  <span>{placeholder}</span>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-auto mr-2">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              )}
            </div>
            <div className="flex items-center flex-shrink-0 ml-2">
              {selectedValues.length > 0 && (
                <div
                  className="clear-action p-2 mr-1 rounded-md hover:bg-muted"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSearchValue("");
                    onSearchChange?.("");
                    onValueChange([]);
                  }}
                >
                  <XIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </div>
              )}
              <ChevronDown className="h-4 mr-3 text-muted-foreground" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 overflow-hidden"
          align="start"
        >
          <Command shouldFilter={false} className="relative w-full">
            <div className="flex items-center gap-2 w-full">
              <CommandInput
                placeholder="Type to filter or search..."
                value={searchValue}
                onValueChange={(val) => {
                  setSearchValue(val);
                  onSearchChange?.(val);
                }}
                className="focus:ring-0 flex-1 h-12 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCommitSearch();
                }}
              />

              <div className="w-px h-4 bg-border mx-1 ml-auto" />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted shrink-0"
                onClick={() => setIsPopoverOpen(false)}
              >
                <X className="h-4 w-4 opacity-50" />
              </Button>
            </div>
            <CommandList className="border-t max-h-[400px] w-full">
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
                        isSelected={selectedValues.includes(option.value)}
                        onSelect={() => toggleOption(option.value)}
                      />
                    ))}
                  </CommandGroup>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

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
    onSelect={onSelect}
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

MultiSelect.displayName = "MultiSelect";
