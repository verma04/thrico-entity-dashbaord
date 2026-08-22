"use client";

import React from "react";
import { Zap, ShoppingBag, ShieldCheck, Clock, RefreshCcw } from "lucide-react";

export const StoreBenefitsGrid: React.FC = () => {
  const benefits = [
    {
      title: "Zero Batch Pollution",
      desc: "No cluttering of thousands of unused coupons inside Shopify Admin.",
      icon: Zap,
    },
    {
      title: "Automated PriceRules",
      desc: "Instant dynamic synthesis with precise start/end validity windows.",
      icon: ShoppingBag,
    },
    {
      title: "1:1 Customer Binding",
      desc: "Codes locked to winning member email for fraud-proof redemption.",
      icon: ShieldCheck,
    },
    {
      title: "Urgency Expiry Timers",
      desc: "Custom expiration triggers induce rapid checkout conversion.",
      icon: Clock,
    },
    {
      title: "Orders Webhook Sync",
      desc: "Shopify checkout webhook auto-reconciles wallet redemptions in real-time.",
      icon: RefreshCcw,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
      {benefits.map((b, idx) => {
        const Icon = b.icon;
        return (
          <div
            key={idx}
            className="p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/40 transition-colors space-y-1.5"
          >
            <div className="h-6 w-6 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <h5 className="text-xs font-bold text-foreground leading-tight">
              {b.title}
            </h5>
            <p className="text-[10px] text-muted-foreground leading-snug">
              {b.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
};
