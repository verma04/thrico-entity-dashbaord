"use client";

import React from "react";
import { FileSpreadsheet, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ManualVoucherStatus } from "@/graphql/actions/rewards/manual";
import { MockVoucherItem } from "./types";

interface ManualPoolInspectorProps {
  vouchers: MockVoucherItem[];
  statusFilter: string;
  onFilterChange: (filter: string) => void;
  copiedCode: string | null;
  onCopyCode: (code: string) => void;
  onRedeem: (id: string) => void;
  onVoid: (id: string) => void;
}

const getStatusBadge = (status: ManualVoucherStatus) => {
  switch (status) {
    case ManualVoucherStatus.UNASSIGNED:
      return (
        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 px-1.5 py-0.5 rounded">
          UNASSIGNED
        </span>
      );
    case ManualVoucherStatus.ASSIGNED:
      return (
        <span className="text-[9px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 px-1.5 py-0.5 rounded">
          ASSIGNED
        </span>
      );
    case ManualVoucherStatus.REDEEMED:
      return (
        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 px-1.5 py-0.5 rounded">
          REDEEMED
        </span>
      );
    case ManualVoucherStatus.EXPIRED:
      return (
        <span className="text-[9px] font-bold text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 px-1.5 py-0.5 rounded">
          EXPIRED
        </span>
      );
    case ManualVoucherStatus.VOID:
      return (
        <span className="text-[9px] font-bold text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 px-1.5 py-0.5 rounded">
          VOID
        </span>
      );
  }
};

export const ManualPoolInspector: React.FC<ManualPoolInspectorProps> = ({
  vouchers,
  statusFilter,
  onFilterChange,
  copiedCode,
  onCopyCode,
  onRedeem,
  onVoid,
}) => {
  return (
    <Card className="border-border/70 shadow-xs h-full flex flex-col justify-between">
      <CardHeader className="p-3.5 pb-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            Live Pool Inspector ({vouchers.length} Records)
          </span>
          <div className="flex items-center gap-1">
            {["ALL", "UNASSIGNED", "ASSIGNED", "REDEEMED"].map((st) => (
              <button
                key={st}
                onClick={() => onFilterChange(st)}
                className={cn(
                  "text-[9px] font-semibold px-1.5 py-0.5 rounded transition-all",
                  statusFilter === st
                    ? "bg-emerald-600 text-white"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 pt-0 space-y-2">
        <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
          {vouchers.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No vouchers match the selected filter.
            </div>
          ) : (
            vouchers.map((item) => (
              <div
                key={item.id}
                className="p-2 rounded-lg border border-border/70 bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-2 text-[11px]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono font-bold text-foreground truncate select-all">
                    {item.code}
                  </span>
                  {getStatusBadge(item.status)}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.assignedTo && (
                    <span className="text-[10px] text-muted-foreground hidden sm:inline truncate max-w-[120px]">
                      {item.assignedTo}
                    </span>
                  )}

                  <button
                    onClick={() => onCopyCode(item.code)}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="Copy Code"
                  >
                    {copiedCode === item.code ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>

                  {item.status === ManualVoucherStatus.ASSIGNED && (
                    <button
                      onClick={() => onRedeem(item.id)}
                      className="text-[9px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-200"
                      title="Mark Redeemed"
                    >
                      Redeem
                    </button>
                  )}

                  {item.status !== ManualVoucherStatus.VOID &&
                    item.status !== ManualVoucherStatus.REDEEMED && (
                      <button
                        onClick={() => onVoid(item.id)}
                        className="text-[9px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded border border-rose-200"
                        title="Void Code"
                      >
                        Void
                      </button>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
