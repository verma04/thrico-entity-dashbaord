"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { UtmCampaignItem } from "@/types/utm";

interface ExportUtmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaigns: UtmCampaignItem[];
}

export function ExportUtmModal({ open, onOpenChange, campaigns }: ExportUtmModalProps) {
  const [includeParams, setIncludeParams] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    try {
      const headers = [
        "Campaign ID",
        "Campaign Name",
        "Destination Type",
        "Destination URL",
        "Source",
        "Medium",
        "Campaign Tag",
        ...(includeParams ? ["Term", "Content"] : []),
        "Generated Tracking URL",
        "Short Code",
        "Status",
        ...(includeTimestamps ? ["Created At", "Updated At"] : []),
      ];

      const rows = campaigns.map((c) => [
        `"${c.id}"`,
        `"${(c.name || "").replace(/"/g, '""')}"`,
        `"${c.destinationType}"`,
        `"${(c.destinationUrl || "").replace(/"/g, '""')}"`,
        `"${c.utmSource}"`,
        `"${c.utmMedium}"`,
        `"${c.utmCampaign}"`,
        ...(includeParams ? [`"${c.utmTerm || ""}"`, `"${c.utmContent || ""}"`] : []),
        `"${(c.generatedUrl || "").replace(/"/g, '""')}"`,
        `"${c.shortCode || ""}"`,
        `"${c.status}"`,
        ...(includeTimestamps ? [`"${c.createdAt}"`, `"${c.updatedAt}"`] : []),
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `utm-campaigns-export-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${campaigns.length} UTM campaigns to CSV`);
      onOpenChange(false);
    } catch {
      toast.error("Failed to generate CSV export");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col justify-between overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          <SheetHeader className="p-0 space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40 shrink-0">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-base font-bold text-foreground truncate">
                  Export UTM Campaigns
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground truncate">
                  Download structured CSV for reporting and audits
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Record Count Card */}
          <div className="p-4 bg-muted/30 border border-border/70 rounded-xl text-xs space-y-2">
            <div className="flex justify-between items-center text-foreground font-semibold">
              <span className="text-muted-foreground">Total Campaigns to Export</span>
              <span className="px-2 py-0.5 rounded-full font-mono font-bold text-xs bg-primary/10 text-primary border border-primary/20">
                {campaigns.length} records
              </span>
            </div>
            <p className="text-[11.5px] text-muted-foreground leading-relaxed">
              All campaign slugs, generated tracking links, destination funnels, and UTM parameters will be formatted into standard RFC-4180 CSV.
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Export Configuration
            </span>

            <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-3">
              <div className="flex items-start space-x-2.5">
                <Checkbox
                  id="includeParams"
                  checked={includeParams}
                  onCheckedChange={(c) => setIncludeParams(!!c)}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <Label htmlFor="includeParams" className="text-xs font-medium cursor-pointer block">
                    Include Optional Parameters
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Exports <code className="font-mono text-[10px]">utm_term</code> and <code className="font-mono text-[10px]">utm_content</code> columns.
                  </p>
                </div>
              </div>

              <div className="h-px bg-border/40" />

              <div className="flex items-start space-x-2.5">
                <Checkbox
                  id="includeTimestamps"
                  checked={includeTimestamps}
                  onCheckedChange={(c) => setIncludeTimestamps(!!c)}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <Label htmlFor="includeTimestamps" className="text-xs font-medium cursor-pointer block">
                    Include Timestamps
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Includes exact creation and modification ISO timestamps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="p-6 pt-3 border-t border-border/60 bg-muted/10 flex sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-9 text-xs font-medium cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 h-9 text-xs gap-1.5 font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            {isExporting ? "Exporting…" : "Download CSV"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
