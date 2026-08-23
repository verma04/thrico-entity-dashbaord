"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Folder, Package, Users, Check, X, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectedItem } from "../types";

export interface BrowseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "collection" | "product" | "customer" | "segment";
  title?: string;
  selectedItems: SelectedItem[];
  onConfirm: (items: SelectedItem[]) => void;
}

// Sample fallback store catalog data for interactive browsing
const MOCK_COLLECTIONS: SelectedItem[] = [
  {
    id: "col-1",
    title: "Summer 2026 Collection",
    subtitle: "14 products in collection",
    type: "collection",
  },
  {
    id: "col-2",
    title: "Best Sellers & Featured Apparel",
    subtitle: "32 products in collection",
    type: "collection",
  },
  {
    id: "col-3",
    title: "Accessories & Drinkware",
    subtitle: "8 products in collection",
    type: "collection",
  },
  {
    id: "col-4",
    title: "Eco-Friendly Organic Gear",
    subtitle: "19 products in collection",
    type: "collection",
  },
  {
    id: "col-5",
    title: "Member Exclusive Drops",
    subtitle: "5 products in collection",
    type: "collection",
  },
];

const MOCK_PRODUCTS: SelectedItem[] = [
  {
    id: "prod-1",
    title: "Classic Premium Heavyweight Hoodie",
    subtitle: "$65.00 · In stock (42 units)",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100&auto=format&fit=crop&q=60",
    type: "product",
  },
  {
    id: "prod-2",
    title: "Embroidered Heritage Snapback Cap",
    subtitle: "$28.00 · In stock (110 units)",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=100&auto=format&fit=crop&q=60",
    type: "product",
  },
  {
    id: "prod-3",
    title: "Insulated Stainless Thermal Tumbler (500ml)",
    subtitle: "$34.00 · In stock (85 units)",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&auto=format&fit=crop&q=60",
    type: "product",
  },
  {
    id: "prod-4",
    title: "Organic Cotton Relaxed Fit Tee",
    subtitle: "$32.00 · In stock (240 units)",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=60",
    type: "product",
  },
  {
    id: "prod-5",
    title: "Waterproof Commuter Backpack 22L",
    subtitle: "$89.00 · In stock (18 units)",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&auto=format&fit=crop&q=60",
    type: "product",
  },
];

const MOCK_SEGMENTS: SelectedItem[] = [
  {
    id: "seg-1",
    title: "VIP Tier & High Spenders",
    subtitle: "248 customers · Spend > $500",
    type: "segment",
  },
  {
    id: "seg-2",
    title: "First-Time Buyers",
    subtitle: "1,120 customers · 1 order placed",
    type: "segment",
  },
  {
    id: "seg-3",
    title: "Repeat Customers (2+ orders)",
    subtitle: "640 customers · Returning cohort",
    type: "segment",
  },
  {
    id: "seg-4",
    title: "Abandoned Cart (Last 30 days)",
    subtitle: "315 customers",
    type: "segment",
  },
];

export function BrowseModal({
  open,
  onOpenChange,
  type,
  title,
  selectedItems,
  onConfirm,
}: BrowseModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSelection, setCurrentSelection] = useState<SelectedItem[]>(selectedItems);

  // Sync selection when opened
  React.useEffect(() => {
    if (open) {
      setCurrentSelection(selectedItems);
      setSearchQuery("");
    }
  }, [open, selectedItems]);

  const pool = useMemo(() => {
    switch (type) {
      case "collection":
        return MOCK_COLLECTIONS;
      case "product":
        return MOCK_PRODUCTS;
      case "segment":
        return MOCK_SEGMENTS;
      default:
        return MOCK_COLLECTIONS;
    }
  }, [type]);

  const filteredPool = useMemo(() => {
    if (!searchQuery.trim()) return pool;
    const q = searchQuery.toLowerCase().trim();
    return pool.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );
  }, [pool, searchQuery]);

  const toggleItem = (item: SelectedItem) => {
    setCurrentSelection((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleApply = () => {
    onConfirm(currentSelection);
    onOpenChange(false);
  };

  const getIcon = () => {
    switch (type) {
      case "collection":
        return <Folder className="h-4 w-4 text-[#005bd3] dark:text-blue-400" />;
      case "product":
        return <Package className="h-4 w-4 text-[#005bd3] dark:text-blue-400" />;
      case "segment":
        return <Users className="h-4 w-4 text-[#005bd3] dark:text-blue-400" />;
      default:
        return <Tag className="h-4 w-4 text-[#005bd3] dark:text-blue-400" />;
    }
  };

  const modalTitle =
    title ||
    (type === "collection"
      ? "Select Collections"
      : type === "product"
      ? "Select Specific Products"
      : "Select Customer Segments");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] rounded-[12px] p-0 overflow-hidden border-[#d2d5d9] dark:border-zinc-800">
        <DialogHeader className="p-4 pb-3 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-[8px] bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 flex items-center justify-center">
                {getIcon()}
              </div>
              <div>
                <DialogTitle className="text-[15px] font-semibold text-[#303030] dark:text-zinc-100">
                  {modalTitle}
                </DialogTitle>
                <p className="text-[12px] text-[#616161] dark:text-zinc-400">
                  Select {type === "collection" ? "collections" : type === "product" ? "products" : "segments"} eligible for this discount
                </p>
              </div>
            </div>
            {currentSelection.length > 0 && (
              <Badge className="bg-[#005bd3] text-white font-medium text-[11px] px-2 py-0.5 rounded-[6px]">
                {currentSelection.length} selected
              </Badge>
            )}
          </div>

          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#616161]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${type}s...`}
              className="h-[38px] pl-9 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[13.5px] rounded-[8px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </DialogHeader>

        {/* List of items */}
        <div className="max-h-[340px] overflow-y-auto p-2 divide-y divide-[#f1f2f3] dark:divide-zinc-800">
          {filteredPool.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#616161] dark:text-zinc-400">
              No matching {type}s found.
            </div>
          ) : (
            filteredPool.map((item) => {
              const isSelected = currentSelection.some((i) => i.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item)}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-[8px] cursor-pointer transition-colors select-none",
                    isSelected
                      ? "bg-blue-50/60 dark:bg-blue-950/30 text-[#005bd3] dark:text-blue-300"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  )}
                >
                  {/* Checkbox box */}
                  <div
                    className={cn(
                      "w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center shrink-0 transition-all",
                      isSelected
                        ? "bg-[#005bd3] border-[#005bd3] text-white"
                        : "border-[#8c9196] bg-white dark:bg-zinc-900"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>

                  {/* Thumbnail if product */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-9 h-9 rounded-[6px] object-cover border border-[#d2d5d9] dark:border-zinc-700 shrink-0"
                    />
                  )}

                  {/* Text details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-100 truncate leading-[18px]">
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p className="text-[12px] text-[#616161] dark:text-zinc-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-3 bg-[#f9fafb] dark:bg-zinc-900/60 border-t border-[#d2d5d9] dark:border-zinc-800 flex items-center justify-between sm:justify-between">
          <span className="text-[12.5px] text-[#616161] dark:text-zinc-400">
            {currentSelection.length} {type === "collection" ? "collection" : type}
            {currentSelection.length !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-[36px] px-3.5 text-[13.5px] rounded-[8px] border-[#d2d5d9]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApply}
              className="h-[36px] px-4 text-[13.5px] font-medium rounded-[8px] bg-[#005bd3] hover:bg-[#004bb0] text-white"
            >
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
