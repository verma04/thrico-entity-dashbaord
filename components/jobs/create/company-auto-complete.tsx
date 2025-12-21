"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";
import { useAllPages } from "../../../graphql/actions/commany";
import PageForm from "../../page/PageForm";

type Page = {
  id: string;
  name: string;
  logo: string;
};

export function CompanyAutocompleteSelect({
  onChange,
  initialValue,
}: {
  onChange: (value: { id: string; name: string; logo: string }) => void;
  initialValue?: {
    id: string;
    logo: string;
    name: string;
  };
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<
    { id: string; name: string; logo: string } | undefined
  >(initialValue);
  const [searchValue, setSearchValue] = useState("");

  const { data, loading, refetch } = useAllPages({
    variables: {
      input: {
        value: searchValue,
        limit: 10,
      },
    },
  });

  const pages = data?.getAllPages || [];

  const debouncedSearch = debounce((value: string) => {
    setSearchValue(value);
    refetch();
  }, 500);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const handleSelect = (page: Page) => {
    const newValue = {
      id: page.id,
      name: page.name,
      logo: page.logo,
    };
    setSelectedValue(newValue);
    onChange(newValue);
    setPopoverOpen(false);
  };

  interface AddPageData {
    addPage?: {
      id: string;
      name: string;
      logo: string;
    };
  }

  const onCompleted = (data: AddPageData): void => {
    setDrawerOpen(false);
    const { addPage } = data;

    if (addPage) {
      const newValue = {
        id: addPage.id,
        name: addPage.name,
        logo: addPage.logo,
      };
      setSelectedValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={popoverOpen}
            className="w-full justify-between"
          >
            {selectedValue ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`https://cdn.thrico.network/${selectedValue.logo}`}
                    alt={selectedValue.name}
                  />
                  <AvatarFallback>{selectedValue.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{selectedValue.name}</span>
              </div>
            ) : (
              "Search for a School/Institute"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search company..."
              onValueChange={(value) => debouncedSearch(value)}
            />
            <CommandList>
              <CommandEmpty>
                {loading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : searchValue ? (
                  <div className="p-4 text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      No company found. Add "{searchValue}"?
                    </p>
                    <Button size="sm" onClick={() => setDrawerOpen(true)}>
                      Add Company
                    </Button>
                  </div>
                ) : (
                  <p className="p-4 text-sm text-center text-muted-foreground">
                    Search for a company
                  </p>
                )}
              </CommandEmpty>
              <CommandGroup>
                {pages.map((page: Page) => (
                  <CommandItem
                    key={page.id}
                    value={page.id}
                    onSelect={() => handleSelect(page)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue?.id === page.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={`https://cdn.thrico.network/${page.logo}`}
                          alt={page.name}
                        />
                        <AvatarFallback>{page.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{page.name}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Company</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <PageForm value={searchValue} onCompleted={onCompleted} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
