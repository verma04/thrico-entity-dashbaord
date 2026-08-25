"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Gamepad2,
  Cpu,
  Server,
  Wallet,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
  CreditCard,
  Copy,
  ExternalLink,
  Code2,
  Terminal,
  Activity,
  Gift,
  Ticket,
  Coins,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FLOW_STEPS = [
  {
    step: "01",
    title: "Member Trigger & Interaction",
    actor: "Member (App / Web)",
    icon: Gamepad2,
    color: "violet",
    tagColor: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    desc: "Member performs a rewarding action: scratches a card, spins the lucky wheel, hits a community tier milestone, or redeems earned virtual coins from the rewards store.",
  },
  {
    step: "02",
    title: "Server Verification & Fraud Gate",
    actor: "Thrico Policy Engine",
    icon: ShieldCheck,
    color: "rose",
    tagColor: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    desc: "The policy engine verifies eligibility in milliseconds: checks member tier level, account age, cooldown timers, available inventory, and moderation status.",
  },
  {
    step: "03",
    title: "On-Demand Fulfillment Dispatch",
    actor: "Pillar Integration Engine",
    icon: Cpu,
    color: "indigo",
    tagColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    desc: "Based on the reward's pillar, Thrico either creates a Shopify single-use coupon, requests a brand gift card from provider API, assigns an internal voucher code, or credits digital coins.",
  },
  {
    step: "04",
    title: "Instant Wallet Storage & Reveal",
    actor: "Member Digital Wallet",
    icon: Wallet,
    color: "emerald",
    tagColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    desc: "Voucher code, security PIN, barcode, and expiry details are securely deposited into the member's wallet, with celebratory confetti revealed to the user.",
  },
  {
    step: "05",
    title: "Frictionless Redemption & Audit",
    actor: "Redemption & Analytics",
    icon: ShoppingBag,
    color: "amber",
    tagColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    desc: "Member uses the discount online or presents code in-store. The entity dashboard receives real-time redemption logs and full ROI analytics.",
  },
];

const SAMPLE_PAYLOADS = {
  shopify: {
    title: "Pillar 2: E-Commerce Store Discount",
    icon: ShoppingBag,
    badge: "LIVE SHOPIFY API",
    status: "201 CREATED",
    statusColor: "text-emerald-500",
    request: {
      action: "GENERATE_DISCOUNT_CODE",
      provider: "SHOPIFY_API_V2024",
      entityId: "ent_thrico_merch_01",
      memberEmail: "alex.turner@community.com",
      discountRule: "PERCENTAGE_OFF",
      value: 20,
      minCartTotal: 50.0,
      usageLimit: 1,
      validityDays: 30,
    },
    response: {
      success: true,
      code: "THRICO-VIP-8942",
      discountType: "PERCENTAGE",
      amount: "20% OFF",
      customerLocked: true,
      startsAt: "2026-08-25T12:00:00Z",
      expiresAt: "2026-09-24T23:59:59Z",
      directCheckoutUrl: "https://store.brand.com/discount/THRICO-VIP-8942?redirect=/cart",
    },
    memberResult: {
      displayTitle: "20% Off Community Merchandise",
      code: "THRICO-VIP-8942",
      instructions: "Apply at checkout on our official store. Locked to your registered account.",
    },
  },
  giftCard: {
    title: "Pillar 3: Brand Digital Gift Card",
    icon: Gift,
    badge: "GLOBAL BRAND API",
    status: "200 PROVISIONED",
    statusColor: "text-purple-500",
    request: {
      action: "ISSUE_BRAND_GIFT_CARD",
      provider: "XOXODAY_PLUM / THRICO_CATALOG",
      brand: "Amazon India",
      denomination: 500,
      currency: "INR",
      walletDeduction: 525, // 500 + 25 fee
      memberId: "usr_789412",
    },
    response: {
      success: true,
      orderId: "ORD-AMZN-20260825-9912",
      cardNumber: "AMZN-8K4P-92LX-7712",
      cardPin: "88492019",
      claimUrl: "https://www.amazon.in/g/claim?code=AMZN-8K4P-92LX-7712",
      validUntil: "2027-08-25T00:00:00Z",
      balance: 500.0,
    },
    memberResult: {
      displayTitle: "₹500 Amazon Gift Card",
      code: "AMZN-8K4P-92LX-7712",
      pin: "88492019",
      instructions: "Add code to your Amazon Pay wallet for instant ₹500 balance credit.",
    },
  },
  voucher: {
    title: "Pillar 1: Internal Voucher Pool",
    icon: Ticket,
    badge: "CSV BATCH ALLOCATION",
    status: "200 ALLOCATED",
    statusColor: "text-emerald-500",
    request: {
      action: "ASSIGN_POOL_VOUCHER",
      poolId: "pool_devcon_vip_passes_2026",
      memberId: "usr_789412",
      entityCost: 0,
    },
    response: {
      success: true,
      voucherId: "vch_row_849",
      voucherCode: "DEVCON-PASS-4491-VIP",
      remainingInPool: 142,
      assignedAt: "2026-08-25T12:30:00Z",
      status: "ASSIGNED",
    },
    memberResult: {
      displayTitle: "DevCon 2026 VIP Ticket Pass",
      code: "DEVCON-PASS-4491-VIP",
      instructions: "Present this promo code at event check-in for free backstage admission.",
    },
  },
  coins: {
    title: "Pillar 4: Virtual Currency Ledger",
    icon: Coins,
    badge: "LEDGER CREDIT",
    status: "200 SETTLED",
    statusColor: "text-amber-500",
    request: {
      action: "CREDIT_VIRTUAL_CURRENCY",
      entityId: "ent_thrico_01",
      memberId: "usr_789412",
      amount: 150,
      reason: "SPIN_THE_WHEEL_JACKPOT",
    },
    response: {
      success: true,
      txnId: "txn_tc_9081249",
      creditedAmount: 150,
      newWalletBalance: 1450,
      currencyName: "Thrico Coins",
      currencyCode: "TC",
    },
    memberResult: {
      displayTitle: "+150 Thrico Coins Earned",
      code: "TXN-TC-9081249",
      instructions: "Coins deposited immediately to your loyalty balance. Use to unlock perks.",
    },
  },
};

