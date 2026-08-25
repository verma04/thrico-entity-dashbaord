"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RotateCw,
  Sparkles,
  Gamepad2,
  Trophy,
  Dices,
  Lock,
  Unlock,
  CheckCircle2,
  ArrowRight,
  Gift,
  Coins,
  ShoppingBag,
  Percent,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function GamesSection() {
  const [activeGameTab, setActiveGameTab] = useState("spin");

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
            Interactive Minigames
          </Badge>
          <span className="text-xs text-muted-foreground">• Engagement & Retention Engines</span>
        </div>
        <h2 className="text-lg font-bold text-foreground">Interactive Engagement Mini-Games</h2>
        <p className="text-xs text-muted-foreground">
          Turn your rewards catalog into viral mini-games that drive daily active users, community participation, and gamified member loyalty.
        </p>
      </div>

      <Tabs value={activeGameTab} onValueChange={setActiveGameTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full sm:w-[460px] h-10 p-1 bg-muted/60 rounded-xl border border-border/60">
          <TabsTrigger value="spin" className="gap-2 text-xs font-semibold rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs">
            <RotateCw className="h-3.5 w-3.5 text-violet-500" />
            <span>Spin the Wheel</span>
          </TabsTrigger>
          <TabsTrigger value="scratch" className="gap-2 text-xs font-semibold rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Scratch Cards</span>
          </TabsTrigger>
          <TabsTrigger value="match" className="gap-2 text-xs font-semibold rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs">
            <Gamepad2 className="h-3.5 w-3.5 text-rose-500" />
            <span>Match & Win</span>
          </TabsTrigger>
        </TabsList>

        {/* ── 1. Spin the Wheel ────────────────────────────────────────────── */}
        <TabsContent value="spin" className="space-y-4 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Description & Config */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="rounded-xl border-border/60 bg-card/60 backdrop-blur-xs shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-600 flex items-center justify-center">
                      <RotateCw className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">🎡 Spin the Wheel Engine</h3>
                      <span className="text-[11px] text-muted-foreground">Weighted probability prize slices & instant celebration</span>
                    </div>
                  </div>
                  <Link href="/gamification/rewards/engagement-games/spin-wheel/create">
                    <Button size="sm" className="h-7 text-xs font-semibold gap-1">
                      Create Wheel
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    The <strong>Spin the Wheel</strong> minigame allows you to segment a lucky wheel into prize slices. Each slice can be connected to any of the 4 reward pillars (Store coupon, Digital Gift Card, Coins, or Internal Vouchers).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Percent className="h-3.5 w-3.5 text-violet-500" />
                      Weighted Probabilities
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Set precision probability weights (e.g. 50% for 10 Coins, 5% for $25 Gift Card, 45% for 10% Store Discount).
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <RotateCw className="h-3.5 w-3.5 text-emerald-500" />
                      Daily Spin Allowances
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Limit members to 1 free spin per 24 hours, or allow extra spins purchased with earned Virtual Coins.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    Admin Configuration Options:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Custom color theme & banner graphic</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Sound effects & confetti burst</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Anti-cheat server validation</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Instant member wallet fulfillment</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Wheel Simulation Card */}
            <div className="lg:col-span-5">
              <Card className="rounded-xl border-border/60 bg-gradient-to-b from-card via-card to-violet-500/5 shadow-xs p-5 flex flex-col items-center justify-between text-center space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Interactive Member Experience Preview
                </span>

                {/* Simulated Wheel Circle */}
                <div className="relative h-48 w-48 rounded-full border-4 border-violet-500/30 flex items-center justify-center bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 shadow-lg text-white p-3">
                  <div className="absolute inset-2 rounded-full border-2 border-white/20 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-card border-2 border-violet-500 text-foreground flex items-center justify-center shadow-md z-10 font-bold text-xs">
                      SPIN
                    </div>
                  </div>
                  <div className="absolute top-2 text-[10px] font-bold tracking-tight">₹500 Card</div>
                  <div className="absolute bottom-2 text-[10px] font-bold tracking-tight">100 Coins</div>
                  <div className="absolute left-2 text-[10px] font-bold tracking-tight">20% Off</div>
                  <div className="absolute right-2 text-[10px] font-bold tracking-tight">Free Ticket</div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-foreground">Tap & Spin on Web or Mobile</div>
                  <p className="text-[11px] text-muted-foreground max-w-xs">
                    Members spin directly in your community feed, winning instantly validated rewards credited straight to their wallet.
                  </p>
                </div>

                <Badge variant="secondary" className="text-[10px] font-mono">
                  Daily Limit: 1 Spin / Member
                </Badge>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ── 2. Scratch Cards ─────────────────────────────────────────────── */}
        <TabsContent value="scratch" className="space-y-4 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 space-y-4">
              <Card className="rounded-xl border-border/60 bg-card/60 backdrop-blur-xs shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
                      <Sparkles className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">🎴 Scratch Cards Engine</h3>
                      <span className="text-[11px] text-muted-foreground">Swipe-to-reveal milestone cards & gated unlocks</span>
                    </div>
                  </div>
                  <Link href="/gamification/rewards/engagement-games/scratch-card/create">
                    <Button size="sm" className="h-7 text-xs font-semibold gap-1">
                      Create Card
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Scratch Cards</strong> bring tactile anticipation. Members can view both eligible cards (ready to scratch) and locked cards (showing what activity or tier level is required to unlock).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                      Dynamic Eligibility Unlocks
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Tie cards to achievements (e.g. "Complete Profile", "Attend 3 Events", "Reach Gold Tier").
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Gift className="h-3.5 w-3.5 text-amber-500" />
                      Guaranteed or Variable Rewards
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Configure guaranteed prizes for high-effort milestones, or randomized pools for viral campaigns.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    Key Features:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Realistic foil scratching surface</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Clear locked criteria explanation</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Automated wallet sync on swipe</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Expiry date & redemption tracking</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Card Simulation */}
            <div className="lg:col-span-5 space-y-3">
              {/* Unlocked Card Sample */}
              <div className="p-4 rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-card to-card space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-600 text-white text-[9px] uppercase font-bold">
                    Ready to Scratch
                  </Badge>
                  <span className="text-[10px] font-mono text-muted-foreground">Expires in 7 days</span>
                </div>
                <div className="h-20 rounded-lg bg-gradient-to-r from-amber-400/30 to-amber-600/30 border border-dashed border-amber-500/40 flex items-center justify-center text-center p-2">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs">
                    <Sparkles className="h-4 w-4" />
                    <span>Swipe to Scratch & Reveal</span>
                  </div>
                </div>
                <div className="text-xs font-semibold text-foreground">Welcome Onboarding Scratch Card</div>
              </div>

              {/* Locked Card Sample */}
              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 opacity-80 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[9px] uppercase font-bold text-muted-foreground gap-1">
                    <Lock className="h-2.5 w-2.5" />
                    Locked Card
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">Silver Tier Only</span>
                </div>
                <div className="text-xs font-medium text-muted-foreground">
                  Requires 250 more Activity Points or Gold Tier upgrade to unlock.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── 3. Match & Win ──────────────────────────────────────────────── */}
        <TabsContent value="match" className="space-y-4 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 space-y-4">
              <Card className="rounded-xl border-border/60 bg-card/60 backdrop-blur-xs shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center">
                      <Gamepad2 className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">🎰 Match & Win Tile Minigame</h3>
                      <span className="text-[11px] text-muted-foreground">Symbol matching & progressive reward tiers</span>
                    </div>
                  </div>
                  <Link href="/gamification/rewards/engagement-games/match-win/create">
                    <Button size="sm" className="h-7 text-xs font-semibold gap-1">
                      Create Game
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Match & Win</strong> lets members flip mystery tiles or spin a 3-reel slot machine. Matching 2 or 3 identical symbols unlocks progressive prize tiers.
                </p>

                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Progressive Prize Tiers:
                  </span>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-rose-600">3x Diamonds 💎💎💎</span>
                      </div>
                      <span className="font-semibold text-foreground">Grand Prize ($50 Gift Card)</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-600">3x Stars ⭐⭐⭐</span>
                      </div>
                      <span className="font-semibold text-foreground">Tier 2 (25% Store Discount)</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-600">2x Coins 🪙🪙</span>
                      </div>
                      <span className="font-semibold text-foreground">Tier 3 (50 Virtual Coins)</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Simulation */}
            <div className="lg:col-span-5">
              <Card className="rounded-xl border-border/60 bg-gradient-to-b from-card via-card to-rose-500/5 shadow-xs p-5 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Tile Matrix Simulation
                </span>

                <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/60">
                  {["💎", "⭐", "💎", "⭐", "💎", "🪙", "💎", "⭐", "⭐"].map((icon, i) => (
                    <div
                      key={i}
                      className="h-12 w-12 rounded-lg bg-card border border-border flex items-center justify-center text-xl shadow-2xs font-bold"
                    >
                      {icon}
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-foreground">Match 3 Identical Symbols to Win</div>
                  <p className="text-[11px] text-muted-foreground">
                    Customizable symbol graphics, win rates, and daily attempt limits per user.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
