"use client";

import React from "react";
import { Ticket, Layers, Coins, Award, Calendar, Sparkles, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { RewardExampleItem } from "./types";

interface ManualAssetClassesProps {
  copiedCode: string | null;
  onCopyCode: (code: string) => void;
}

export const ManualAssetClasses: React.FC<ManualAssetClassesProps> = ({
  copiedCode,
  onCopyCode,
}) => {
  const { data: currencyData } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyData?.getEntityCurrencyConfig?.currencyName || "TC";

  const rewardExamples: RewardExampleItem[] = [
    {
      type: "Static Promo Codes",
      desc: "Fixed discount strings usable by multiple members.",
      icon: Ticket,
      code: "WELCOME2026",
      tag: "ONE_TO_MANY",
      color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
    },
    {
      type: "Voucher Batches",
      desc: "Pre-generated single-use serials uploaded via CSV.",
      icon: Layers,
      code: "VCH-8942-AX9",
      tag: "ONE_TO_ONE",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    {
      type: `${currencyName} & Entity Coins`,
      desc: "Platform tokens or branded community currency.",
      icon: Coins,
      code: `+250 ${currencyName}`,
      tag: "Currency",
      color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
    },
    {
      type: "Badges & Ranks",
      desc: "Prestige unlocks, role upgrades, achievements.",
      icon: Award,
      code: "VIP Champion",
      tag: "Status",
      color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
    },
    {
      type: "Event Tickets & Passes",
      desc: "Exclusive access passes and webinar entry tokens.",
      icon: Calendar,
      code: "PASS-CON-2026",
      tag: "Pass",
      color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
    },
    {
      type: "Internal Offers & Perks",
      desc: "1-on-1 consultations and custom founder perks.",
      icon: Sparkles,
      code: "1-on-1 Session",
      tag: "Perk",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300",
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          Supported Internal Asset Types
        </span>
        <Badge variant="secondary" className="text-[10px] h-5 px-2">
          6 Asset Classes
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {rewardExamples.map((ex, i) => {
          const Icon = ex.icon;
          const isCopied = copiedCode === ex.code;

          return (
            <div
              key={i}
              className="rounded-xl border border-border/70 bg-card p-3 hover:shadow-xs transition-all flex flex-col justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center text-foreground shrink-0">
                      <Icon className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-bold text-foreground truncate">
                      {ex.type}
                    </span>
                  </div>
                  <span className={cn("text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase", ex.color)}>
                    {ex.tag}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {ex.desc}
                </p>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-md bg-muted/40 border border-border/40 text-[11px] font-mono">
                <span className="truncate text-foreground/80 font-medium select-all">
                  {ex.code}
                </span>
                <button
                  onClick={() => onCopyCode(ex.code)}
                  className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground transition-colors ml-1 shrink-0"
                  title="Copy code"
                >
                  {isCopied ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
