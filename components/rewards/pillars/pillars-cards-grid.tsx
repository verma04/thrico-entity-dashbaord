"use client";

import React from "react";
import Link from "next/link";
import {
  Coins,
  ShoppingBag,
  Gift,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PillarsCardsGridProps {
  manualCount?: number;
  storeCount?: number;
  giftCardsCount?: number;
  walletBalance?: number;
  loading?: boolean;
}

export const PillarsCardsGrid: React.FC<PillarsCardsGridProps> = ({
  manualCount = 0,
  storeCount = 0,
  giftCardsCount = 0,
  walletBalance = 0,
  loading = false,
}) => {
  const cards = [
    {
      id: "manual",
      number: "Pillar 1",
      name: "Manual / Internal",
      subtitle: "Vouchers & Coins",
      description:
        "Issue proprietary organization promo codes, batch CSV voucher pools, and coins with zero third-party fees.",
      icon: Coins,
      href: "/gamification/rewards/pillars/manual",
      badge: "Zero Cost",
      stats: [
        { label: "Active Assets", value: manualCount.toString() },
        { label: "Cost Per Win", value: "₹0" },
        { label: "Fulfillment", value: "Instant CSV" },
      ],
      highlights: [
        "Static & Unique Batch Codes",
        "TC & Entity Coins Injection",
        "Event Passes & VIP Tickets",
      ],
      borderHover: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
      btnClass: "bg-primary hover:bg-primary/90 text-primary-foreground",
    },
    {
      id: "store",
      number: "Pillar 2",
      name: "Connected E-Commerce",
      subtitle: "Shopify Discounts",
      description:
        "Dynamically synthesize unique one-time cart discount codes via store API directly when a member wins an interaction.",
      icon: ShoppingBag,
      href: "/gamification/rewards/pillars/store",
      badge: "Merchant Funded",
      stats: [
        { label: "Rules / Codes", value: storeCount.toString() },
        { label: "Conversion Lift", value: "+38%" },
        { label: "Speed", value: "<150ms" },
      ],
      highlights: [
        "Fixed ₹ & % Off Discounts",
        "Minimum Cart Value Conditions",
        "Automatic Expiry & Single-Use",
      ],
      borderHover: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
      iconBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
      badgeBg: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
      btnClass: "bg-primary hover:bg-primary/90 text-primary-foreground",
    },
    {
      id: "giftcards",
      number: "Pillar 3",
      name: "Digital Gift Cards",
      subtitle: "Amazon, Swiggy & Brands",
      description:
        "Deliver instant digital gift cards directly into member reward wallets from the integrated Thrico global brand catalog.",
      icon: Gift,
      href: "/gamification/rewards/pillars/gift-cards",
      badge: "Prepaid Wallet",
      stats: [
        { label: "Active Rules", value: giftCardsCount.toString() },
        { label: "Prepaid Wallet", value: `₹${walletBalance.toLocaleString("en-IN")}` },
        { label: "Inventory Risk", value: "0% (API)" },
      ],
      highlights: [
        "Amazon, Flipkart, Swiggy, Uber",
        "Prepaid Entity Wallet Controls",
        "Direct Claim & Pin Unmasking",
      ],
      borderHover: "hover:border-violet-500/50 hover:shadow-violet-500/10",
      iconBg: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
      badgeBg: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20",
      btnClass: "bg-primary hover:bg-primary/90 text-primary-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            className={cn(
              "group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 transition-all duration-200 shadow-xs hover:shadow-sm",
              card.borderHover
            )}
          >
            {/* Top Section */}
            <div className="space-y-3">
              {/* Header with Icon and Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center border shrink-0 transition-transform duration-200 group-hover:scale-105",
                      card.iconBg
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block leading-none">
                      {card.number}
                    </span>
                    <h3 className="text-xs font-bold text-foreground leading-tight mt-0.5 group-hover:text-primary transition-colors">
                      {card.name}
                    </h3>
                  </div>
                </div>

                <span
                  className={cn(
                    "inline-block text-[8px] font-bold px-1.5 py-0.2 rounded-full border shrink-0",
                    card.badgeBg
                  )}
                >
                  {card.badge}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {card.description}
              </p>

              {/* Stats Box */}
              <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-muted/40 border border-border/50 text-center">
                {card.stats.map((stat, i) => (
                  <div key={i} className="space-y-0.5">
                    <span className="text-[11px] font-extrabold text-foreground block tabular-nums leading-tight truncate">
                      {stat.value}
                    </span>
                    <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-tight block leading-tight truncate">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Capability Checklist */}
              <div className="space-y-1 pt-0.5">
                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Capabilities
                </span>
                <div className="space-y-0.5">
                  {card.highlights.map((hl, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-[10px] font-medium text-foreground/80"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="pt-3 mt-3 border-t border-border/50">
              <Link href={card.href} className="block w-full">
                <Button
                  className={cn(
                    "w-full h-7.5 rounded-lg font-bold text-[11px] gap-1 shadow-2xs transition-all group/btn cursor-pointer",
                    card.btnClass
                  )}
                >
                  Configure {card.name.split(" ")[0]}
                  <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};
