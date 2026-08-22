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
  onSuccess?: (createdItem: StoreRewardItem) => void;
}

export function StoreRewardDrawer({
  isOpen,
  onClose,
  onSuccess,
}: StoreRewardDrawerProps) {
  const handleSuccess = (createdItem: StoreRewardItem) => {
    if (onSuccess) onSuccess(createdItem);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="top"
        className="h-[100dvh] w-screen p-0 border-none outline-none bg-background dark:bg-zinc-950 z-50 overflow-hidden flex flex-col"
      >
        {/* Top Navigation & Pull Handle */}
        <div className="border-b border-border/80 bg-card/95 backdrop-blur-md px-6 py-3.5 shrink-0 z-10">
          <div className="w-12 h-1 bg-muted-foreground/25 rounded-full mx-auto mb-3" />

          <div className="max-w-[1040px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground tracking-tight">
                    Create Store Discount Rule
                  </h3>
                  <Badge className="bg-indigo-600 text-white font-bold text-[9px] px-1.5 py-0 uppercase tracking-wider">
                    Pillar 2 • Shopify
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Define discount conditions & rules in Thrico. Unique single-use coupons are synthesized in Shopify only when a member wins or redeems.
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Form Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <StoreRewardForm onSuccess={handleSuccess} onCancel={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
