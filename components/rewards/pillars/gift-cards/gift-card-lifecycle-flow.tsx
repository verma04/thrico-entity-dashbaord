"use client";

import React from "react";

export const GiftCardLifecycleFlow: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: "Entity Deposits Budget",
      desc: "Entity adds ₹50,000 to Thrico Reward Wallet for automated on-win fulfillment.",
      badge: "Prepaid Wallet",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    },
    {
      num: 2,
      title: "Admin Configures Offer",
      desc: "Set ₹500 Amazon card into Spin the Wheel or Scratch Card minigame pool.",
      badge: "Catalog Setup",
      badgeColor: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    },
    {
      num: 3,
      title: "Member Plays & Wins",
      desc: "Member plays minigame: 🎡 Spin / Scratch → Wins digital brand gift card.",
      badge: "Gamification",
      badgeColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300",
    },
    {
      num: 4,
      title: "2-Phase Reservation",
      desc: "Thrico reserves face value + service fee in wallet & sets unique idempotency key.",
      badge: "Engine Lock",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    },
    {
      num: 5,
      title: "Provider Issues Voucher",
      desc: "Connected provider API purchases card: returns voucher code, PIN, & expiry.",
      badge: "Provider API",
      badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
    },
    {
      num: 6,
      title: "Delivered & Balance Sync",
      desc: "Wallet balance deducted automatically. Voucher lands in member's My Rewards vault.",
      badge: "My Rewards",
      badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
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
              <div className="h-5 w-5 rounded-full bg-violet-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
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
