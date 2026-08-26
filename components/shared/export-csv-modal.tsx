"use client";

import React, { useState } from "react";
import { Upload, X, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ExportCsvScope = "current" | "all" | "selected" | "matching";
export type ExportCsvFormat = "csv_excel" | "csv_plain";

export interface ExportCsvModalProps {
  /** Controls modal visibility */
  open: boolean;
  onOpenChange: (open: boolean) => void;

  /** Display name for the entity being exported, e.g. "members", "orders" */
  entityName?: string;

  /** Short description shown at the top of the modal */
  description?: string;

  /** Total number of records (shown in "All X" option label) */
  totalCount?: number;

  /** Number of currently-selected rows; hides option when undefined */
  selectedCount?: number;

  /**
   * Number of records matching the current search query.
   * Pass undefined to hide the "matching search" option.
   */
  matchingCount?: number;

  /** Whether the export action is currently submitting/loading */
  loading?: boolean;

  /**
   * Called when the user clicks Export.
   * If scope === "all", the modal automatically shows an email toast instead
   * of calling this callback (you can override via onExportAll).
   */
  onExport?: (scope: ExportCsvScope, format: ExportCsvFormat) => void | Promise<void>;

  /**
   * Optional custom handler specifically for "Export all".
   * If provided, this is called instead of showing the default email toast.
   */
  onExportAll?: (format: ExportCsvFormat) => void | Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal Radio Option
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// ExportCsvModal — reusable export modal
// ─────────────────────────────────────────────────────────────────────────────

export function ExportCsvModal({
  open,
  onOpenChange,
  entityName = "records",
  description,
  totalCount = 0,
  selectedCount,
  matchingCount,
  loading = false,
  onExport,
  onExportAll,
}: ExportCsvModalProps) {
  const [scope, setScope] = useState<ExportCsvScope>("current");
  const [format, setFormat] = useState<ExportCsvFormat>("csv_excel");

  const capitalised =
    entityName.charAt(0).toUpperCase() + entityName.slice(1);

  const handleExport = async () => {
    if (scope === "all") {
      if (onExportAll) {
        await onExportAll(format);
      } else {
        // Default behaviour: show email toast
        toast.success(`CSV will be sent to your email`, {
          description: `Exporting all ${totalCount.toLocaleString()} ${entityName} — we'll email you the file when it's ready.`,
          icon: <Mail className="h-4 w-4" />,
          duration: 5000,
        });
      }
    } else {
      await onExport?.(scope, format);
    }
    onOpenChange(false);
  };

  const exportLabel = `Export ${entityName}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[480px] p-0 gap-0 rounded-xl overflow-hidden border border-border bg-background shadow-xl [&>button]:hidden"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <DialogTitle className="text-[17px] font-semibold text-foreground tracking-tight">
            {exportLabel}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-border" />

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-5">
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description ??
              `This CSV file contains all ${entityName} data. For large exports (All ${entityName}), the file will be sent to your email address.`}
          </p>

          {/* ── Export scope ── */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Export</p>
            <div className="space-y-2.5">
              <RadioOption
                id="scope-current"
                name="export-scope"
                checked={scope === "current"}
                onChange={() => setScope("current")}
                label="Current page"
              />
              <RadioOption
                id="scope-all"
                name="export-scope"
                checked={scope === "all"}
                onChange={() => setScope("all")}
                label={`All ${entityName}${totalCount > 0 ? ` (${totalCount.toLocaleString()})` : ""}`}
              />
              {selectedCount !== undefined && (
                <RadioOption
                  id="scope-selected"
                  name="export-scope"
                  checked={scope === "selected"}
                  onChange={() => setScope("selected")}
                  label={`Selected: ${selectedCount} ${
                    selectedCount !== 1 ? entityName : entityName.replace(/s$/, "")
                  }`}
                  disabled={selectedCount === 0}
                />
              )}
              {matchingCount !== undefined && (
                <RadioOption
                  id="scope-matching"
                  name="export-scope"
                  checked={scope === "matching"}
                  onChange={() => setScope("matching")}
                  label={`${matchingCount.toLocaleString()} ${entityName} matching your search`}
                  disabled={matchingCount === 0}
                />
              )}
            </div>
          </div>

          {/* ── Export format ── */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Export as</p>
            <div className="space-y-2.5">
              <RadioOption
                id="format-csv-excel"
                name="export-format"
                checked={format === "csv_excel"}
                onChange={() => setFormat("csv_excel")}
                label="CSV for Excel, Numbers, or other spreadsheet programs"
              />
              <RadioOption
                id="format-csv-plain"
                name="export-format"
                checked={format === "csv_plain"}
                onChange={() => setFormat("csv_plain")}
                label="Plain CSV file"
              />
            </div>
          </div>

          {/* Inline hint when "All" is selected */}
          {scope === "all" && (
            <div className="flex items-start gap-2.5 rounded-lg bg-muted/60 border border-border px-3.5 py-3">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Because this export is large, a download link will be sent to
                your email once the file is ready.
              </p>
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-border" />

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="h-9 px-4 text-sm font-medium rounded-lg border-border"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            disabled={loading}
            className="h-9 px-4 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 gap-2"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {loading ? "Exporting…" : exportLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
