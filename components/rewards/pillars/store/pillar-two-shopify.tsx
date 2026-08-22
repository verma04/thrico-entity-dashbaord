"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Percent,
  Truck,
  Zap,
  ShieldCheck,
  RefreshCcw,
  Sparkles,
  Link2,
  Clock,
  Tag,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Gamepad2,
  ArrowRight,
  Info,
  CheckCircle,
  ShoppingCart,
  UserCheck,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQuery } from "@apollo/client";
import { GET_SHOPIFY_CONNECTION } from "@/graphql/actions/settings/shopify";
import { safeFormat } from "@/lib/date-utils";

interface SimulatedShopifyVoucher {
  id: string;
  userName: string;
  userEmail: string;
  rewardTitle: string;
  shopifyCode: string;
  status: "ISSUED" | "REDEEMED";
  issuedAt: string;
  redeemedAt?: string;
  gameSource: string;
}

const INITIAL_SIMULATED_VOUCHERS: SimulatedShopifyVoucher[] = [
  {
    id: "sv-1",
    userName: "Rahul Sharma",
    userEmail: "rahul.s@example.com",
    rewardTitle: "₹100 Flat Off",
    shopifyCode: "THRICO-8K4P7X",
    status: "REDEEMED",
    issuedAt: "10 mins ago",
    redeemedAt: "2 mins ago",
    gameSource: "Spin Wheel",
  },
  {
    id: "sv-2",
    userName: "Amit Verma",
    userEmail: "amit.v@example.com",
    rewardTitle: "₹100 Flat Off",
    shopifyCode: "THRICO-92LMQ2",
    status: "ISSUED",
    issuedAt: "15 mins ago",
    gameSource: "Scratch Card",
  },
  {
    id: "sv-3",
    userName: "Neha Gupta",
    userEmail: "neha.g@example.com",
    rewardTitle: "₹100 Flat Off",
    shopifyCode: "THRICO-X7P4KD",
    status: "ISSUED",
    issuedAt: "25 mins ago",
    gameSource: "Match Win",
  },
];

const SAMPLE_WINNERS = [
  { name: "Priya Patel", email: "priya.p@example.com" },
  { name: "Vikram Malhotra", email: "vikram.m@example.com" },
  { name: "Ananya Roy", email: "ananya.r@example.com" },
  { name: "Siddharth Jain", email: "sid.jain@example.com" },
  { name: "Kavita Rao", email: "kavita.r@example.com" },
];

