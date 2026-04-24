"use client";

import { Command, CommandGroup, CommandList } from "@/components/ui/command";
import SearchFallbackItem from "./components/SearchFallbackItem";
import GlobalClearButton from "./components/GlobalClearButton";
import { MultiSelectGroup, MultiSelectOption } from "./types";
import MultiSelectBadge from "./components/MultiSelectBadge";
import React, { forwardRef, HTMLAttributes } from "react";
import { useMultiSelect } from "./hooks/useMultiSelect";
import { useHotkey } from "@tanstack/react-hotkeys";
import { Command as CommandPrimitive } from "cmdk";
import { ChevronDown, Search } from "lucide-react";
import OptionItem from "./components/OptionItem";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface MultiSelectProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue"
> {
  options: MultiSelectOption[] | MultiSelectGroup[];
  onValueChange: (value: string[]) => void;
  onCreateOption?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  defaultValue?: string[];
  placeholder?: string;
  categoryLabels: Record<string, string>;
}

const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (props, ref) => {
    const {
      placeholder = "Search...",
      className,
      onValueChange,
      onSearchChange,
    } = props;

    const { state, setters, refs, data, actions } = useMultiSelect(props);

    useHotkey("Mod+K", (e) => {
      e.preventDefault();
      setters.setIsPopoverOpen((open) => {
        if (!open) setTimeout(() => refs.inputRef.current?.focus(), 0);
        return !open;
      });
    });

    return (
      <Command
        shouldFilter={false}
        value={state.activeValue}
        onValueChange={setters.setActiveValue}
        className="w-full overflow-visible bg-transparent border-none shadow-none"
      >
        <Popover
          open={state.isPopoverOpen}
          onOpenChange={(open) => {
            setters.setIsPopoverOpen(open);
            if (!open) {
              setTimeout(() => {
                setters.setSearchValue("");
              }, 100);
            }
          }}
          modal={false}
        >
          <PopoverTrigger asChild>
            <div
              ref={ref}
              className={cn(
                "group cursor-text flex p-1.5 rounded-lg border min-h-[3rem] h-auto items-center justify-between bg-background max-md:bg-muted/50 w-full shadow-sm hover:bg-background/90 transition-all focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-ring",
                className,
              )}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest(".clear-action")) {
                  e.preventDefault();
                  return;
                }
                refs.inputRef.current?.focus();
              }}
            >
              <div className="flex flex-wrap items-center gap-1.5 ml-1 flex-1 relative min-h-[28px]">
                <Search className="h-4 w-4 text-muted-foreground opacity-50 shrink-0" />

                {state.selected.length === 0 && !state.searchValue && (
                  <div className="absolute left-6 right-10 flex items-center text-sm text-muted-foreground pointer-events-none">
                    <span className="truncate">{placeholder}</span>
                  </div>
                )}

                {data.consolidatedBadges.map((badge) => (
                  <MultiSelectBadge
                    key={badge.value}
                    badge={badge}
                    onRemove={() =>
                      badge.isGroup
                        ? actions.removeGroup(badge.prefix!)
                        : actions.toggleOption(badge.value)
                    }
                  />
                ))}

                <div
                  className={cn(
                    "flex items-center transition-all min-h-7 z-10",
                    state.searchValue
                      ? "bg-primary/10 border border-primary/20 rounded-md px-2 m-0.5"
                      : "",
                  )}
                >
                  {state.searchValue && (
                    <span className="text-[10px] uppercase font-bold text-primary mr-1.5 opacity-70">
                      Search:
                    </span>
                  )}
                  <CommandPrimitive.Input
                    ref={refs.inputRef}
                    value={state.searchValue}
                    onValueChange={(val) => {
                      setters.setSearchValue(val);
                      onSearchChange?.(val);
                      setters.setActiveValue("");
                      if (val && !state.isPopoverOpen)
                        setters.setIsPopoverOpen(true);

                      const filteredSelected = state.selected.filter(
                        (v) => !v.startsWith("search:"),
                      );
                      if (val) {
                        const next = [...filteredSelected, `search:${val}`];
                        setters.setSelected(next);
                        onValueChange(next);
                      } else {
                        setters.setSelected(filteredSelected);
                        onValueChange(filteredSelected);
                      }
                    }}
                    onKeyDown={actions.handleKeyDown}
                    className="text-[12px] bg-transparent outline-none text-sm min-w-[2px] w-auto placeholder:text-transparent"
                    style={{
                      width: state.searchValue
                        ? `${state.searchValue.length + 1}ch`
                        : "2px",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center flex-shrink-0 ml-2 z-10 self-start mt-1">
                {state.selected.length > 0 && (
                  <GlobalClearButton onClear={actions.clearAll} />
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
              !data.hasMatchingOptions &&
                "hidden border-none shadow-none bg-transparent",
            )}
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <CommandList
              ref={refs.listRef}
              className="max-h-[400px] w-full relative"
            >
              {data.filteredGroups.map((group) => (
                <CommandGroup key={group.heading} heading={group.heading}>
                  {group.options.map((option) => (
                    <OptionItem
                      key={option.value}
                      option={option}
                      isSelected={state.selected.includes(option.value)}
                      onSelect={() => actions.toggleOption(option.value)}
                    />
                  ))}
                </CommandGroup>
              ))}

              <SearchFallbackItem
                searchValue={state.searchValue}
                exactMatch={data.exactMatch}
                onSelect={actions.commitSearchTerm}
              />
            </CommandList>
          </PopoverContent>
        </Popover>
      </Command>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
