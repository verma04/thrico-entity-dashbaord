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
        className="h-[100dvh] w-screen p-0 border-none outline-none bg-[#f6f6f7] dark:bg-zinc-950 z-50 overflow-hidden flex flex-col"
      >
        {/* Top Navigation & Pull Handle */}
        <div className="border-b border-[#d2d5d9] dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-6 py-3 shrink-0 z-10">
          <div className="w-12 h-1 bg-[#d2d5d9] dark:bg-zinc-700 rounded-full mx-auto mb-2" />

          <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-semibold text-[#303030] dark:text-zinc-100 tracking-tight">
                    {isEditing
                      ? "Edit Internal Voucher Campaign"
                      : "Create Internal Voucher"}
                  </h3>
                  <Badge className="bg-[#303030] text-white font-semibold text-[10px] px-2 py-0 uppercase tracking-wider rounded-[4px]">
                    Pillar 1
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 rounded-[4px]"
                  >
                    {currencyName}
                  </Badge>
                </div>
                <p className="text-[12.5px] text-[#616161] dark:text-zinc-400">
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
              className="h-8 w-8 rounded-[6px] text-[#616161] hover:text-[#303030] hover:bg-[#f6f6f7] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Form Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="max-w-[1280px] mx-auto">
            <InternalRewardForm
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
