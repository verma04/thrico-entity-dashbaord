"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
import { useShopProducts } from "@/graphql/actions/shop";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useModuleStore } from "@/store/useModuleStore";

interface ProductPickerProps {
  value?: string;
  onSelect: (value: string, product?: any) => void;
  className?: string;
}

export function ProductPicker({
  value,
  onSelect,
  className,
}: ProductPickerProps) {
  const singularName = useModuleStore((state) => state.shopSingularName);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const { data, loading } = useShopProducts({
    pagination: {
      limit: 100,
      offset: 0,
    },
  });

  const products = data?.getShopProducts || [];

  const selectedProduct = products.find((p: any) => p.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedProduct ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar className="w-5 h-5 rounded">
                <AvatarImage src={selectedProduct.media?.[0]?.url} />
                <AvatarFallback>{selectedProduct.title[0]}</AvatarFallback>
              </Avatar>
              <span className="truncate">{selectedProduct.title}</span>
            </div>
          ) : (
            `Select ${singularName.toLowerCase()}...`
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${singularName.toLowerCase()}s...`}
            onValueChange={setSearch}
            value={search}
          />
          <CommandList>
            <CommandEmpty>No {singularName.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {products
                .filter((p: any) =>
                  p.title.toLowerCase().includes(search.toLowerCase()),
                )
                .map((product: any) => (
                  <CommandItem
                    key={product.id}
                    value={product.title}
                    onSelect={() => {
                      onSelect(product.id, product);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === product.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Avatar className="w-6 h-6 rounded">
                        <AvatarImage src={product.media?.[0]?.url} />
                        <AvatarFallback>{product.title[0]}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{product.title}</span>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
