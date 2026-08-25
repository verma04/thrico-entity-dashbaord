"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import debounce from "lodash/debounce";
import { useSearchCompanies } from "@/graphql/actions/commany";
import {
  Check,
  ChevronsUpDown,
  Building2,
  ChevronRight,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageForm from "../page/page-form";

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
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Page[]>([]);
  const [selectedValue, setSelectedValue] = useState<
    { id: string; name: string; logo: string } | undefined
  >(initialValue);
  const [value, setValue] = useState<string>("");
  const [showDrawer, setShowDrawer] = useState(false);

  const { data, loading, refetch } = useSearchCompanies({
    variables: {
      input: {
        search: value,
        limit: 20,
      },
    },
  });

  const debouncedFetchUsers = debounce(async (searchText: string) => {
    if (!searchText) {
      setOptions([]);
      return;
    }

    try {
      await refetch({ input: { search: searchText, limit: 20 } });
      if (data?.getSearchCompanies) {
        setOptions(
          data.getSearchCompanies.edges.map((edge) => ({
            id: edge.node.id,
            name: edge.node.title,
            logo: "",
          })),
        );
      }
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  }, 500);

  useEffect(() => {
    if (data?.getSearchCompanies) {
      setOptions(
        data.getSearchCompanies.edges.map((edge) => ({
          id: edge.node.id,
          name: edge.node.title,
          logo: "",
        })),
      );
    }
  }, [data]);

  useEffect(() => {
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [debouncedFetchUsers]);

  const handleSearch = async (searchText: string) => {
    setValue(searchText);
    await debouncedFetchUsers(searchText);
  };

  interface AddPageData {
    addPage?: {
      id: string;
      name: string;
      logo: string;
    };
  }

  const onCompleted = (data: AddPageData): void => {
    setShowDrawer(false);
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px] px-3 font-normal"
          >
            {selectedValue ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage
                    src={
                      selectedValue.logo
                        ? `https://cdn.thrico.network/${selectedValue.logo}`
                        : "/placeholder.svg"
                    }
                  />
                  <AvatarFallback>{selectedValue.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{selectedValue.name}</span>
              </div>
            ) : (
              <span className="text-[#8c9196]">Search for a company...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search companies..."
              onValueChange={handleSearch}
            />
            <CommandList>
              <CommandEmpty>
                {loading ? (
                  <div className="p-2 text-sm">Searching...</div>
                ) : value ? (
                  <div className="p-2 text-sm">
                    <p>No company found</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDrawer(true)}
                      className="mt-2 w-full"
                    >
                      Add {value}
                    </Button>
                  </div>
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">
                    Search Company
                  </div>
                )}
              </CommandEmpty>
              {options.length > 0 && (
                <CommandGroup>
                  {options.map((page) => (
                    <CommandItem
                      key={page.id}
                      value={page.name}
                      onSelect={(currentValue) => {
                        onChange({
                          id: page.id,
                          name: page.name,
                          logo: page.logo,
                        });
                        setSelectedValue({
                          id: page.id,
                          name: page.name,
                          logo: page.logo,
                        });
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedValue?.id === page.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={
                            page.logo
                              ? `https://cdn.thrico.network/${page.logo}`
                              : "/placeholder.svg"
                          }
                        />
                        <AvatarFallback>{page.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{page.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {page.name}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Sheet open={showDrawer} onOpenChange={setShowDrawer}>
        <SheetContent
          side="bottom"
          className="h-screen p-0 border-none flex flex-col overflow-y-auto"
        >
          {/* Header section - Sticky */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-6 py-4">
            <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Add New Company
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
                  <span>Jobs</span>
                  <ChevronRight className="h-3 w-3" />
                  <span>Add Company</span>
                </div>
              </div>
              <div className="hidden sm:flex gap-3">
                <Button
                  variant="outline"
                  type="button"
                  size="sm"
                  onClick={() => setShowDrawer(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto py-8">
              <PageForm value={value} onCompleted={onCompleted} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
