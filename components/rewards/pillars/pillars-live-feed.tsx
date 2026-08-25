"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  History,
  Coins,
  ShoppingBag,
  Gift,
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PillarsLiveFeedProps {
  loading?: boolean;
  redemptions?: any[];
}

function getRelativeTimeString(dateInput?: string | Date | null) {
  if (!dateInput) return "Just now";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "Recently";
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

export function PillarsLiveFeed({ loading = false, redemptions = [] }: PillarsLiveFeedProps) {
  const [selectedPillarFlow, setSelectedPillarFlow] = useState<"manual" | "store" | "giftcards">("manual");

  const activities = React.useMemo(() => {
    if (!redemptions || redemptions.length === 0) {
      return [];
    }

    return redemptions.slice(0, 6).map((r: any) => {
      const reward = r.reward || {};
      const metadata = r.metadata || {};
      const provider = (reward.provider || metadata.provider || "").toUpperCase();
      const rewardType = (reward.rewardType || "").toUpperCase();
      const mechType = reward.mechanism?.type || "";

      let pillar: "manual" | "store" | "giftcards" = "manual";
      let pillarLabel = "Manual";
      let color = "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      let icon = Coins;

      if (
        mechType === "STORE_DISCOUNT" ||
        reward.storeDiscountRuleId ||
        rewardType === "STORE" ||
        rewardType === "SHOPIFY_DISCOUNT" ||
        provider === "SHOPIFY" ||
        provider === "STORE"
      ) {
        pillar = "store";
        pillarLabel = "Store";
        color = "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
        icon = ShoppingBag;
      } else if (
        mechType === "DIGITAL_GIFT_CARD" ||
        reward.digitalCardRuleId ||
        rewardType === "GIFT_CARD" ||
        rewardType === "THRICO_GIFT_CARD" ||
        provider === "GIFT_CARD" ||
        provider === "THRICO" ||
        provider === "XOXODAY"
      ) {
        pillar = "giftcards";
        pillarLabel = "Gift Card";
        color = "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20";
        icon = Gift;
      }

      const user = r.user || {};
      const firstName = user.firstName || "Member";
      const lastName = user.lastName || "";
      const avatar = user.avatar || "";

      let valueUnlocked = "Claimed";
      if (r.totalCost && Number(r.totalCost) > 0) {
        valueUnlocked = `₹${Number(r.totalCost).toLocaleString("en-IN")}`;
      } else if (r.faceValue && Number(r.faceValue) > 0) {
        valueUnlocked = `₹${Number(r.faceValue).toLocaleString("en-IN")}`;
      } else if (r.tcUsed && Number(r.tcUsed) > 0) {
        valueUnlocked = `${Number(r.tcUsed).toLocaleString()} TC`;
      } else if (r.ecUsed && Number(r.ecUsed) > 0) {
        valueUnlocked = `${Number(r.ecUsed).toLocaleString()} EC`;
      } else if (pillar === "manual") {
        valueUnlocked = "Zero Cost";
      }

      const status = r.status === "COMPLETED" || r.status === "DELIVERED"
        ? "Delivered"
        : r.status === "CLAIMED"
        ? "Claimed"
        : r.status || "Completed";

      return {
        id: r.id,
        user: { firstName, lastName, avatar },
        pillar,
        pillarLabel,
        rewardName: reward.title || "Reward Coupon",
        valueUnlocked,
        time: getRelativeTimeString(r.claimedAt || r.createdAt),
        status,
        color,
        icon,
      };
    });
  }, [redemptions]);

  const flows = {
    manual: {
      title: "Pillar 1: Manual Pipeline",
      subtitle: "Instant fulfillment from organization voucher & token pools",
      steps: [
        {
          step: "1. Win Trigger",
          desc: "Member spins wheel, scratches card, or completes rule.",
          icon: Zap,
        },
        {
          step: "2. Pool Allocation",
          desc: "Engine locks static voucher code or generates dynamic string.",
          icon: Coins,
        },
        {
          step: "3. Wallet Delivery",
          desc: "Delivered immediately to member's 'My Rewards' tab.",
          icon: CheckCircle2,
        },
      ],
      cost: "Zero Cost (Org Controlled)",
      latency: "< 50ms Delivery",
    },
    store: {
      title: "Pillar 2: Shopify Pipeline",
      subtitle: "On-demand unique coupon synthesis via store API",
      steps: [
        {
          step: "1. Win Trigger",
          desc: "Member unlocks discount tier in scratch-card or milestone.",
          icon: Zap,
        },
        {
          step: "2. Shopify API",
          desc: "Thrico invokes Shopify Admin GraphQL to mint unique code.",
          icon: ShoppingBag,
        },
        {
          step: "3. 1-Click Checkout",
          desc: "Deep-link pre-applies coupon directly to connected cart.",
          icon: ExternalLink,
        },
      ],
      cost: "Merchant Funded (Store GMV Lift)",
      latency: "< 150ms Synthesis",
    },
    giftcards: {
      title: "Pillar 3: Gift Cards Pipeline",
      subtitle: "Enterprise brand catalog issuance from prepaid budget",
      steps: [
        {
          step: "1. Win Trigger",
          desc: "Member redeems reward or wins jackpot brand card.",
          icon: Zap,
        },
        {
          step: "2. Budget Check",
          desc: "Validates velocity rules and draws from prepaid wallet balance.",
          icon: ShieldCheck,
        },
        {
          step: "3. Instant Pin",
          desc: "Digital voucher PIN & unmasking URL delivered instantly.",
          icon: Gift,
        },
      ],
      cost: "Prepaid Entity Balance",
      latency: "< 200ms Delivery",
    },
  };

  const activeFlow = flows[selectedPillarFlow];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
      {/* Left Column: Live Multi-Pillar Redemptions Feed */}
      <div className="lg:col-span-7 flex flex-col">
        <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs h-full flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40 px-3 sm:px-5 pt-3 sm:pt-4">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                <History className="h-3 w-3 text-primary" />
                Live Multi-Pillar Feed
              </span>
              <p className="text-[10px] text-muted-foreground">
                Real-time redemptions across Internal, Store &amp; Gift Card pillars
              </p>
            </div>

            <Link href="/gamification/rewards/redemptions">
              <Button
                variant="ghost"
                size="sm"
                className="text-[11px] text-primary font-bold h-6 px-2 rounded hover:bg-muted cursor-pointer"
              >
                View all <ArrowRight className="h-2.5 w-2.5 ml-0.5" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="flex-1 p-0 divide-y divide-border/50 flex flex-col justify-center">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Syncing live redemptions...
                </span>
              </div>
            ) : activities.length > 0 ? (
              activities.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    className="flex items-center justify-between gap-2.5 px-3 sm:px-5 py-2 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="h-7 w-7 border border-border/70 shrink-0">
                        <AvatarImage src={act.user.avatar} alt={act.user.firstName} />
                        <AvatarFallback className="text-[9px] font-bold">
                          {act.user.firstName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] font-bold text-foreground truncate">
                            {act.user.firstName} {act.user.lastName}
                          </span>
                          <span className="text-[9px] text-muted-foreground/60">•</span>
                          <span className="text-[9px] text-muted-foreground shrink-0">
                            {act.time}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mt-0.2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-0.5 text-[8px] font-bold px-1 py-0.1 rounded border",
                              act.color
                            )}
                          >
                            <Icon className="h-2 w-2" />
                            {act.pillarLabel}
                          </span>
                          <span className="text-[10px] font-medium text-foreground/80 truncate">
                            {act.rewardName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-extrabold text-foreground tabular-nums block">
                        {act.valueUnlocked}
                      </span>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                        {act.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-10 px-4 text-center space-y-2">
                <div className="h-9 w-9 rounded-full bg-muted/60 text-muted-foreground mx-auto flex items-center justify-center">
                  <History className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-foreground">
                    No Live Redemptions Yet
                  </h5>
                  <p className="text-[10px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    When members win prizes in Spin Wheel, Scratch Card, or redeem rewards, real-time claim records will stream here.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Engine Flow Visualizer */}
      <div className="lg:col-span-5 flex flex-col">
        <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs h-full flex flex-col overflow-hidden">
          <CardHeader className="flex flex-col space-y-1.5 pb-2 border-b border-border/40 px-3 sm:px-5 pt-3 sm:pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                <Zap className="h-3 w-3 text-primary" />
                Engine Visualizer
              </span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                Lifecycle
              </span>
            </div>

            {/* Pillar Selector Pills */}
            <div className="grid grid-cols-3 gap-0.5 p-0.5 rounded-lg bg-muted/50 border border-border/60">
              <button
                onClick={() => setSelectedPillarFlow("manual")}
                className={cn(
                  "py-0.5 px-1.5 text-[10px] font-bold rounded transition-all text-center cursor-pointer",
                  selectedPillarFlow === "manual"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                Pillar 1
              </button>
              <button
                onClick={() => setSelectedPillarFlow("store")}
                className={cn(
                  "py-0.5 px-1.5 text-[10px] font-bold rounded transition-all text-center cursor-pointer",
                  selectedPillarFlow === "store"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                Pillar 2
              </button>
              <button
                onClick={() => setSelectedPillarFlow("giftcards")}
                className={cn(
                  "py-0.5 px-1.5 text-[10px] font-bold rounded transition-all text-center cursor-pointer",
                  selectedPillarFlow === "giftcards"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                Pillar 3
              </button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-3 sm:p-4 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="text-[11px] font-bold text-foreground">
                {activeFlow.title}
              </h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {activeFlow.subtitle}
              </p>
            </div>

            {/* Flow Steps */}
            <div className="space-y-1.5">
              {activeFlow.steps.map((st, i) => {
                const StepIcon = st.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2 rounded-lg bg-card border border-border/60 shadow-2xs"
                  >
                    <div className="h-6 w-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.2">
                      <StepIcon className="h-3 w-3" />
                    </div>
                    <div className="space-y-0.2 min-w-0">
                      <span className="text-[11px] font-bold text-foreground block">
                        {st.step}
                      </span>
                      <p className="text-[10px] text-muted-foreground leading-tight">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Metric Footer */}
            <div className="p-2 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between text-[10px]">
              <span className="font-semibold text-muted-foreground truncate">
                {activeFlow.cost}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0 ml-1">
                {activeFlow.latency}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
