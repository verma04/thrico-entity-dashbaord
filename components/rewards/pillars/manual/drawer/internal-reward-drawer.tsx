"use client";

import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Coins, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InternalRewardForm } from "./internal-reward-form";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";

import { ManualRewardItem } from "../table/manual-reward-card";

interface InternalRewardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: ManualRewardItem | null;
  id?: string;
  onSuccess?: () => void;
}

export function InternalRewardDrawer({
  isOpen,
  onClose,
  initialItem,
  id,
  onSuccess,
}: InternalRewardDrawerProps) {
  const { data: currencyData } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyData?.getEntityCurrencyConfig?.currencyName || "Thrico Coins";

  const isEditing = Boolean(initialItem?.id || id);

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
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
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground tracking-tight">
                    {isEditing ? "Edit Internal Voucher Campaign" : "Create Internal Voucher"}
                  </h3>
                  <Badge className="bg-emerald-600 text-white font-bold text-[9px] px-1.5 py-0 uppercase tracking-wider">
                    Pillar 1
                  </Badge>
                  <Badge variant="outline" className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800">
                    {currencyName}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isEditing
                    ? "Update campaign details and settings for this proprietary voucher."
                    : "Issue proprietary vouchers and codes with 1:1 serial pools or 1:N shared campaigns."}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Form Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <InternalRewardForm
            initialItem={initialItem}
            id={id}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
