"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  onSearchChange?: (search: string) => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  onSearchChange,
  loading,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // Clear search when dropdown closes
  React.useEffect(() => {
    if (!open) {
      setSearchValue("");
      if (onSearchChange) {
        onSearchChange("");
      }
    }
  }, [open, onSearchChange]);

  const handleSearch = (val: string) => {
    setSearchValue(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleSelect = (currentValue: string) => {
    if (selected.includes(currentValue)) {
      onChange(selected.filter((item) => item !== currentValue));
    } else {
      onChange([...selected, currentValue]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  // Combine selected and options to ensure selected items are always rendered
  const displayOptions = React.useMemo(() => {
    const combined = [...selected];
    options.forEach((opt) => {
      if (!combined.includes(opt)) {
        combined.push(opt);
      }
    });
    return combined;
  }, [options, selected]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[140px] h-7 rounded-md border-border bg-card text-[11px] font-semibold text-foreground shadow-none hover:bg-card focus:ring-2 focus:ring-ring/20 transition-colors justify-between px-2",
            selected.length > 0 && "border-primary/50 bg-primary/5",
            className
          )}
        >
          <div className="flex gap-1 overflow-hidden">
            {selected.length === 0 ? (
              <span className="text-muted-foreground font-normal">
                {placeholder}
              </span>
            ) : selected.length === 1 ? (
              <span className="truncate">{selected[0]}</span>
            ) : (
              <span className="truncate">
                {selected.length} selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {selected.length > 0 && (
              <div
                role="button"
                tabIndex={0}
                className="hover:bg-muted p-0.5 rounded-sm"
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleClear(e as any);
                }}
              >
                <X className="h-3 w-3 opacity-50 hover:opacity-100" />
              </div>
            )}
            <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 shadow-lg border-border" align="start">
        <Command>
          <CommandInput 
            value={searchValue}
            onValueChange={handleSearch}
            placeholder={`Search ${placeholder.toLowerCase()}...`} 
            className="h-8 text-xs" 
          />
          <CommandList className="max-h-60">
            <CommandEmpty className="text-xs py-4 text-center text-muted-foreground">
              {loading ? "Loading..." : "No options found."}
            </CommandEmpty>
            <CommandGroup>
              {displayOptions.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={handleSelect}
                  className="text-xs"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-3 w-3 items-center justify-center rounded-sm border border-primary",
                      selected.includes(option)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className="h-2 w-2" />
                  </div>
                  <span className="truncate">{option}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
