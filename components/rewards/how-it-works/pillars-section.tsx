"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ticket,
  ShoppingBag,
  Gift,
  Coins,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PILLARS_DATA = [
  {
    id: "pillar-1",
    pillarNumber: "Pillar 1",
    title: "Internal Vouchers",
    code: "INTERNAL_VOUCHER",
    icon: Ticket,
    color: "emerald",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    headline: "Zero marginal cost promotional voucher pools",
    summary: "Upload pre-generated lists of promo codes, ticket barcodes, or partner discount keys via CSV. Thrico assigns available codes sequentially upon member claim.",
    benefits: [
      "No direct entity cash expenditure required",
      "Instant sequential allocation on member claim",
      "Full encrypted credential audit trail",
      "Supports external partner sponsorships & event passes",
    ],
    useCases: ["Event passes & VIP tickets", "Partner affiliate promo codes", "Custom merchandise coupons", "Software license keys"],
    route: "/gamification/rewards/pillars/manual",
    actionLabel: "Manage Voucher Batches",
  },
  {
    id: "pillar-2",
    pillarNumber: "Pillar 2",
    title: "E-Commerce Store Discounts",
    code: "STORE_DISCOUNT",
    icon: ShoppingBag,
    color: "indigo",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    gradient: "from-indigo-500/10 via-indigo-500/5 to-transparent",
    accentBorder: "border-indigo-500/30 hover:border-indigo-500/60",
    headline: "Live Shopify & WooCommerce checkout coupons",
    summary: "Automatically generates genuine single-use discount coupons on your connected online store when a member wins or claims a reward, driving direct merchandise revenue.",
    benefits: [
      "Direct API creation with zero manual code entry",
      "Configurable percentage off (e.g. 20%) or fixed amounts (e.g. $10 off)",
      "Optional customer email locking prevents coupon leaks",
      "Minimum cart subtotal and usage limits ensure positive ROI",
    ],
    useCases: ["20% off community merch store", "$15 off apparel order", "Free shipping on orders above $50", "Storewide holiday shopping perks"],
    route: "/gamification/rewards/pillars/store",
    actionLabel: "Configure Store Discount Rules",
  },
  {
    id: "pillar-3",
    pillarNumber: "Pillar 3",
    title: "Brand Digital Gift Cards",
    code: "DIGITAL_GIFT_CARD",
    icon: Gift,
    color: "purple",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
    accentBorder: "border-purple-500/30 hover:border-purple-500/60",
    headline: "Instant Amazon, Starbucks, Apple, and Uber vouchers",
    summary: "Real-world brand digital gift cards provisioned on-demand via integrated enterprise provider APIs. Funded seamlessly through your prepaid Entity Reward Wallet.",
    benefits: [
      "100+ global brands (Amazon, Apple, Starbucks, Uber, etc.)",
      "On-demand issuance: credentials generated only when won",
      "Two-phase reservation with 100% refund on failed claim",
      "Voucher code + Security PIN + Redemption URL delivered to member wallet",
    ],
    useCases: ["Milestone contest grand prizes", "Top mentor & ambassador rewards", "Hackathon winner bonuses", "High-tier loyalty redemption"],
    route: "/gamification/rewards/pillars/gift-cards",
    actionLabel: "Explore Brand Catalog & Wallet",
  },
  {
    id: "pillar-4",
    pillarNumber: "Pillar 4",
    title: "Virtual Currency & Coins",
    code: "COINS / TC",
    icon: Coins,
    color: "amber",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    headline: "Community loyalty points & virtual tokens",
    summary: "Digital entity coins credited directly into the member's wallet. Earned through continuous community interactions and spent on unlocking perks or entry tickets.",
    benefits: [
      "Instant automatic credit on activity completion",
      "Zero cost per token generation with flexible conversion rates",
      "Gamification fuel: used to play Spin Wheel, Scratch Cards, or redeem perks",
      "Built-in activity caps and velocity controls prevent inflation",
    ],
    useCases: ["Daily check-in bonuses", "Discussion post upvotes & reactions", "Event attendance rewards", "Tier progression and leaderboard ranking"],
    route: "/gamification/currency",
    actionLabel: "Manage Virtual Currency",
  },
];

