"use client";

import React, { useState } from "react";
import { Download, FileSpreadsheet, Check, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { StoreRewardItem } from "../types";

interface ExportStoreRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: StoreRewardItem[];
}

export const ExportStoreRewardsModal: React.FC<ExportStoreRewardsModalProps> = ({
  isOpen,
  onClose,
  rewards,
}) => {
  const [includeStats, setIncludeStats] = useState(true);
  const [includeConditions, setIncludeConditions] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);

    try {
      const headers = [
        "ID",
        "Offer Title",
        "Discount Type",
        "Discount Value",
        "Minimum Cart Subtotal",
        "Code Prefix",
        "Connected Shopify Domain",
        "Single Use Lock",
        "Validity (Days)",
        "Status",
        ...(includeStats ? ["Total Allocated", "Total Redeemed"] : []),
        "Created Date",
      ];

      const rows = rewards.map((r) => [
        `"${r.id}"`,
        `"${r.title.replace(/"/g, '""')}"`,
        `"${r.discountType}"`,
        `"${r.discountValue}"`,
        `"${r.minCartSubtotal || 0}"`,
        `"${r.codePrefix}"`,
        `"${r.connectedDomain}"`,
        `"${r.singleUsePerCustomer ? "Yes" : "No"}"`,
        `"${r.validityDays}"`,
        `"${r.isActive ? "Active" : "Inactive"}"`,
        ...(includeStats ? [r.totalAllocated, r.totalRedeemed] : []),
        `"${r.createdAt}"`,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `shopify-store-discounts-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(
        `Successfully exported ${rewards.length} store reward rules to CSV.`
      );
      onClose();
    } catch (err) {
      toast.error("Failed to export CSV. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden border-border/80 shadow-lg">
        <DialogHeader className="p-5 pb-3 bg-muted/20 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-foreground">
                Export Store Discount Rules
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Download a CSV snapshot of all Shopify discount configurations.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-300">
            Exporting <strong>{rewards.length} store reward rules</strong> with active on-demand Shopify PriceRule configuration parameters.
          </div>

          <div className="space-y-3 pt-1">
            <Label className="text-xs font-bold text-foreground block">
              Included Metadata Columns
            </Label>

            <div className="space-y-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <Checkbox
                  checked={includeStats}
                  onCheckedChange={(c) => setIncludeStats(!!c)}
                />
                <span className="text-xs text-foreground font-medium">
                  Allocation & Redemption Counters
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <Checkbox
                  checked={includeConditions}
                  onCheckedChange={(c) => setIncludeConditions(!!c)}
                />
                <span className="text-xs text-foreground font-medium">
                  Cart Subtotals & Expiry Rules
                </span>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 bg-muted/20 border-t border-border/60 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-medium h-8 shadow-2xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            {isExporting ? "Exporting..." : "Download CSV"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