export function LifecycleFlowSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activePayloadTab, setActivePayloadTab] = useState<keyof typeof SAMPLE_PAYLOADS>("shopify");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    toast.success("Sample code copied to clipboard!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const payload = SAMPLE_PAYLOADS[activePayloadTab];
  const PayloadIcon = payload.icon;

  return (
    <div className="space-y-8">
      {/* ── Section Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              End-to-End Lifecycle
            </Badge>
            <span className="text-xs text-muted-foreground">• Real-time Automated Pipeline</span>
          </div>
          <h2 className="text-lg font-bold text-foreground">Member Journey & Architecture Flow</h2>
          <p className="text-xs text-muted-foreground">
            Explore the end-to-end request flow graph and inspect live API response payloads across each fulfillment pillar.
          </p>
        </div>

        <Link href="/gamification/rewards/redemptions">
          <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1 shrink-0">
            <Wallet className="h-3.5 w-3.5 text-emerald-500" />
            View Live Redemptions Ledger
          </Button>
        </Link>
      </div>

      {/* ── 1. Architectural Flow Diagram (Graph) ────────────────────────── */}
      <Card className="rounded-xl border-border/60 bg-card/60 backdrop-blur-xs p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Architecture Request & Data Flow Graph
            </h3>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">Real-time Execution &lt; 85ms</span>
        </div>

        {/* Visual Graph Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {/* Node 1 */}
          <div className="p-3.5 rounded-xl border border-violet-500/30 bg-violet-500/5 space-y-2 text-center flex flex-col items-center justify-between relative">
            <Badge variant="outline" className="text-[9px] uppercase font-bold bg-violet-500/10 text-violet-600 border-violet-500/20">
              1. Interaction
            </Badge>
            <div className="h-9 w-9 rounded-full bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold">
              <Gamepad2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Member Action</div>
              <div className="text-[10px] text-muted-foreground">Spins Wheel / Scratches Card</div>
            </div>
          </div>

          {/* Node 2 */}
          <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2 text-center flex flex-col items-center justify-between relative">
            <Badge variant="outline" className="text-[9px] uppercase font-bold bg-rose-500/10 text-rose-600 border-rose-500/20">
              2. Fraud & Rules
            </Badge>
            <div className="h-9 w-9 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Policy Engine</div>
              <div className="text-[10px] text-muted-foreground">Tier & Age Verification</div>
            </div>
          </div>

          {/* Node 3 */}
          <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 space-y-2 text-center flex flex-col items-center justify-between relative">
            <Badge variant="outline" className="text-[9px] uppercase font-bold bg-indigo-500/10 text-indigo-600 border-indigo-500/20">
              3. Dispatcher
            </Badge>
            <div className="h-9 w-9 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
              <Cpu className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Pillar Router</div>
              <div className="text-[10px] text-muted-foreground">Selects 1 of 4 Pillars</div>
            </div>
          </div>

          {/* Node 4 */}
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2 text-center flex flex-col items-center justify-between relative">
            <Badge variant="outline" className="text-[9px] uppercase font-bold bg-amber-500/10 text-amber-600 border-amber-500/20">
              4. Fulfillment
            </Badge>
            <div className="h-9 w-9 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Server className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">API / Pool Engine</div>
              <div className="text-[10px] text-muted-foreground">Live Coupon / Voucher Issue</div>
            </div>
          </div>

          {/* Node 5 */}
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2 text-center flex flex-col items-center justify-between relative">
            <Badge variant="outline" className="text-[9px] uppercase font-bold bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              5. Delivery
            </Badge>
            <div className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Wallet className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Member Wallet</div>
              <div className="text-[10px] text-muted-foreground">In-App Stored & Persistent</div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── 2. Live Flow & API Response Payload Inspector ─────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Live Flow & API Response Inspector
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Select any fulfillment pillar to inspect its real request parameters, provider response JSON, and member wallet payload.
            </p>
          </div>
        </div>

        <Tabs
          value={activePayloadTab}
          onValueChange={(val) => setActivePayloadTab(val as keyof typeof SAMPLE_PAYLOADS)}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto p-1 bg-muted/60 rounded-xl border border-border/60 gap-1">
            <TabsTrigger value="shopify" className="gap-1.5 text-xs font-semibold py-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs">
              <ShoppingBag className="h-3.5 w-3.5 text-indigo-500" />
              <span>Shopify Discount</span>
            </TabsTrigger>
            <TabsTrigger value="giftCard" className="gap-1.5 text-xs font-semibold py-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs">
              <Gift className="h-3.5 w-3.5 text-purple-500" />
              <span>Brand Gift Card</span>
            </TabsTrigger>
            <TabsTrigger value="voucher" className="gap-1.5 text-xs font-semibold py-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs">
              <Ticket className="h-3.5 w-3.5 text-emerald-500" />
              <span>Internal Voucher</span>
            </TabsTrigger>
            <TabsTrigger value="coins" className="gap-1.5 text-xs font-semibold py-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs">
              <Coins className="h-3.5 w-3.5 text-amber-500" />
              <span>Virtual Coins / TC</span>
            </TabsTrigger>
          </TabsList>

          <Card className="rounded-xl border-border/60 bg-card overflow-hidden shadow-xs">
            {/* Payload Header */}
            <div className="p-4 border-b border-border/60 flex items-center justify-between flex-wrap gap-2 bg-muted/30">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <PayloadIcon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{payload.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-[9px] font-mono h-4 px-1.5">
                      {payload.badge}
                    </Badge>
                    <span className={cn("text-[10px] font-mono font-bold", payload.statusColor)}>
                      ● {payload.status}
                    </span>
                  </div>
                </div>
              </div>

              <Badge variant="secondary" className="text-[10px] font-mono">
                Lat: 42ms
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
              {/* Left Column: Request Dispatch JSON */}
              <div className="lg:col-span-4 p-4 space-y-2 bg-muted/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Code2 className="h-3 w-3" />
                  1. Outbound Dispatch Payload
                </span>
                <pre className="p-3 rounded-lg bg-background border border-border/60 font-mono text-[11px] text-foreground/90 overflow-x-auto leading-relaxed">
                  {JSON.stringify(payload.request, null, 2)}
                </pre>
              </div>

              {/* Middle Column: Provider Response JSON */}
              <div className="lg:col-span-4 p-4 space-y-2 bg-muted/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Terminal className="h-3 w-3" />
                  2. Inbound Provider Response
                </span>
                <pre className="p-3 rounded-lg bg-background border border-border/60 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 overflow-x-auto leading-relaxed">
                  {JSON.stringify(payload.response, null, 2)}
                </pre>
              </div>

              {/* Right Column: Member Wallet Card Preview */}
              <div className="lg:col-span-4 p-4 space-y-3 bg-card flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                    <Wallet className="h-3 w-3 text-emerald-500" />
                    3. Deposited to Member Wallet
                  </span>

                  {/* Rendered Wallet Card */}
                  <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground truncate max-w-[180px]">
                        {payload.memberResult.displayTitle}
                      </span>
                      <Badge className="bg-emerald-600 text-white text-[8px] uppercase">
                        ACTIVE
                      </Badge>
                    </div>

                    <div className="p-2 rounded-lg bg-card border border-border/70 flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-primary truncate max-w-[170px]">
                        {payload.memberResult.code}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyText(payload.memberResult.code)}
                        className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {copiedCode === payload.memberResult.code ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>

                    {payload.memberResult.pin && (
                      <div className="flex items-center justify-between text-[11px] font-mono px-1">
                        <span className="text-muted-foreground">Security PIN:</span>
                        <span className="font-bold text-foreground">{payload.memberResult.pin}</span>
                      </div>
                    )}

                    <p className="text-[10px] text-muted-foreground leading-snug">
                      {payload.memberResult.instructions}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-muted-foreground flex items-center gap-1 pt-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  Audit log record indexed in entity database
                </div>
              </div>
            </div>
          </Card>
        </Tabs>
      </div>

      {/* ── 3. Step-by-Step Interactive Cards ────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            5-Stage Lifecycle Execution Walkthrough
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {FLOW_STEPS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeStep === idx;

            return (
              <Card
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "relative overflow-hidden rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-xs flex flex-col justify-between space-y-3",
                  isActive
                    ? "border-primary ring-2 ring-primary/20 bg-card shadow-xs"
                    : "border-border/60 bg-card/60 hover:border-primary/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-muted-foreground">
                    Step {item.step}
                  </span>
                  <div className="h-7 w-7 rounded-lg bg-muted/60 border border-border/50 flex items-center justify-center text-foreground">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div>
                  <Badge variant="outline" className={cn("text-[8px] uppercase tracking-wider font-bold mb-1.5", item.tagColor)}>
                    {item.actor}
                  </Badge>
                  <h4 className="text-xs font-bold text-foreground leading-snug">{item.title}</h4>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