export const PillarTwoShopify: React.FC = () => {
  const { data: connectionData, loading: connectionLoading } = useQuery(
    GET_SHOPIFY_CONNECTION,
    { fetchPolicy: "cache-and-network" }
  );

  const shopifyConn = connectionData?.shopifyConnection;
  const isConnected = shopifyConn?.status === "CONNECTED" || !!shopifyConn?.shopDomain;

  const [selectedOffer, setSelectedOffer] = useState<string>("INR_100");
  const [simulatedVouchers, setSimulatedVouchers] = useState<SimulatedShopifyVoucher[]>(
    INITIAL_SIMULATED_VOUCHERS
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const offerTemplates = [
    {
      id: "INR_100",
      title: "₹100 Flat Off",
      type: "Fixed Amount",
      desc: "₹100 discount on minimum cart of ₹499",
      codePrefix: "THRICO-",
      icon: Tag,
      ruleSummary: "PriceRule: fixed_amount, value: -100, min_subtotal: 499, usage_limit: 1",
    },
    {
      id: "INR_500",
      title: "₹500 Flat Off",
      type: "High Value",
      desc: "₹500 discount on minimum cart of ₹1,999",
      codePrefix: "THRICO-500-",
      icon: Tag,
      ruleSummary: "PriceRule: fixed_amount, value: -500, min_subtotal: 1999, usage_limit: 1",
    },
    {
      id: "PERCENT_10",
      title: "10% Order Discount",
      type: "Percentage",
      desc: "10% off entire cart value up to ₹300 savings",
      codePrefix: "THRICO-10PCT-",
      icon: Percent,
      ruleSummary: "PriceRule: percentage, value: -10%, max_discount: 300, usage_limit: 1",
    },
    {
      id: "PERCENT_20",
      title: "20% VIP Tier Off",
      type: "Tier Exclusive",
      desc: "20% off for verified Elite & VIP members",
      codePrefix: "THRICO-VIP20-",
      icon: Percent,
      ruleSummary: "PriceRule: percentage, value: -20%, customer_email_lock: true",
    },
    {
      id: "FREE_SHIPPING",
      title: "Free Express Shipping",
      type: "Shipping",
      desc: "Zero shipping fee across all domestic orders",
      codePrefix: "THRICO-SHIP-",
      icon: Truck,
      ruleSummary: "PriceRule: free_shipping, domestic only, usage_limit: 1",
    },
    {
      id: "MEMBER_SPECIAL",
      title: "Special Member BOGO",
      type: "Bundle Promo",
      desc: "Buy 1 Get 1 free on selected store collections",
      codePrefix: "THRICO-BOGO-",
      icon: Sparkles,
      ruleSummary: "PriceRule: buy_x_get_y, collection_id: auto, usage_limit: 1",
    },
  ];

  const handleSimulateWin = () => {
    const template = offerTemplates.find((t) => t.id === selectedOffer) || offerTemplates[0];
    const randomWinner = SAMPLE_WINNERS[Math.floor(Math.random() * SAMPLE_WINNERS.length)];
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const uniqueShopifyCode = `${template.codePrefix}${randomSuffix}`;

    const newVoucher: SimulatedShopifyVoucher = {
      id: `sv-${Date.now()}`,
      userName: randomWinner.name,
      userEmail: randomWinner.email,
      rewardTitle: template.title,
      shopifyCode: uniqueShopifyCode,
      status: "ISSUED",
      issuedAt: "Just now",
      gameSource: "Spin Wheel",
    };

    setSimulatedVouchers((prev) => [newVoucher, ...prev]);

    toast.success(`🎡 Member Win: ${randomWinner.name} won ${template.title}`, {
      description: `Thrico requested Shopify API → Generated unique code: ${uniqueShopifyCode}`,
    });
  };

  const handleSimulateRedeem = (voucherId: string) => {
    setSimulatedVouchers((prev) =>
      prev.map((v) => {
        if (v.id === voucherId) {
          return {
            ...v,
            status: "REDEEMED",
            redeemedAt: "Just now",
          };
        }
        return v;
      })
    );

    const voucher = simulatedVouchers.find((v) => v.id === voucherId);
    toast.success(`🛒 Shopify Order Webhook Received!`, {
      description: `${voucher?.userName} used ${voucher?.shopifyCode} at checkout. Status updated: Issued → Redeemed.`,
    });
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* ── 1. Connection & Overview Banner ────────────────────────────────── */}
      <div className="rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-indigo-600 text-white font-bold px-2 py-0.2 text-[9px] uppercase tracking-wider">
                Pillar 2 • E-Commerce (Shopify)
              </Badge>
              {connectionLoading ? (
                <span className="text-[11px] text-muted-foreground animate-pulse">
                  Checking Shopify connection...
                </span>
              ) : isConnected ? (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Connected: {shopifyConn?.shopDomain || "Shopify Store"}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Store Not Connected</span>
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Shopify On-Demand Discount Synthesis
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reward configurations exist in Thrico beforehand, but actual single-use Shopify discount codes are generated on-demand by Shopify only when a member wins.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/integrations/shopify">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs font-semibold h-8 shadow-xs cursor-pointer">
                <Link2 className="h-3.5 w-3.5" />
                {isConnected ? "Manage Shopify Integration" : "Connect Shopify Store"}
              </Button>
            </Link>

            <Link href="/integrations/shopify/coupons">
              <Button variant="outline" className="text-xs font-medium h-8 gap-1">
                Synced Coupons
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Core Architectural Principle Box ──────────────────────────── */}
      <div className="rounded-xl border border-indigo-200/70 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 space-y-2">
        <div className="flex items-start gap-3">
          <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <Info className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wide">
              How It Works: On-Demand Win Generation Architecture
            </h4>
            <p className="text-xs text-indigo-900/90 dark:text-indigo-300 leading-relaxed">
              <strong className="font-semibold">The coupon is NOT generated when the reward is created. It is generated only when the user actually wins the reward.</strong>{" "}
              Thrico doesn&apos;t generate the Shopify discount itself; Thrico requests Shopify to create the actual discount code via Shopify PriceRules API, while Shopify remains responsible for the store discount, validation, and checkout application.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. Complete 6-Step Visual Flow Diagram ───────────────────────── */}
      <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <RefreshCcw className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            Complete 6-Step End-to-End On-Win Workflow
          </span>
          <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-200/50 dark:border-indigo-800/50">
            Real-Time Shopify PriceRules & Webhooks
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          {/* Step 1 */}
          <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-zinc-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                1
              </div>
              <span className="text-xs font-bold text-foreground">Admin Creates Template</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Reward configured (₹100 OFF, 30d validity). <strong>No code generated yet.</strong>
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-lg border border-indigo-200/70 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                2
              </div>
              <span className="text-xs font-bold text-foreground">User Plays Game</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              User spins the wheel: 🎡 Spin → Wins ₹100 OFF reward.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-lg border border-indigo-200/70 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                3
              </div>
              <span className="text-xs font-bold text-foreground">Thrico Calls Shopify</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Thrico requests Shopify API to create a unique single-use discount.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-3 rounded-lg border border-purple-200/70 dark:border-purple-900/60 bg-purple-50/20 dark:bg-purple-950/20 space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                4
              </div>
              <span className="text-xs font-bold text-foreground">Code in My Rewards</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Shopify returns <code className="font-mono text-[10px] font-bold text-purple-700 dark:text-purple-300">THRICO-8K4P7X</code> to user wallet.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-3 rounded-lg border border-sky-200/70 dark:border-sky-900/60 bg-sky-50/20 dark:bg-sky-950/20 space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-sky-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                5
              </div>
              <span className="text-xs font-bold text-foreground">Shopify Checkout</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              User enters code on Shopify cart. Shopify validates and applies discount.
            </p>
          </div>

          {/* Step 6 */}
          <div className="p-3 rounded-lg border border-emerald-200/70 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                6
              </div>
              <span className="text-xs font-bold text-foreground">Order Webhook Sync</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Shopify fires order webhook. Thrico transitions status: <strong>Issued → Redeemed</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. Live Interactive Win & Webhook Simulation Table ───────────── */}
      <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs space-y-0">
        <div className="p-4 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-bold text-foreground">
                Live On-Demand Win Allocations & Redemption Stream
              </h4>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Simulate member game victories and Shopify checkout order webhooks in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleSimulateWin}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs font-semibold h-8 shadow-xs cursor-pointer"
            >
              <Gamepad2 className="h-3.5 w-3.5" />
              Simulate Member Win (Spin Wheel)
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="text-[11px]">
                <TableHead className="font-bold text-foreground py-2 px-4 text-[11px]">
                  Winning User
                </TableHead>
                <TableHead className="font-bold text-foreground py-2 px-4 text-[11px]">
                  Reward Won
                </TableHead>
                <TableHead className="font-bold text-foreground py-2 px-4 text-[11px]">
                  On-Demand Shopify Code
                </TableHead>
                <TableHead className="font-bold text-foreground py-2 px-4 text-[11px]">
                  Game Source
                </TableHead>
                <TableHead className="font-bold text-foreground py-2 px-4 text-[11px]">
                  Status
                </TableHead>
                <TableHead className="text-right font-bold text-foreground py-2 px-4 text-[11px]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {simulatedVouchers.map((v) => {
                const isRedeemed = v.status === "REDEEMED";

                return (
                  <TableRow key={v.id} className="text-xs hover:bg-muted/30 transition-colors">
                    {/* User */}
                    <TableCell className="py-2.5 px-4">
                      <div>
                        <span className="font-bold text-foreground block">{v.userName}</span>
                        <span className="text-[10px] text-muted-foreground">{v.userEmail}</span>
                      </div>
                    </TableCell>

                    {/* Reward */}
                    <TableCell className="py-2.5 px-4 font-semibold text-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Tag className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                        {v.rewardTitle}
                      </span>
                    </TableCell>

                    {/* Code */}
                    <TableCell className="py-2.5 px-4 font-mono font-bold text-xs">
                      <div className="inline-flex items-center gap-1.5 bg-muted/60 px-2 py-0.5 rounded border border-border/50">
                        <span>{v.shopifyCode}</span>
                        <button
                          onClick={() => handleCopy(v.shopifyCode)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedCode === v.shopifyCode ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </TableCell>

                    {/* Game */}
                    <TableCell className="py-2.5 px-4 text-[11px] text-muted-foreground">
                      <Badge variant="outline" className="text-[9px] font-medium py-0 h-4">
                        {v.gameSource}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-2.5 px-4">
                      {isRedeemed ? (
                        <Badge className="bg-emerald-600 text-white font-bold text-[9px] px-1.5 py-0 uppercase gap-1">
                          <CheckCircle className="h-2.5 w-2.5" />
                          Redeemed ({v.redeemedAt || "Order Complete"})
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-indigo-300 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 text-[9px] font-bold px-1.5 py-0 uppercase gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          Issued ({v.issuedAt})
                        </Badge>
                      )}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="py-2.5 px-4 text-right">
                      {isRedeemed ? (
                        <span className="text-[10px] text-muted-foreground font-medium">
                          Synced via Webhook
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSimulateRedeem(v.id)}
                          className="h-7 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 cursor-pointer shadow-2xs gap-1"
                        >
                          <ShoppingCart className="h-3 w-3 text-emerald-600" />
                          Simulate Shopify Checkout
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── 6. Discount Rule Template Matrix ─────────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Configured Shopify PriceRule Templates
          </span>
          <span className="text-[10px] text-muted-foreground">Pre-configured discount blueprints</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {offerTemplates.map((template) => {
            const Icon = template.icon;
            const isSelected = selectedOffer === template.id;

            return (
              <div
                key={template.id}
                onClick={() => setSelectedOffer(template.id)}
                className={cn(
                  "p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2",
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-xs ring-1 ring-indigo-500/20"
                    : "border-border/70 bg-card hover:bg-muted/40"
                )}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">
                      {template.type}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-foreground leading-tight">
                    {template.title}
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {template.desc}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground truncate pt-1.5 border-t border-border/40">
                  {template.codePrefix}******
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
