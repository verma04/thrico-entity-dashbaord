import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GraphFilterComboboxProps {
  value: string;
  onChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
  options: { id: string; title: string }[];
  placeholder?: string;
  allLabel?: string;
  label?: string;
  icon?: React.ReactNode;
}

export function GraphFilterCombobox({
  value,
  onChange,
  searchQuery,
  onSearchChange,
  options,
  placeholder = "Search...",
  allLabel = "All Options",
  label = "Filter",
  icon,
}: GraphFilterComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-8 text-xs bg-white border-slate-200 text-slate-700 font-normal hover:bg-slate-50"
          >
            {value === "all"
              ? allLabel
              : options.find((o) => o.id === value)?.title || "Select Option"}
            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0 border-slate-200" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={placeholder}
              className="h-8 text-xs"
              value={searchQuery}
              onValueChange={onSearchChange}
            />
            <CommandList className="max-h-48 overflow-y-auto custom-scrollbar">
              <CommandEmpty className="py-2 px-4 text-xs text-slate-500 text-center">
                No option found.
              </CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="all"
                  onSelect={() => {
                    onChange("all");
                    setOpen(false);
                    onSearchChange("");
                  }}
                  className="text-xs py-1.5 cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-3 w-3",
                      value === "all" ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {allLabel}
                </CommandItem>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    onSelect={() => {
                      onChange(option.id);
                      setOpen(false);
                      onSearchChange("");
                    }}
                    className="text-xs py-1.5 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        value === option.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
