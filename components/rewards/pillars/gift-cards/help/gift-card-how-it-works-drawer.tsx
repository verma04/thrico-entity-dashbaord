"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  HelpCircle,
  X,
  Gift,
  Wallet,
  Zap,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  RefreshCcw,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GiftCardLifecycleFlow } from "../gift-card-lifecycle-flow";
import { GiftCardFaultToleranceFlow } from "../gift-card-fault-tolerance-flow";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GiftCardHowItWorksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClick?: () => void;
  onTopUpClick?: () => void;
}

export function GiftCardHowItWorksDrawer({
  isOpen,
  onClose,
  onCreateClick,
  onTopUpClick,
}: GiftCardHowItWorksDrawerProps) {
  const [activeTab, setActiveTab] = useState<string>("lifecycle");
  const [claimed, setClaimed] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const sampleCard = {
    brand: "Amazon",
    amount: "₹500",
    code: "AMZN-8K4P-92LX-7712",
    pin: "88492019",
    expiry: "12 Aug 2027",
  };

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
              <div className="h-9 w-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-xs">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground tracking-tight">
                    How Thrico Digital Gift Cards Work
                  </h3>
                  <Badge className="bg-primary text-primary-foreground font-bold text-[9px] px-1.5 py-0 uppercase tracking-wider">
                    Step Guide
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Prepaid wallet mechanics, on-demand provider purchasing, 2-phase reservation, and member claim flow.
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
                  Configure Gift Card
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
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
                  <span className="h-4 w-4 rounded-full bg-violet-500/15 text-violet-700 dark:text-violet-300 flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  Prepaid Wallet & On-Win Flow
                </TabsTrigger>

                <TabsTrigger
                  value="difference"
                  className="text-xs font-semibold px-3 py-1.5 gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs cursor-pointer"
                >
                  <span className="h-4 w-4 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-bold">
                    2
                  </span>
                  Difference from Shopify
                </TabsTrigger>

                <TabsTrigger
                  value="fault"
                  className="text-xs font-semibold px-3 py-1.5 gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs cursor-pointer"
                >
                  <span className="h-4 w-4 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center text-[10px] font-bold">
                    3
                  </span>
                  Fault Tolerance & Idempotency
                </TabsTrigger>

                <TabsTrigger
                  value="member"
                  className="text-xs font-semibold px-3 py-1.5 gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs cursor-pointer"
                >
                  <span className="h-4 w-4 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                    4
                  </span>
                  Member Claim Experience
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
                    Step 1 • 6-Step End-to-End Fulfillment Lifecycle
                  </span>
                  <GiftCardLifecycleFlow />
                </div>

                {/* Practical Example Card */}
                <div className="p-4 rounded-xl border border-violet-200/70 dark:border-violet-900/60 bg-violet-50/40 dark:bg-violet-950/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    <h4 className="text-xs font-bold text-foreground">
                      Real-World Balance Calculation Example
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-background/80 border border-border/60">
                      <span className="text-[10px] text-muted-foreground block">1. Initial Wallet</span>
                      <strong className="font-mono text-sm">₹50,000</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-background/80 border border-border/60">
                      <span className="text-[10px] text-muted-foreground block">2. Member Wins Card</span>
                      <strong className="font-mono text-sm text-violet-600">₹500 Amazon</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-background/80 border border-border/60">
                      <span className="text-[10px] text-muted-foreground block">3. Card + 5% Fee</span>
                      <strong className="font-mono text-sm text-amber-600">₹500 + ₹25 = ₹525</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-background/80 border border-border/60">
                      <span className="text-[10px] text-muted-foreground block">4. Remaining Wallet</span>
                      <strong className="font-mono text-sm text-emerald-600">₹49,475</strong>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => setActiveTab("difference")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-medium h-9 cursor-pointer"
                  >
                    Next: Difference from Shopify
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "difference" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">
                    Core Architectural Difference: Shopify vs Digital Gift Cards
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Understand how discount creation differs from external voucher purchasing.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Shopify Pillar 2 Card */}
                  <div className="p-4 rounded-xl border border-border/70 bg-card space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-muted text-foreground flex items-center justify-center">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-foreground">Pillar 2: Shopify Store</h5>
                        <span className="text-[10px] text-muted-foreground">Discount Code Creation</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      With Shopify, Thrico communicates with the connected merchant store and asks Shopify to <strong>create a discount code</strong> (e.g. <code>THRICO-8K4P7X</code>). The merchant bears the discount margin upon checkout.
                    </p>
                    <div className="p-2.5 rounded-lg bg-muted/40 font-mono text-[10px] text-muted-foreground space-y-1">
                      <div>User Wins → Thrico calls Shopify API → Shopify CREATES Code → User spends in store</div>
                    </div>
                  </div>

                  {/* Digital Gift Card Pillar 3 Card */}
                  <div className="p-4 rounded-xl border border-border/70 bg-card space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-muted text-foreground flex items-center justify-center">
                        <Gift className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-foreground">Pillar 3: Digital Gift Cards</h5>
                        <span className="text-[10px] text-muted-foreground">Actual Voucher Purchase</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Thrico does <strong>not</strong> generate Amazon or Flipkart codes. Thrico checks the entity’s prepaid wallet and <strong>purchases an actual digital gift card</strong> from the connected provider API.
                    </p>
                    <div className="p-2.5 rounded-lg bg-muted/40 font-mono text-[10px] text-muted-foreground space-y-1">
                      <div>User Wins → Check Prepaid Wallet → Provider ISSUES Voucher → Code + PIN to User</div>
                    </div>
                  </div>
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
                    onClick={() => setActiveTab("fault")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-medium h-9 cursor-pointer"
                  >
                    Next: Fault Tolerance & Idempotency
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "fault" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">
                    Fault Tolerance & Idempotency Protection
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    How Thrico guarantees that your reward wallet balance is never debited if a provider call fails, and prevents double-purchases.
                  </p>
                </div>

                <GiftCardFaultToleranceFlow />

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("difference")}
                    className="text-xs font-semibold h-9"
                  >
                    Back: Difference from Shopify
                  </Button>
                  <Button
                    onClick={() => setActiveTab("member")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-medium h-9 cursor-pointer"
                  >
                    Next: Member Experience
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "member" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">
                    Member Experience in "My Rewards"
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    The external digital provider is completely hidden. The user receives a seamless, branded reward experience.
                  </p>
                </div>

                {/* Interactive Member Reward Card Preview */}
                <div className="max-w-md mx-auto p-5 rounded-2xl border border-border/80 bg-card shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs border border-amber-500/20">
                        🎁
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-foreground">Amazon Gift Card</h5>
                        <span className="text-[10px] text-muted-foreground">Won via Spin the Wheel</span>
                      </div>
                    </div>
                    <Badge className="bg-emerald-600 text-white text-xs font-mono font-bold">
                      ₹500
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Congratulations! You won a ₹500 Amazon Gift Card. Use this voucher on Amazon India for any purchases.
                  </p>

                  {!claimed ? (
                    <Button
                      onClick={() => {
                        setClaimed(true);
                        toast.success("Reward Claimed!", {
                          description: "Gift card code and PIN unlocked.",
                        });
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 shadow-2xs cursor-pointer"
                    >
                      Claim Reward
                    </Button>
                  ) : (
                    <div className="space-y-2.5 pt-2 border-t border-border/60 animate-in fade-in-50 duration-200">
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                          Gift Card Code
                        </span>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/60 font-mono text-xs font-bold text-foreground">
                          <span>{sampleCard.code}</span>
                          <button
                            onClick={() => copyCode(sampleCard.code)}
                            className="text-primary flex items-center gap-1 text-[11px] font-sans font-semibold cursor-pointer"
                          >
                            {copiedCode === sampleCard.code ? (
                              <>
                                <Check className="h-3 w-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-muted/30">
                          <span className="text-[10px] text-muted-foreground block">Card PIN</span>
                          <strong className="font-mono text-xs">{sampleCard.pin}</strong>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/30">
                          <span className="text-[10px] text-muted-foreground block">Expiry Date</span>
                          <strong className="text-xs">{sampleCard.expiry}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("fault")}
                    className="text-xs font-semibold h-9"
                  >
                    Back: Fault Tolerance
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
                      Configure First Gift Card Offer
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
