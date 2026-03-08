"use client";

import { XCircle, ChevronDown, XIcon, Plus, Target } from "lucide-react";
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
import * as React from "react";

// Modified version of multi-select that handles categories and more.

const multiSelectVariants = cva(
  "m-1 transition-colors duration-200 font-medium select-none",
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
  label: string;
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
}

const CATEGORY_LABELS: Record<string, string> = {
  master: "Profiles",
  semester: "Semesters",
  block: "Blocks",
  period: "Periods",
};

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      onCreateOption,
      onSearchChange,
      defaultValue = [],
      placeholder = "Search...",
      className,
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");

    React.useEffect(() => {
      setSelectedValues(defaultValue);
    }, [defaultValue]);

    const allOptionsFlat = React.useMemo(() => {
      if (options.length === 0) return [];
      return "heading" in options[0]
        ? (options as MultiSelectGroup[]).flatMap((g) => g.options)
        : (options as MultiSelectOption[]);
    }, [options]);

    // --- SMART GROUPING ENGINE ---
    const consolidatedBadges = React.useMemo(() => {
      const groups: Record<string, string[]> = {};
      const uniqueItems: { label: string; value: string }[] = [];

      selectedValues.forEach((val) => {
        if (val.includes(":")) {
          const [prefix, ...rest] = val.split(":");
          const content = rest.join(":");
          const opt = allOptionsFlat.find((o) => o.value === val);

          let displayLabel = opt?.label || content;
          const categoryName = CATEGORY_LABELS[prefix]?.slice(0, -1);

          if (categoryName && displayLabel.startsWith(categoryName)) {
            displayLabel = displayLabel.replace(categoryName, "").trim();
          }

          groups[prefix] = [...(groups[prefix] || []), displayLabel];
        } else {
          const opt = allOptionsFlat.find((o) => o.value === val);
          uniqueItems.push({ label: opt?.label || val, value: val });
        }
      });

      const badges: {
        label: string;
        value: string;
        isGroup: boolean;
        prefix?: string;
      }[] = [];

      Object.entries(groups).forEach(([prefix, items]) => {
        const title =
          CATEGORY_LABELS[prefix] ||
          prefix.charAt(0).toUpperCase() + prefix.slice(1);
        badges.push({
          label: `${title}: ${items.join(", ")}`,
          value: prefix,
          isGroup: true,
          prefix: prefix,
        });
      });

      uniqueItems.forEach((item) => {
        badges.push({ label: item.label, value: item.value, isGroup: false });
      });

      return badges;
    }, [selectedValues, allOptionsFlat]);

    const toggleOption = (value: string) => {
      const next = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setSelectedValues(next);
      onValueChange(next);
    };

    const removeGroup = (prefix: string) => {
      const next = selectedValues.filter((v) => !v.startsWith(`${prefix}:`));

      // If the search badge was removed, clear the input field inside the popover too
      if (prefix === "search") {
        setSearchValue("");
      }

      setSelectedValues(next);
      onValueChange(next);
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            className={cn(
              "cursor-pointer  flex p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-background w-full shadow-sm hover:bg-background/90 text-left",
              className,
            )}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest(".clear-action")) {
                e.preventDefault();
                return;
              }
            }}
          >
            <div className="flex flex-wrap items-center gap-1 overflow-hidden">
              {consolidatedBadges.length > 0 ? (
                consolidatedBadges.map((badge) => (
                  <Badge
                    key={badge.value}
                    className={cn(
                      multiSelectVariants(),
                      // Added: Destructive hover styling for grouped tags
                      "max-w-[400px] truncate group/badge hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all",
                    )}
                  >
                    <span className="truncate">{badge.label}</span>
                    <XCircle
                      className="ml-2 h-3.5 w-3.5 flex-shrink-0 cursor-pointer opacity-70 group-hover/badge:opacity-100 clear-action transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (badge.isGroup) {
                          removeGroup(badge.prefix!);
                        } else {
                          toggleOption(badge.value);
                        }
                      }}
                    />
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground mx-3">
                  {placeholder}
                </span>
              )}
            </div>
            <div className="flex items-center flex-shrink-0">
              {selectedValues.length > 0 && (
                <div
                  className="clear-action p-1 mr-1 rounded-md hover:bg-muted"
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
              <ChevronDown className="h-4 mr-2 text-muted-foreground" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] min-w-[350px] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search or add custom keyword..."
              value={searchValue}
              onValueChange={(val) => {
                setSearchValue(val);
                onSearchChange?.(val); // Trigger optimistic search on every keystroke
              }}
              onKeyDown={(e) => {
                // Hitting enter commits the search tag and clears the input
                if (e.key === "Enter" && searchValue.trim() && onCreateOption) {
                  onCreateOption(searchValue);
                  setSearchValue("");
                }
              }}
            />
            <CommandList className="max-h-[400px]">
              {searchValue &&
                !allOptionsFlat.some(
                  (o) => o.label.toLowerCase() === searchValue.toLowerCase(),
                ) && (
                  <CommandGroup heading="Free Text Search">
                    <CommandItem
                      onSelect={() => {
                        onCreateOption?.(searchValue);
                        setSearchValue("");
                      }}
                      className="cursor-pointer bg-primary/5 m-1 rounded border border-dashed border-primary/20"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      <span>
                        Search for{" "}
                        <b className="underline">&qoute;{searchValue}&qoute;</b>
                      </span>
                    </CommandItem>
                  </CommandGroup>
                )}
              {(options as MultiSelectGroup[]).map((group) => (
                <CommandGroup key={group.heading} heading={group.heading}>
                  {group.options
                    .filter((o) =>
                      o.label.toLowerCase().includes(searchValue.toLowerCase()),
                    )
                    .map((option) => (
                      <OptionItem
                        key={option.value}
                        option={option}
                        isSelected={selectedValues.includes(option.value)}
                        onSelect={() => toggleOption(option.value)}
                      />
                    ))}
                </CommandGroup>
              ))}
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
    className="cursor-pointer group flex items-center py-2 px-3"
  >
    <div
      className={cn(
        "mr-3 flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200",
        isSelected
          ? "bg-cyan-500 border-cyan-600 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
          : "opacity-40 border-slate-300 group-hover:opacity-100 group-hover:border-primary",
      )}
    >
      {isSelected && (
        <Target className="h-3 w-3 text-white fill-white animate-in zoom-in-50" />
      )}
    </div>
    {option.icon && (
      <div className="mr-2 flex-shrink-0">
        <option.icon />
      </div>
    )}
    <span
      className={cn(
        "text-sm transition-colors",
        isSelected
          ? "font-semibold text-foreground"
          : "text-muted-foreground group-hover:text-foreground",
      )}
    >
      {option.label}
    </span>
  </CommandItem>
);

MultiSelect.displayName = "MultiSelect";
