"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchSkills } from "@/graphql/actions/commany";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Check, X, Briefcase } from "lucide-react";

export function SkillsAutocomplete({
  value,
  onChange,
  error,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<{ id: string; title: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, loading, refetch } = useSearchSkills({
    variables: {
      input: {
        search: inputValue,
        limit: 10,
      },
    },
    skip: !inputValue,
  });

  const debouncedFetch = debounce(async (searchText: string) => {
    if (!searchText) {
      setOptions([]);
      return;
    }
    try {
      await refetch({ input: { search: searchText, limit: 10 } });
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  }, 300);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  useEffect(() => {
    if (data?.getSearchSkills) {
      setOptions(
        data.getSearchSkills.edges.map((edge) => ({
          id: edge.node.id,
          title: edge.node.title,
        }))
      );
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val) {
      setOpen(true);
      debouncedFetch(val);
    } else {
      setOpen(false);
      setOptions([]);
    }
  };

  const addSkill = (skill: string) => {
    if (!value.includes(skill)) {
      onChange([...value.filter((s) => s.trim() !== ""), skill]);
    }
    setInputValue("");
    setOpen(false);
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(value.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      addSkill(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeSkill(value[value.length - 1]);
    }
  };

  // Filter out empty strings from value array for display
  const validSkills = value.filter((s) => s.trim() !== "");

  return (
    <div className="space-y-4">
      {validSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {validSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="px-2 py-1 flex items-center gap-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="rounded-full hover:bg-primary/20 p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Popover open={open && options.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <div className="absolute left-3 top-3 z-10 text-muted-foreground">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <Input
              ref={inputRef}
              placeholder="e.g., TypeScript, Next.js, TailwindCSS (press Enter to add custom)"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={cn("w-full pl-10", error && "border-destructive")}
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
              <CommandEmpty>No suggestions found. Press Enter to add.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.title}
                    onSelect={() => {
                      addSkill(option.title);
                    }}
                  >
                    {option.title}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value.includes(option.title)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
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