export function PillarsSection() {
  const [selectedPillar, setSelectedPillar] = useState<string>("pillar-1");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border-primary/20">
              Core Architecture
            </Badge>
            <span className="text-xs text-muted-foreground">• 4 Distinct Fulfillment Methods</span>
          </div>
          <h2 className="text-lg font-bold text-foreground">The 4 Reward Fulfillment Pillars</h2>
          <p className="text-xs text-muted-foreground">
            Every reward in Thrico — whether won in a mini-game or claimed from a catalog — is powered by one of these 4 pillars.
          </p>
        </div>
      </div>

      {/* Grid of 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PILLARS_DATA.map((pillar) => {
          const Icon = pillar.icon;
          const isSelected = selectedPillar === pillar.id;

          return (
            <Card
              key={pillar.id}
              onClick={() => setSelectedPillar(pillar.id)}
              className={cn(
                "relative overflow-hidden transition-all duration-200 cursor-pointer rounded-xl border bg-card/60 backdrop-blur-xs hover:shadow-md",
                pillar.accentBorder,
                isSelected && "ring-2 ring-primary/40 bg-card shadow-sm"
              )}
            >
              {/* Subtle top gradient */}
              <div className={cn("absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r", pillar.gradient)} />

              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border shrink-0", pillar.badgeColor)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {pillar.pillarNumber}
                        </span>
                        <Badge variant="secondary" className="text-[9px] font-mono px-1.5 py-0 h-4">
                          {pillar.code}
                        </Badge>
                      </div>
                      <h3 className="text-sm font-bold text-foreground">{pillar.title}</h3>
                    </div>
                  </div>

                  <Link href={pillar.route} onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold gap-1 text-primary hover:text-primary">
                      Manage
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pillar.summary}
                </p>

                {/* Key Benefits */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Key Capabilities:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {pillar.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-foreground/90">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Use Cases */}
                <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2 flex-wrap text-[11px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-semibold text-muted-foreground">Examples:</span>
                    {pillar.useCases.map((uc, i) => (
                      <span key={i} className="bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md border border-border/40 text-[10px] font-medium">
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Matrix */}
      <Card className="rounded-xl border-border/60 bg-gradient-to-b from-card to-muted/20 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border/60 flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Pillar Comparison & Capabilities</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-[10px] uppercase font-bold text-muted-foreground">
                <th className="p-3 pl-4">Pillar</th>
                <th className="p-3">Cost to Entity</th>
                <th className="p-3">Fulfillment Speed</th>
                <th className="p-3">Delivery Format</th>
                <th className="p-3">Customer Lock Option</th>
                <th className="p-3 pr-4">Primary Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-[11px]">
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="p-3 pl-4 font-semibold text-foreground flex items-center gap-1.5">
                  <Ticket className="h-3.5 w-3.5 text-emerald-500" />
                  Internal Vouchers
                </td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-medium">Zero Marginal Cost</td>
                <td className="p-3">Instant (Pool Draw)</td>
                <td className="p-3 font-mono">Promo Code / Barcode</td>
                <td className="p-3 text-muted-foreground">—</td>
                <td className="p-3 pr-4">Any online / offline venue</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="p-3 pl-4 font-semibold text-foreground flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-indigo-500" />
                  Store Discounts
                </td>
                <td className="p-3 font-medium">Discount on Order GMV</td>
                <td className="p-3">Real-time API Creation</td>
                <td className="p-3 font-mono">Single-Use Coupon Code</td>
                <td className="p-3 text-emerald-600 font-semibold">✓ Locked to Member Email</td>
                <td className="p-3 pr-4">Shopify / WooCommerce Cart</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="p-3 pl-4 font-semibold text-foreground flex items-center gap-1.5">
                  <Gift className="h-3.5 w-3.5 text-purple-500" />
                  Brand Digital Gift Cards
                </td>
                <td className="p-3 font-medium">Face Value + Small Gateway Fee</td>
                <td className="p-3">Instant on-demand API</td>
                <td className="p-3 font-mono">Voucher + PIN + Claim Link</td>
                <td className="p-3 text-emerald-600 font-semibold">✓ Wallet Authenticated</td>
                <td className="p-3 pr-4">Amazon, Apple, Starbucks, Uber</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="p-3 pl-4 font-semibold text-foreground flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5 text-amber-500" />
                  Virtual Currency / Coins
                </td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-medium">Zero Fiat Cost</td>
                <td className="p-3">Instant Ledger Credit</td>
                <td className="p-3 font-mono">Digital Coin Balance</td>
                <td className="p-3 text-emerald-600 font-semibold">✓ Account Bound</td>
                <td className="p-3 pr-4">Community Economy & Perks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
