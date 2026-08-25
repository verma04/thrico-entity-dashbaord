"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  HelpCircle,
  X,
  ShoppingBag,
  Zap,
  ArrowRight,
  Sparkles,
  Gamepad2,
  Tag,
  Percent,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  RefreshCcw,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreLifecycleFlow } from "../store-lifecycle-flow";
import { StoreBenefitsGrid } from "../store-benefits-grid";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StoreHowItWorksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClick?: () => void;
}

export function StoreHowItWorksDrawer({
  isOpen,
  onClose,
  onCreateClick,
}: StoreHowItWorksDrawerProps) {
  const [activeTab, setActiveTab] = useState<string>("lifecycle");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="top"
        className="h-[100dvh] w-screen p-0 border-none outline-none bg-background dark:bg-zinc-950 z-50 overflow-hidden flex flex-col"
      >
        {/* Top Navigation Bar */}
        <div className="border-b border-border/80 bg-card/95 backdrop-blur-md px-6 py-3.5 shrink-0 z-10">
          <div className="w-12 h-1 bg-muted-foreground/25 rounded-full mx-auto mb-3" />

          <div className="max-w-[1080px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground tracking-tight">
                    How E-Commerce Store Rewards Work
                  </h3>
                  <Badge className="bg-primary text-primary-foreground font-bold text-[9px] px-1.5 py-0 uppercase tracking-wider">
                    Step Guide
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Learn how on-demand Shopify PriceRules synthesize discount codes only when members win minigames.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onCreateClick && (
                <Button
                  onClick={() => {
                    onClose();
                    onCreateClick();
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-medium h-8 shadow-2xs cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Create Store Reward
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Step Tabs */}
        <div className="border-b border-border/60 bg-muted/30 px-6 py-2 shrink-0">
          <div className="max-w-[1080px] mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-muted/70 p-1 rounded-lg border border-border h-auto flex flex-wrap sm:flex-nowrap gap-1">
                <TabsTrigger
                  value="lifecycle"
                  className="text-xs font-semibold px-3 py-1.5 gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs cursor-pointer"
                >
                  <span className="h-4 w-4 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  On-Win Lifecycle
                </TabsTrigger>

                <TabsTrigger
                  value="rules"
                  className="text-xs font-semibold px-3 py-1.5 gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs cursor-pointer"
                >
                  <span className="h-4 w-4 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-bold">
                    2
                  </span>
                  Supported Discount Types
                </TabsTrigger>

                <TabsTrigger
                  value="benefits"
                  className="text-xs font-semibold px-3 py-1.5 gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs cursor-pointer"
                >
                  <span className="h-4 w-4 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                    3
                  </span>
                  Platform Advantages
                </TabsTrigger>

                <TabsTrigger
                  value="gamification"
                  className="text-xs font-semibold px-3 py-1.5 gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs cursor-pointer"
                >
                  <span className="h-4 w-4 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 flex items-center justify-center text-[10px] font-bold">
                    4
                  </span>
                  Gamification Hooks
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <div className="max-w-[1080px] mx-auto space-y-6">
            {activeTab === "lifecycle" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Step 1 • 6-Step End-to-End Lifecycle
                  </span>
                  <StoreLifecycleFlow />
                </div>

                {/* Core Architecture Principle Card */}
                <div className="p-4 rounded-xl border border-indigo-200/70 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="text-xs font-bold text-foreground">
                      Why Zero Coupons Exist Before Winning
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Instead of creating thousands of static discount codes that clutter your Shopify admin and risk leaking, Thrico acts as an orchestrator. When Rahul spins the wheel and lands on ₹100 OFF, Thrico communicates with Shopify's Store PriceRules API to synthesize <strong>one unique single-use code</strong> locked to his email.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => setActiveTab("rules")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-medium h-9 cursor-pointer"
                  >
                    Next: Supported Discount Types
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "rules" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">
                    Supported PriceRule Discount Blueprints
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Easily configure fixed amount reductions, cart percentages, free shipping passes, or bundle promotions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      icon: Tag,
                      title: "Fixed ₹ Amount Reduction",
                      desc: "e.g. ₹100 or ₹500 off on minimum purchase of ₹499/₹1,999.",
                      sampleCode: "THRICO-100-8K4P7X",
                      rule: "priceRuleCreate(value: -100, target: line_item)",
                    },
                    {
                      icon: Percent,
                      title: "Percentage % Cart Discount",
                      desc: "e.g. 10% or 20% off entire cart with max discount ceiling.",
                      sampleCode: "THRICO-10PCT-92LMQ2",
                      rule: "priceRuleCreate(value: -10.0%, max_cap: 300)",
                    },
                    {
                      icon: Truck,
                      title: "Free Express Shipping",
                      desc: "Zero delivery fee on all domestic postcodes.",
                      sampleCode: "THRICO-SHIP-X7P4KD",
                      rule: "priceRuleCreate(value: -100%, target: shipping_line)",
                    },
                    {
                      icon: Sparkles,
                      title: "Special Member BOGO Promo",
                      desc: "Buy 1 Get 1 free on selected apparel & merchandise collections.",
                      sampleCode: "THRICO-BOGO-4M9K2L",
                      rule: "priceRuleCreate(buy_x_get_y: auto_match)",
                    },
                  ].map((rule, idx) => {
                    const Icon = rule.icon;
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-border/70 bg-card space-y-2.5 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-muted text-foreground flex items-center justify-center">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <h5 className="text-xs font-bold text-foreground">
                              {rule.title}
                            </h5>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            {rule.desc}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                          <span className="font-mono text-[11px] font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded">
                            {rule.sampleCode}
                          </span>
                          <button
                            onClick={() => copyCode(rule.sampleCode)}
                            className="text-xs text-primary font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            {copiedCode === rule.sampleCode ? (
                              <>
                                <Check className="h-3 w-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                Copy Code
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("lifecycle")}
                    className="text-xs font-semibold h-9"
                  >
                    Back: Lifecycle
                  </Button>
                  <Button
                    onClick={() => setActiveTab("benefits")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-medium h-9 cursor-pointer"
                  >
                    Next: Strategic Advantages
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "benefits" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">
                    Strategic Advantages of On-Demand Store Rewards
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Why modern merchants use on-demand PriceRule synthesis over static coupon batches.
                  </p>
                </div>

                <StoreBenefitsGrid />

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("rules")}
                    className="text-xs font-semibold h-9"
                  >
                    Back: Discount Types
                  </Button>
                  <Button
                    onClick={() => setActiveTab("gamification")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-medium h-9 cursor-pointer"
                  >
                    Next: Gamification Hooks
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "gamification" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">
                    Gamification & Minigame Distribution
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Connect store discount rules to minigames, milestone drops, and member reward wallets.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1.5">
                    <div className="h-7 w-7 rounded-lg bg-muted text-foreground flex items-center justify-center">
                      <Gamepad2 className="h-4 w-4" />
                    </div>
                    <h5 className="text-xs font-bold text-foreground">
                      Spin The Wheel Slices
                    </h5>
                    <p className="text-[11px] text-muted-foreground">
                      Set ₹100 OFF as a wheel slice with weighted odds. On victory, code is generated in real-time.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1.5">
                    <div className="h-7 w-7 rounded-lg bg-muted text-foreground flex items-center justify-center">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <h5 className="text-xs font-bold text-foreground">
                      Scratch Card Unlocks
                    </h5>
                    <p className="text-[11px] text-muted-foreground">
                      Reveal instant store savings cards that deposit single-use codes directly into My Rewards.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1.5">
                    <div className="h-7 w-7 rounded-lg bg-muted text-foreground flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <h5 className="text-xs font-bold text-foreground">
                      Tier Level Milestones
                    </h5>
                    <p className="text-[11px] text-muted-foreground">
                      Automatically synthesize 20% VIP codes when a member levels up into Elite Tier.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("benefits")}
                    className="text-xs font-semibold h-9"
                  >
                    Back: Strategic Advantages
                  </Button>

                  {onCreateClick && (
                    <Button
                      onClick={() => {
                        onClose();
                        onCreateClick();
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-medium h-9 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Create Store Reward Rule
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
