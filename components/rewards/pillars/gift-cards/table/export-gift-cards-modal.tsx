"use client";

import React, { useState } from "react";
import { Download, FileSpreadsheet, Check } from "lucide-react";
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
import { GiftCardRuleItem, GiftCardIssuanceRecord } from "../types";

interface ExportGiftCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: GiftCardRuleItem[];
  ledgerRecords?: GiftCardIssuanceRecord[];
}

export const ExportGiftCardsModal: React.FC<ExportGiftCardsModalProps> = ({
  isOpen,
  onClose,
  rules,
  ledgerRecords = [],
}) => {
  const [exportType, setExportType] = useState<"RULES" | "LEDGER">("RULES");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);

    try {
      if (exportType === "RULES") {
        const headers = [
          "ID",
          "Reward Title",
          "Brand",
          "Category",
          "Denomination (₹)",
          "Service Fee (₹)",
          "Total Cost Per Win (₹)",
          "Validity (Months)",
          "Status",
          "Total Issued",
          "Total Spent (₹)",
          "Created Date",
        ];

        const rows = rules.map((r) => [
          `"${r.id}"`,
          `"${r.title.replace(/"/g, '""')}"`,
          `"${r.brand}"`,
          `"${r.category}"`,
          `"${r.denomination}"`,
          `"${r.serviceFee}"`,
          `"${r.totalCostPerWin}"`,
          `"${r.validityMonths}"`,
          `"${r.isActive ? "Active" : "Inactive"}"`,
          r.totalIssued,
          r.totalSpent,
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
          `thrico-gift-card-rules-${new Date().toISOString().split("T")[0]}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const headers = [
          "Transaction ID",
          "Member Name",
          "Member Email",
          "Brand",
          "Card Value (₹)",
          "Service Fee (₹)",
          "Total Deducted (₹)",
          "Status",
          "Idempotency Key",
          "Game Source",
          "Issued At",
        ];

        const rows = ledgerRecords.map((l) => [
          `"${l.id}"`,
          `"${l.memberName}"`,
          `"${l.memberEmail}"`,
          `"${l.brand}"`,
          `"${l.cardValue}"`,
          `"${l.serviceFee}"`,
          `"${l.totalDeducted}"`,
          `"${l.status}"`,
          `"${l.idempotencyKey}"`,
          `"${l.gameSource}"`,
          `"${l.issuedAt}"`,
        ]);

        const csvContent =
          "data:text/csv;charset=utf-8," +
          [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
          "download",
          `thrico-gift-card-issuance-ledger-${new Date().toISOString().split("T")[0]}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success("Successfully exported CSV report.");
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
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-500/20">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-foreground">
                Export Digital Gift Cards Data
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Download a CSV audit export of rules or live fulfillment transactions.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-4 text-xs">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground block">
              Select Dataset to Export
            </Label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setExportType("RULES")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                  exportType === "RULES"
                    ? "border-violet-600 bg-violet-50/60 dark:bg-violet-950/40 text-foreground ring-1 ring-violet-500/20"
                    : "border-border/70 bg-card hover:bg-muted/30 text-muted-foreground"
                }`}
              >
                <span className="text-xs font-bold block text-foreground">
                  Gift Card Rules ({rules.length})
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Catalog offers, denominations & fees
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExportType("LEDGER")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                  exportType === "LEDGER"
                    ? "border-violet-600 bg-violet-50/60 dark:bg-violet-950/40 text-foreground ring-1 ring-violet-500/20"
                    : "border-border/70 bg-card hover:bg-muted/30 text-muted-foreground"
                }`}
              >
                <span className="text-xs font-bold block text-foreground">
                  Issuance Ledger ({ledgerRecords.length})
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Member wins, idempotency keys & costs
                </span>
              </button>
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
            className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5 text-xs font-semibold h-8 shadow-xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            {isExporting ? "Exporting..." : "Download CSV"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
