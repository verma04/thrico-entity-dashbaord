"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Mail, Loader2, Trophy, History } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { safeFormat } from "@/lib/date-utils";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import {
  useExportTopReferrals,
  useExportReferrals,
  ExportFormat,
} from "@/graphql/actions/export";
import type {
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";

export type ReferralExportType = "top" | "history";

export interface SelectedReferrerInfo {
  id?: string;
  name?: string;
  email?: string;
}

export interface ExportReferralsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: ReferralExportType;
  topReferrers?: any[];
  totalActiveReferrers: number;
  referrals?: any[];
  totalReferralsCount: number;
  selectedReferrer?: SelectedReferrerInfo | null;
  searchQuery?: string;
  onSuccess?: () => void;
}

function RadioOption({
  id,
  name,
  checked,
  onChange,
  label,
  disabled,
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-3 select-none group ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div className="relative flex-shrink-0">
        <input
          type="radio"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`h-[18px] w-[18px] rounded-full border-2 transition-all duration-150 flex items-center justify-center ${
            checked
              ? "border-foreground"
              : "border-border group-hover:border-muted-foreground"
          }`}
        >
          {checked && (
            <div className="h-[9px] w-[9px] rounded-full bg-foreground" />
          )}
        </div>
      </div>
      <span
        className={`text-sm leading-snug ${
          disabled ? "text-muted-foreground" : "text-foreground"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

export function ExportReferralsModal({
  open,
  onOpenChange,
  defaultType = "top",
  topReferrers = [],
  totalActiveReferrers = 0,
  referrals = [],
  totalReferralsCount = 0,
  selectedReferrer,
  searchQuery,
  onSuccess,
}: ExportReferralsModalProps) {
  const [exportType, setExportType] = useState<ReferralExportType>(defaultType);
  const [scope, setScope] = useState<ExportCsvScope>("current");
  const [format, setFormat] = useState<ExportCsvFormat>("csv_excel");

  const [exportTopReferralsMutation, { loading: topLoading }] =
    useExportTopReferrals();
  const [exportReferralsMutation, { loading: referralsLoading }] =
    useExportReferrals();

  const isSubmitting = topLoading || referralsLoading;

  useEffect(() => {
    if (open) {
      setExportType(defaultType);
      setScope("current");
    }
  }, [open, defaultType]);

  const handleExportTopReferrersLocal = (exportFormat: ExportCsvFormat) => {
    if (topReferrers.length === 0) {
      toast.error("Nothing to export", {
        description: "No top referrer records available to export.",
      });
      return;
    }

    const csv = buildCsv(
      topReferrers,
      [
        {
          header: "Rank",
          getValue: (_r: any, idx?: number) => String((idx ?? 0) + 1),
        },
        {
          header: "Member ID",
          getValue: (r: any) => r.referrer?.user?.id || "",
        },
        {
          header: "Member First Name",
          getValue: (r: any) => r.referrer?.user?.firstName || "",
        },
        {
          header: "Member Last Name",
          getValue: (r: any) => r.referrer?.user?.lastName || "",
        },
        {
          header: "Email",
          getValue: (r: any) => r.referrer?.user?.email || "",
        },
        {
          header: "Referral Code",
          getValue: (r: any) => r.referrer?.user?.referralCode || "",
        },
        {
          header: "Successful Referrals Count",
          getValue: (r: any) => r.referralsCount ?? 0,
        },
        {
          header: "Status",
          getValue: (r: any) => r.referrer?.status || "ACTIVE",
        },
        {
          header: "Verified",
          getValue: (r: any) =>
            r.referrer?.verification?.isVerified ? "Yes" : "No",
        },
        {
          header: "Joined Date",
          getValue: (r: any) =>
            safeFormat(r.referrer?.user?.createdAt, "yyyy-MM-dd", ""),
        },
      ],
    );

    downloadCsv(
      csv,
      `top-referrals-${new Date().toISOString().slice(0, 10)}`,
      exportFormat,
    );
    toast.success("Export ready", {
      description: `${topReferrers.length} top referrer${topReferrers.length !== 1 ? "s" : ""} exported.`,
    });
  };

  const handleExportTimelineLocal = (exportFormat: ExportCsvFormat) => {
    if (referrals.length === 0) {
      toast.error("Nothing to export", {
        description: "No referral records available to export.",
      });
      return;
    }

    const csv = buildCsv(
      referrals,
      [
        {
          header: "Referrer First Name",
          getValue: (r: any) => r.referrer?.user?.firstName || "",
        },
        {
          header: "Referrer Last Name",
          getValue: (r: any) => r.referrer?.user?.lastName || "",
        },
        {
          header: "Referrer Email",
          getValue: (r: any) => r.referrer?.user?.email || "",
        },
        {
          header: "Referee First Name",
          getValue: (r: any) => r.referee?.user?.firstName || "",
        },
        {
          header: "Referee Last Name",
          getValue: (r: any) => r.referee?.user?.lastName || "",
        },
        {
          header: "Referee Email",
          getValue: (r: any) => r.referee?.user?.email || "",
        },
        {
          header: "Referee Status",
          getValue: (r: any) => (r.referee?.isApproved ? "Active" : "Pending"),
        },
        {
          header: "Joined Date",
          getValue: (r: any) =>
            safeFormat(r.referee?.user?.createdAt, "yyyy-MM-dd", ""),
        },
      ],
    );

    const suffix = selectedReferrer?.name
      ? `-${selectedReferrer.name.toLowerCase().replace(/\s+/g, "-")}`
      : "";
    downloadCsv(
      csv,
      `referral-history${suffix}-${new Date().toISOString().slice(0, 10)}`,
      exportFormat,
    );
    toast.success("Export ready", {
      description: `${referrals.length} referral${referrals.length !== 1 ? "s" : ""} exported.`,
    });
  };

  const handleExportAsync = async () => {
    try {
      if (exportType === "top") {
        const res = await exportTopReferralsMutation({
          variables: {
            input: {
              limit: 500,
              format: format as ExportFormat,
            },
          },
        });

        if (res.data?.exportTopReferrals?.success) {
          toast.success("CSV will be sent to your email", {
            description:
              res.data.exportTopReferrals.message ||
              `Exporting top referrers leaderboard — you and community administrators will receive an email once complete.`,
            icon: <Mail className="h-4 w-4" />,
            duration: 5000,
          });
          onSuccess?.();
          onOpenChange(false);
        } else {
          toast.error("Export failed", {
            description:
              res.data?.exportTopReferrals?.message ||
              "Could not start top referrals export.",
          });
        }
      } else {
        const res = await exportReferralsMutation({
          variables: {
            input: {
              format: format as ExportFormat,
              referrerId: selectedReferrer?.id || undefined,
              search: searchQuery?.trim() || undefined,
            },
          },
        });

        if (res.data?.exportReferrals?.success) {
          toast.success("CSV will be sent to your email", {
            description:
              res.data.exportReferrals.message ||
              `Exporting referral timeline history — you and community administrators will receive an email once complete.`,
            icon: <Mail className="h-4 w-4" />,
            duration: 5000,
          });
          onSuccess?.();
          onOpenChange(false);
        } else {
          toast.error("Export failed", {
            description:
              res.data?.exportReferrals?.message ||
              "Could not start referral timeline export.",
          });
        }
      }
    } catch (err: any) {
      toast.error("Export failed", {
        description:
          err?.message || "Something went wrong while initiating the export.",
      });
    }
  };

  const handleExport = async () => {
    if (scope === "all") {
      await handleExportAsync();
    } else {
      if (exportType === "top") {
        handleExportTopReferrersLocal(format);
      } else {
        handleExportTimelineLocal(format);
      }
      onOpenChange(false);
    }
  };

  const isTop = exportType === "top";
  const entityTitle = isTop
    ? "Top Referrals Leaderboard"
    : "Referral Timeline History";
  const totalCount = isTop ? totalActiveReferrers : totalReferralsCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 rounded-xl overflow-hidden border border-border bg-background shadow-xl [&>button]:hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <DialogTitle className="text-[17px] font-semibold text-foreground tracking-tight">
            Export Referrals
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Tabs Selector ── */}
        <div className="px-6 pb-2">
          <div className="grid grid-cols-2 p-1 bg-muted/60 dark:bg-zinc-800/60 rounded-lg border border-border/50 text-xs">
            <button
              type="button"
              onClick={() => setExportType("top")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition-all",
                isTop
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Trophy className="h-3.5 w-3.5" />
              Leaderboard
            </button>
            <button
              type="button"
              onClick={() => setExportType("history")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition-all",
                !isTop
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <History className="h-3.5 w-3.5" />
              Timeline History
            </button>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-border mt-2" />

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-5">
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {entityTitle}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isTop
                ? "Export ranked members by referral invitation volume, including contact info, referral codes, and activity status."
                : "Export chronological attribution records linking referrers to invited referees, including verification and timestamps."}
            </p>
          </div>

          {!isTop && selectedReferrer && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                Filtered Referrer:
              </span>
              <span className="text-zinc-900 dark:text-zinc-100 font-bold truncate">
                {selectedReferrer.name || selectedReferrer.email}
              </span>
            </div>
          )}

          {/* ── Export scope ── */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Export</p>
            <div className="space-y-2.5">
              <RadioOption
                id="scope-current"
                name="export-scope"
                checked={scope === "current"}
                onChange={() => setScope("current")}
                label={
                  isTop
                    ? `Current page (${topReferrers.length} visible referrers)`
                    : `Current view (${referrals.length} visible events)`
                }
              />
              <RadioOption
                id="scope-all"
                name="export-scope"
                checked={scope === "all"}
                onChange={() => setScope("all")}
                label={
                  isTop
                    ? `All top referrers (${totalCount.toLocaleString()} members)`
                    : `All referral records (${totalCount.toLocaleString()} connections)`
                }
              />
            </div>
          </div>

          {/* ── Export format ── */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Export as</p>
            <div className="space-y-2.5">
              <RadioOption
                id="format-excel"
                name="export-format"
                checked={format === "csv_excel"}
                onChange={() => setFormat("csv_excel")}
                label="CSV for Excel, Numbers, or other spreadsheet programs"
              />
              <RadioOption
                id="format-plain"
                name="export-format"
                checked={format === "csv_plain"}
                onChange={() => setFormat("csv_plain")}
                label="Plain CSV file"
              />
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-border" />

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-muted/30">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="text-xs h-8"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            disabled={isSubmitting}
            className="text-xs h-8 min-w-[90px] font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Exporting...
              </>
            ) : scope === "all" ? (
              <>
                <Mail className="h-3.5 w-3.5 mr-1.5" />
                Email CSV
              </>
            ) : (
              "Export"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
