"use client";

import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ShoppingBag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StoreRewardForm } from "./store-reward-form";
import { StoreRewardItem } from "../types";

interface StoreRewardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: StoreRewardItem | null;
  id?: string;
  onSuccess?: (createdItem: StoreRewardItem) => void;
}

export function StoreRewardDrawer({
  isOpen,
  onClose,
  initialItem,
  id,
  onSuccess,
}: StoreRewardDrawerProps) {
  const isEditing = Boolean(initialItem?.id || id);

  const handleSuccess = (item?: StoreRewardItem) => {
    if (onSuccess && item) onSuccess(item);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="top"
        className="h-[100dvh] w-screen p-0 border-none outline-none bg-[#f6f6f7] dark:bg-zinc-950 z-50 overflow-hidden flex flex-col"
      >
        {/* Top Navigation & Pull Handle */}
        <div className="border-b border-[#d2d5d9] dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-6 py-3 shrink-0 z-10">
          <div className="w-12 h-1 bg-[#d2d5d9] dark:bg-zinc-700 rounded-full mx-auto mb-2" />

          <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-[8px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-semibold text-[#303030] dark:text-zinc-100 tracking-tight">
                    {isEditing
                      ? "Edit Store Discount Rule"
                      : "Create Store Discount Rule"}
                  </h3>
                  <Badge className="bg-[#303030] text-white font-semibold text-[10px] px-2 py-0 uppercase tracking-wider rounded-[4px]">
                    Pillar 2 • Shopify
                  </Badge>
                </div>
                <p className="text-[12.5px] text-[#616161] dark:text-zinc-400">
                  {isEditing
                    ? "Update discount conditions & rules for this e-commerce reward blueprint."
                    : "Define discount conditions & rules in Thrico. Unique single-use coupons are synthesized in Shopify only when a member wins or redeems."}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-[6px] text-[#616161] hover:text-[#303030] hover:bg-[#f6f6f7] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Form Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="max-w-[1280px] mx-auto">
            <StoreRewardForm
              initialItem={initialItem}
              id={id}
              onSuccess={handleSuccess}
              onCancel={onClose}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
