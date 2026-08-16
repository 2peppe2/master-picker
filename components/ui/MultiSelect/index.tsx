"use client";

import { Command, CommandGroup, CommandList } from "@/components/ui/command";
import SearchFallbackItem from "./components/SearchFallbackItem";
import GlobalClearButton from "./components/GlobalClearButton";
import DrilldownHeader from "./components/DrilldownHeader";
import { MultiSelectGroup, MultiSelectOption } from "./types";
import MultiSelectBadge from "./components/MultiSelectBadge";
import CategoryItem from "./components/CategoryItem";
import React, { forwardRef, HTMLAttributes, useMemo } from "react";
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
  "value"
> {
  options: MultiSelectOption[] | MultiSelectGroup[];
  value: string[];
  onValueChange: (value: string[]) => void;
  onCreateOption?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
  categoryLabels: Record<string, string>;
  /** Label of the row that leaves a drilled-in section. */
  backLabel?: string;
}

const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (props, ref) => {
    const {
      placeholder = "Search...",
      backLabel = "Back",
      className,
      onValueChange,
      onSearchChange,
    } = props;

    const { state, setters, refs, data, actions } = useMultiSelect(props);

    const activeGroup = useMemo(() => {
      if (!state.drilldown) return null;

      return (
        (props.options as MultiSelectGroup[]).find(
          (g) => "heading" in g && g.heading === state.drilldown?.heading,
        ) ?? null
      );
    }, [props.options, state.drilldown]);

    const activeSection = useMemo(
      () =>
        activeGroup?.sections?.find(
          (section) => section.key === state.drilldown?.sectionKey,
        ) ?? null,
      [activeGroup, state.drilldown],
    );

    const countSelected = (options: MultiSelectOption[]) =>
      options.filter((option) => state.selected.includes(option.value)).length;

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
              setters.setDrilldown(null);
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
                      // Searching spans every section, so leave the drill-down.
                      if (val) setters.setDrilldown(null);
                      if (val && !state.isPopoverOpen)
                        setters.setIsPopoverOpen(true);

                      const filteredSelected = state.selected.filter(
                        (v) => !v.startsWith("search:"),
                      );
                      if (val) {
                        const next = [...filteredSelected, `search:${val}`];
                        onValueChange(next);
                      } else {
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
            onEscapeKeyDown={(e) => {
              // Escape climbs one level at a time before closing the popover.
              if (!state.drilldown) return;

              e.preventDefault();
              setters.setDrilldown(
                state.drilldown.sectionKey
                  ? { heading: state.drilldown.heading }
                  : null,
              );
              refs.inputRef.current?.focus();
            }}
          >
            <CommandList
              ref={refs.listRef}
              className="max-h-[400px] w-full relative"
            >
              {activeSection ? (
                <>
                  <DrilldownHeader
                    heading={activeSection.headerLabel}
                    backLabel={backLabel}
                    onBack={() =>
                      setters.setDrilldown({ heading: activeGroup!.heading })
                    }
                  />
                  <CommandGroup>
                    {activeSection.options.map((option) => (
                      <OptionItem
                        key={option.value}
                        option={option}
                        isSelected={state.selected.includes(option.value)}
                        onSelect={() => actions.toggleOption(option.value)}
                      />
                    ))}
                  </CommandGroup>
                </>
              ) : activeGroup ? (
                <>
                  <DrilldownHeader
                    heading={activeGroup.heading}
                    backLabel={backLabel}
                    onBack={() => setters.setDrilldown(null)}
                  />
                  <CommandGroup>
                    {activeGroup.sections
                      ? activeGroup.sections.map((section) => (
                          <CategoryItem
                            key={section.key}
                            label={section.label}
                            icon={section.icon}
                            selectedCount={countSelected(section.options)}
                            value={`__section:${activeGroup.heading}:${section.key}`}
                            onSelect={() =>
                              setters.setDrilldown({
                                heading: activeGroup.heading,
                                sectionKey: section.key,
                              })
                            }
                          />
                        ))
                      : activeGroup.options.map((option) => (
                          <OptionItem
                            key={option.value}
                            option={option}
                            isSelected={state.selected.includes(option.value)}
                            onSelect={() => actions.toggleOption(option.value)}
                          />
                        ))}
                  </CommandGroup>
                </>
              ) : state.searchValue ? (
                // Searching spans every category, so show the hits themselves.
                data.filteredGroups.map((group) => (
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
                ))
              ) : (
                <CommandGroup>
                  {(props.options as MultiSelectGroup[]).map((group) => (
                    <CategoryItem
                      key={group.heading}
                      label={group.heading}
                      icon={group.icon}
                      selectedCount={countSelected(group.options)}
                      value={`__category:${group.heading}`}
                      onSelect={() =>
                        setters.setDrilldown({ heading: group.heading })
                      }
                    />
                  ))}
                </CommandGroup>
              )}

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
