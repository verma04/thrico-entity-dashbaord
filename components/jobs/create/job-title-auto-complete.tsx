"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchJobTitle } from "@/graphql/actions/commany";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";

export function JobTitleAutocomplete({
  value,
  onChange,
  onBlur,
  error,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: any) => void;
  error?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<{ id: string; title: string }[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, loading, refetch } = useSearchJobTitle({
    variables: {
      input: {
        search: inputValue,
        limit: 10,
      },
    },
    skip: !inputValue, // Only search if there's an input
  });

  const debouncedFetch = debounce(async (searchText: string) => {
    if (!searchText) {
      setOptions([]);
      return;
    }
    try {
      await refetch({ input: { search: searchText, limit: 10 } });
    } catch (error) {
      console.error("Error fetching job titles:", error);
    }
  }, 300);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  useEffect(() => {
    if (data?.getSearchJobTitle) {
      setOptions(
        data.getSearchJobTitle.edges.map((edge) => ({
          id: edge.node.id,
          title: edge.node.title,
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val); // Always save whatever user types
    if (val) {
      setOpen(true);
      debouncedFetch(val);
    } else {
      setOpen(false);
      setOptions([]);
    }
  };

  return (
    <Popover open={open && options.length > 0} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={(e) => {
              // Delay hiding the popover so clicks on items register
              setTimeout(() => {
                setOpen(false);
                if (onBlur) onBlur(e);
              }, 200);
            }}
            className={cn(
              "w-full h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]",
              error && "border-[#d72c0d]",
            )}
            autoComplete="off"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandList>
            <CommandEmpty>No suggestions found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.title}
                  onSelect={(currentValue) => {
                    // Update input with the selected value
                    // currentValue from shadcn command can be lowercased, so we use option.title
                    setInputValue(option.title);
                    onChange(option.title);
                    setOpen(false);
                  }}
                >
                  {option.title}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      inputValue === option.title ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
