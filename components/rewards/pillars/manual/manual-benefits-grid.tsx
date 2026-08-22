"use client";

import React from "react";
import { ShieldCheck, Upload, Dices, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { KeyBenefitItem } from "./types";

const keyBenefits: KeyBenefitItem[] = [
  {
    title: "Zero Provider Cost",
    desc: "No third-party fees, markups, or escrow. 100% org-managed.",
    icon: ShieldCheck,
    color: "text-emerald-600 bg-emerald-100/70 dark:bg-emerald-950/60 dark:text-emerald-400",
  },
  {
    title: "Upload Batch CSV",
    desc: "Import thousands of coupon codes dispensed sequentially.",
    icon: Upload,
    color: "text-blue-600 bg-blue-100/70 dark:bg-blue-950/60 dark:text-blue-400",
  },
  {
    title: "Gamification Hooks",
    desc: "Assign to Spin Wheels, Scratch Cards, Match & Win, and Quests.",
    icon: Dices,
    color: "text-purple-600 bg-purple-100/70 dark:bg-purple-950/60 dark:text-purple-400",
  },
  {
    title: "100% Control",
    desc: "Set max limits, expiry timers, tier gates, and fraud rules.",
    icon: Zap,
    color: "text-amber-600 bg-amber-100/70 dark:bg-amber-950/60 dark:text-amber-400",
  },
];

export const ManualBenefitsGrid: React.FC = () => {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
        Key Strategic Benefits
      </span>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {keyBenefits.map((benefit, i) => {
          const Icon = benefit.icon;
          return (
            <div
              key={i}
              className="p-3 rounded-xl border border-border/70 bg-card hover:border-emerald-300/80 dark:hover:border-emerald-700/80 transition-all space-y-1.5 shadow-xs"
            >
              <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", benefit.color)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <h5 className="text-xs font-bold text-foreground leading-tight">
                {benefit.title}
              </h5>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {benefit.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
