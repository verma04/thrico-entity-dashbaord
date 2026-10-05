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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { EnterpriseLeaderboardConfig } from "@/graphql/actions/enterprise-leaderboard";

interface ExportEnterpriseLeaderboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaderboards: EnterpriseLeaderboardConfig[];
}

export function ExportEnterpriseLeaderboardModal({
  open,
  onOpenChange,
  leaderboards,
}: ExportEnterpriseLeaderboardModalProps) {
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [includeDisplayRules, setIncludeDisplayRules] = useState(true);
  const [includeRankingRules, setIncludeRankingRules] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    if (leaderboards.length === 0) {
      toast.error("No leaderboards to export");
      return;
    }

    setIsExporting(true);
    try {
      const dateStr = new Date().toISOString().slice(0, 10);

      if (format === "json") {
        const jsonData = leaderboards.map((lb) => ({
          id: lb.id,
          name: lb.name,
          code: lb.code,
          description: lb.description || "",
          periodType: lb.periodType,
          status: lb.status,
          defaultPageSize: lb.defaultPageSize,
          maxPageSize: lb.maxPageSize,
          ...(includeRankingRules
            ? {
                rankingRules: {
                  tieBreaker: lb.rankingRules?.tieBreaker || "EARLIEST_ACHIEVED",
                  eligibleTiers: lb.rankingRules?.eligibleTiers || [],
                },
              }
            : {}),
          ...(includeDisplayRules
            ? {
                visibleFields: {
                  showName: lb.visibleFields?.showName ?? true,
                  showAvatar: lb.visibleFields?.showAvatar ?? true,
                  showBadges: lb.visibleFields?.showBadges ?? true,
                  showRankMovement: lb.visibleFields?.showRankMovement ?? true,
                  maskUserName: lb.visibleFields?.maskUserName ?? false,
                },
              }
            : {}),
          ...(includeTimestamps
            ? {
                createdAt: lb.createdAt,
                updatedAt: lb.updatedAt,
              }
            : {}),
        }));

        const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
          type: "application/json;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `enterprise-leaderboards-export-${dateStr}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const headers = [
          "Leaderboard ID",
          "Name",
          "Code Slug",
          "Description",
          "Period Type",
          "Status",
          "Default Page Size",
          "Max Page Size",
          ...(includeRankingRules ? ["Tie Breaker", "Eligible Tiers"] : []),
          ...(includeDisplayRules
            ? ["Show Name", "Show Avatar", "Show Badges", "Show Rank Movement", "Mask Username"]
            : []),
          ...(includeTimestamps ? ["Created At", "Updated At"] : []),
        ];

        const rows = leaderboards.map((lb) => [
          `"${lb.id}"`,
          `"${(lb.name || "").replace(/"/g, '""')}"`,
          `"${lb.code}"`,
          `"${(lb.description || "").replace(/"/g, '""')}"`,
          `"${lb.periodType}"`,
          `"${lb.status}"`,
          lb.defaultPageSize ?? 10,
          lb.maxPageSize ?? 50,
          ...(includeRankingRules
            ? [
                `"${lb.rankingRules?.tieBreaker || "EARLIEST_ACHIEVED"}"`,
                `"${(lb.rankingRules?.eligibleTiers || []).join(";")}"`,
              ]
            : []),
          ...(includeDisplayRules
            ? [
                lb.visibleFields?.showName !== false ? "YES" : "NO",
                lb.visibleFields?.showAvatar !== false ? "YES" : "NO",
                lb.visibleFields?.showBadges !== false ? "YES" : "NO",
                lb.visibleFields?.showRankMovement !== false ? "YES" : "NO",
                lb.visibleFields?.maskUserName ? "YES" : "NO",
              ]
            : []),
          ...(includeTimestamps ? [`"${lb.createdAt}"`, `"${lb.updatedAt}"`] : []),
        ]);

        const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `enterprise-leaderboards-export-${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success(
        `Exported ${leaderboards.length} leaderboard${leaderboards.length === 1 ? "" : "s"} to ${format.toUpperCase()}`
      );
      onOpenChange(false);
    } catch {
      toast.error("Failed to generate export file");
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
                  Export Enterprise Leaderboards
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground truncate">
                  Download configurations, slugs, and rule definitions
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Export Settings */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Export Format</Label>
              <Select value={format} onValueChange={(val: "csv" | "json") => setFormat(val)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv" className="text-xs">
                    CSV (Spreadsheet compatible)
                  </SelectItem>
                  <SelectItem value="json" className="text-xs">
                    JSON (Developer & API snapshot)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3.5 rounded-lg border border-border/80 bg-muted/30 space-y-3">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Include Data Columns
              </span>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-display"
                  checked={includeDisplayRules}
                  onCheckedChange={(checked) => setIncludeDisplayRules(!!checked)}
                />
                <Label htmlFor="include-display" className="text-xs font-medium cursor-pointer">
                  Display Preferences & Anonymity Masks
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-ranking"
                  checked={includeRankingRules}
                  onCheckedChange={(checked) => setIncludeRankingRules(!!checked)}
                />
                <Label htmlFor="include-ranking" className="text-xs font-medium cursor-pointer">
                  Ranking Tie-Breakers & Tier Eligibility
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-timestamps"
                  checked={includeTimestamps}
                  onCheckedChange={(checked) => setIncludeTimestamps(!!checked)}
                />
                <Label htmlFor="include-timestamps" className="text-xs font-medium cursor-pointer">
                  Creation & Last Modified Timestamps
                </Label>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border/60">
              <span className="font-semibold text-foreground">
                Exporting {leaderboards.length} leaderboard{leaderboards.length === 1 ? "" : "s"}
              </span>
              . Sensitive API keys and authentication secrets are automatically excluded from the export.
            </div>
          </div>
        </div>

        <SheetFooter className="p-4 border-t border-border bg-muted/20 flex flex-row justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            disabled={isExporting || leaderboards.length === 0}
            className="h-8 gap-1.5 text-xs font-medium bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            {isExporting ? "Exporting…" : `Download ${format.toUpperCase()}`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default ExportEnterpriseLeaderboardModal;
