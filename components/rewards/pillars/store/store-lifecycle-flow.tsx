"use client";

import React from "react";
import { RefreshCcw } from "lucide-react";

export const StoreLifecycleFlow: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: "Admin Creates Rule",
      desc: "Configure ₹100 OFF with 30-day validity. Zero coupons created in Shopify.",
      badge: "In Thrico",
      badgeColor: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    },
    {
      num: 2,
      title: "User Plays & Wins",
      desc: "User spins wheel or hits achievement: 🎡 Spin → Wins ₹100 OFF reward.",
      badge: "Gamification",
      badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
    },
    {
      num: 3,
      title: "Store PriceRule Call",
      desc: "Thrico invokes Shopify Store API requesting a unique single-use code.",
      badge: "API Synthesis",
      badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
    },
    {
      num: 4,
      title: "Unique Code to Wallet",
      desc: "Shopify returns code (e.g. THRICO-8K4P7X) locked to winning member email.",
      badge: "My Rewards",
      badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    },
    {
      num: 5,
      title: "Shopify Checkout",
      desc: "User applies code on merchant cart. Shopify validates and discounts ₹100.",
      badge: "Store Cart",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    },
    {
      num: 6,
      title: "Order Webhook Reconcile",
      desc: "Shopify order event triggers state transition: Issued → Redeemed in real-time.",
      badge: "Auto Sync",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
      {steps.map((step) => (
        <div
          key={step.num}
          className="p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/30 transition-colors flex flex-col justify-between gap-2 shadow-2xs"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="h-5 w-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                {step.num}
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${step.badgeColor}`}
              >
                {step.badge}
              </span>
            </div>
            <h5 className="text-xs font-bold text-foreground leading-tight">
              {step.title}
            </h5>
            <p className="text-[11px] text-muted-foreground leading-snug">
              {step.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
