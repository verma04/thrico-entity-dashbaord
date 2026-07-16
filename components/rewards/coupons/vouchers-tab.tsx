import React from "react";
import { Ticket, CheckCircle2, History, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { VoucherManagementTable } from "@/components/rewards/inventory/voucher-management-table";
import { Voucher } from "./types";

interface VouchersTabProps {
  totalVouchers: number;
  usedVouchers: number;
  availableVouchers: number;
  expiringSoon: number;
  utilRate: number;
  vouchers: Voucher[];
  vouchersLoading: boolean;
  onViewDetails: (v: Voucher) => void;
  onMarkAsUsed: (voucherId: string) => Promise<void>;
  onDelete: (voucherId: string) => Promise<void>;
}

export function VouchersTab({
  totalVouchers,
  usedVouchers,
  availableVouchers,
  expiringSoon,
  utilRate,
  vouchers,
  vouchersLoading,
  onViewDetails,
  onMarkAsUsed,
  onDelete,
}: VouchersTabProps) {
  return (
    <div className="px-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {[
          {
            label: "Total Capacity",
            value: totalVouchers,
            icon: Ticket,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            desc: "Digital Assets Logged",
          },
          {
            label: "Market Ready",
            value: availableVouchers,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            desc: "Available for Emission",
          },
          {
            label: "Redemption Flow",
            value: usedVouchers,
            icon: History,
            color: "text-slate-600",
            bg: "bg-slate-50",
            desc: `${utilRate}% Consumption`,
          },
          {
            label: "Critical Expiry",
            value: expiringSoon,
            icon: AlertTriangle,
            color: expiringSoon > 0 ? "text-rose-600" : "text-zinc-400",
            bg: expiringSoon > 0 ? "bg-rose-50" : "bg-zinc-50",
            desc: expiringSoon > 0 ? "T-Minus 7 Days" : "No Impending Expiry",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/[0.02]"
          >
            <div
              className={cn(
                "h-11 w-11 rounded-xl flex items-center justify-center border border-border/40 shrink-0 shadow-inner",
                s.bg,
              )}
            >
              <s.icon className={cn("h-5 w-5", s.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate">
                {s.label}
              </p>
              <p className="text-2xl font-black text-foreground tabular-nums leading-none mt-1">
                {s.value}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground/60 truncate mt-1">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {totalVouchers > 0 && (
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-foreground uppercase tracking-widest">
                Inventory Saturation
              </span>
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            </div>
            <span className="text-[11px] font-bold text-muted-foreground tabular-nums">
              {usedVouchers} OF {totalVouchers} CONSUMED ({utilRate}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                utilRate >= 85
                  ? "bg-rose-500"
                  : utilRate >= 60
                    ? "bg-amber-500"
                    : "bg-indigo-600",
              )}
              style={{ width: `${utilRate}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <VoucherManagementTable
          vouchers={vouchers}
          isLoading={vouchersLoading}
          onViewDetails={onViewDetails}
          onMarkAsUsed={onMarkAsUsed}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
