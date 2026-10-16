"use client";

import React, { useState } from "react";
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
import { Download, FileSpreadsheet, FileJson } from "lucide-react";
import { MomentCampaign } from "@/graphql/actions/moments/campaigns";
import { toast } from "sonner";

interface ExportCampaignsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaigns: MomentCampaign[];
}

export function ExportCampaignsModal({
  open,
  onOpenChange,
  campaigns,
}: ExportCampaignsModalProps) {
  const [format, setFormat] = useState<"csv" | "json">("csv");

  const handleExport = () => {
    if (format === "csv") {
      const headers = ["ID", "Title", "Slug", "Status", "TotalCompositions", "CreatedDate"];
      const rows = campaigns.map((c) => [
        c.id,
        `"${c.title.replace(/"/g, '""')}"`,
        c.slug,
        c.status,
        c.totalCompositions || 0,
        c.createdAt,
      ]);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `moment-campaigns-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(campaigns, null, 2));
      const link = document.createElement("a");
      link.setAttribute("href", dataStr);
      link.setAttribute("download", `moment-campaigns-${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast.success(`Exported ${campaigns.length} campaigns as ${format.toUpperCase()}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold flex items-center gap-2">
            <Download className="h-4 w-4 text-indigo-600" />
            Export Campaign Analytics
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Download your active and archived Moment Campaigns performance data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">
              Choose Export Format
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setFormat("csv")}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2.5 ${
                  format === "csv"
                    ? "border-indigo-600 bg-indigo-500/5 ring-1 ring-indigo-500/20"
                    : "border-border/60 hover:border-foreground/30"
                }`}
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="text-xs font-semibold text-foreground">CSV Spreadsheet</p>
                  <p className="text-[10px] text-muted-foreground">Excel, Sheets</p>
                </div>
              </div>

              <div
                onClick={() => setFormat("json")}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2.5 ${
                  format === "json"
                    ? "border-indigo-600 bg-indigo-500/5 ring-1 ring-indigo-500/20"
                    : "border-border/60 hover:border-foreground/30"
                }`}
              >
                <FileJson className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-semibold text-foreground">JSON Raw Data</p>
                  <p className="text-[10px] text-muted-foreground">API Telemetry</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleExport}
            className="text-xs bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download {format.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
