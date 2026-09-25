"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertTriangle, type LucideIcon } from "lucide-react";
import { HoldToDeleteButton } from "@/components/shared/hold-to-delete-button";
import { cn } from "@/lib/utils";

export interface DangerZoneImpactMetric {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
}

export interface ReusableDangerZoneProps {
  /** Name of the entity type (e.g. "Community", "Survey", "Offer", "Job") */
  entityName: string;
  /** Title or name of the specific instance being deleted */
  entityTitle: string;
  /** Unique ID of the entity */
  entityId?: string;
  /** Primary delete execution callback */
  onDelete: () => void | Promise<void>;
  /** Async loading status */
  loading?: boolean;
  /** Telemetry metrics describing what will be lost upon deletion */
  impactMetrics?: DangerZoneImpactMetric[];
  /** Detailed description of consequences */
  warningDescription?: string;
  /** Time in ms for the user to hold down the button (default: 2000) */
  holdTime?: number;
  /** Require typing the title before finalizing deletion */
  requireTypeMatch?: boolean;
  /** Custom label on the hold button */
  deleteButtonLabel?: string;
  /** Custom label when hold finishes */
  deleteDoneLabel?: string;
  /** Custom CSS container classes */
  className?: string;
}

/**
 * Reusable, production-grade Danger Zone section for deleting dashboard entities.
 * Includes top safety alert, impact telemetry cards, and React Bits liquid Hold-to-Delete button.
 */
export function ReusableDangerZone({
  entityName,
  entityTitle,
  entityId,
  onDelete,
  loading = false,
  impactMetrics = [],
  warningDescription,
  holdTime = 2000,
  requireTypeMatch = true,
  deleteButtonLabel,
  deleteDoneLabel,
  className,
}: ReusableDangerZoneProps) {
  return (
    <div className={cn("max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500", className)}>
      {/* ── Top Warning Banner ─────────────────────────────────────────── */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            <h2 className="text-base font-semibold tracking-tight text-destructive">
              Danger Zone &amp; Irreversible Operations
            </h2>
            <Badge
              variant="destructive"
              className="text-[10px] uppercase tracking-wider px-1.5 py-0 font-bold"
            >
              High Risk
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Administrative destruction actions for &ldquo;{entityTitle}&rdquo;. Once deleted, this entity cannot be recovered.
          </p>
        </div>

        {entityId && (
          <Badge
            variant="outline"
            className="text-xs text-muted-foreground py-1 px-2.5 shrink-0 self-start sm:self-auto border-border/60"
          >
            {entityName} ID: <span className="font-mono text-foreground ml-1">{entityId}</span>
          </Badge>
        )}
      </div>

      {/* ── Impact Telemetry Cards ─────────────────────────────────────── */}
      {impactMetrics.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Entities Affected by Deletion
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {impactMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-destructive/20 bg-card space-y-1 shadow-2xs"
                >
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    {Icon && <Icon className="h-3.5 w-3.5 text-destructive/80" />}
                    {metric.label}
                  </span>
                  <span className="text-2xl font-bold tracking-tight text-foreground block tabular-nums">
                    {typeof metric.value === "number"
                      ? metric.value.toLocaleString()
                      : metric.value}
                  </span>
                  {metric.description && (
                    <p className="text-[10px] text-muted-foreground">
                      {metric.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Main Destruction Action Card ─────────────────────────────────── */}
      <div className="bg-card border border-destructive/30 rounded-xl shadow-2xs overflow-hidden p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-destructive/50 transition-colors">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive" />
            <h4 className="text-sm font-semibold text-destructive">
              Permanently Delete &ldquo;{entityTitle}&rdquo;
            </h4>
          </div>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            {warningDescription ||
              `Completely destroy this ${entityName.toLowerCase()} and its entire history. All associated data, records, permissions, and audit entries will be purged from database shards.`}
          </p>
        </div>

        <div className="shrink-0 self-start sm:self-auto flex items-center gap-2">
          <HoldToDeleteButton
            entityName={entityName}
            entityTitle={entityTitle}
            holdTime={holdTime}
            loading={loading}
            onDelete={onDelete}
            requireTypeMatch={requireTypeMatch}
            label={deleteButtonLabel || `Hold 2s to Delete ${entityName}`}
            doneLabel={deleteDoneLabel || "Deleted"}
          />
        </div>
      </div>
    </div>
  );
}

export default ReusableDangerZone;
