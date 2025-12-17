import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const ICON_NAMES = Object.keys(LucideIcons).filter(
  (name) =>
    name !== "icons" && name !== "createLucideIcon" && isNaN(Number(name))
);
const IconPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const SelectedIcon = value
    ? (LucideIcons as any)[value.charAt(0).toUpperCase() + value.slice(1)]
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-7 text-xs px-2"
        >
          {value ? (
            <span className="flex items-center gap-2 truncate">
              {SelectedIcon && <SelectedIcon className="h-3 w-3 shrink-0" />}
              {value}
            </span>
          ) : (
            <span className="text-muted-foreground">Select icon...</span>
          )}
          <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] p-0 bg-popover border rounded-md shadow-md"
        side="bottom"
        align="start"
        sideOffset={4}
      >
        <IconList
          onSelect={(val) => {
            onChange(val);
            setOpen(false);
          }}
          selectedValue={value}
        />
      </PopoverContent>
    </Popover>
  );
};

const IconList = ({
  onSelect,
  selectedValue,
}: {
  onSelect: (val: string) => void;
  selectedValue: string;
}) => {
  const [search, setSearch] = useState("");
  const filteredIcons = useMemo(() => {
    if (!search) return ICON_NAMES.slice(0, 50);
    return ICON_NAMES.filter((name) =>
      name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 50);
  }, [search]);

  return (
    <Command shouldFilter={false} className="rounded-lg border-0">
      <CommandInput
        placeholder="Search icon..."
        className="h-8 text-xs border-b"
        value={search}
        onValueChange={setSearch}
      />
      <CommandList className="max-h-[200px] overflow-y-auto">
        {filteredIcons.length === 0 && (
          <CommandEmpty className="py-6 text-center text-xs">
            No icon found.
          </CommandEmpty>
        )}
        <CommandGroup>
          {filteredIcons.map((iconName) => {
            const Icon = (LucideIcons as any)[iconName];
            if (!Icon) return null;
            return (
              <CommandItem
                key={iconName}
                value={iconName}
                onSelect={() => {
                  onSelect(iconName);
                }}
                className="text-xs cursor-pointer aria-selected:bg-accent"
              >
                <Icon className="mr-2 h-3 w-3 shrink-0" />
                <span className="truncate">{iconName}</span>
                {selectedValue === iconName && (
                  <LucideIcons.Check className="ml-auto h-3 w-3 opacity-50" />
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export { IconPicker };
