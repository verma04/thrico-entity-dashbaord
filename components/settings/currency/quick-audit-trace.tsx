"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ReceiptText, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const recentTransactions = [
  { id: "1", user: "John Doe", type: "TC_DEBIT", amount: 50, timestamp: "2 mins ago" },
  { id: "2", user: "Jane Smith", type: "POINTS_TO_EC", amount: 120, timestamp: "1 hour ago" },
  { id: "3", user: "Bob Wilson", type: "TC_DEBIT", amount: 30, timestamp: "3 hours ago" },
];

const typeLabels: Record<string, string> = {
  TC_DEBIT: "TC Debit",
  POINTS_TO_EC: "Points → EC",
  EC_TO_TC: "EC → TC",
  EC_DEBIT: "EC Debit",
};

export function QuickAuditTrace() {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <ReceiptText className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Quick Audit Trace</p>
            <p className="text-xs text-muted-foreground">Recent currency movements</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-muted-foreground"
          onClick={() => router.push("/currency/audit-log")}
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Transactions */}
      <div className="divide-y divide-border">
        {recentTransactions.map((tx) => {
          const isDebit = tx.type.includes("DEBIT");
          return (
            <div
              key={tx.id}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium text-foreground">{tx.user}</span>
                </div>
                <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-medium">
                  {typeLabels[tx.type] || tx.type}
                </span>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-sm font-bold font-mono",
                  isDebit ? "text-rose-600" : "text-emerald-600"
                )}>
                  {isDebit ? "-" : "+"}{tx.amount}
                </p>
                <p className="text-[10px] text-muted-foreground">{tx.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
