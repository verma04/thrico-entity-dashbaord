"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  Gamepad2,
  ShieldCheck,
  Wallet,
  Sparkles,
  BookOpen,
  ShoppingBag,
  Gift,
  Ticket,
  ChevronRight,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useModuleStore } from "@/store/useModuleStore";

import { PillarsSection } from "./pillars-section";
import { GamesSection } from "./games-section";
import { AntiFraudSection } from "./anti-fraud-section";
import { LifecycleFlowSection } from "./lifecycle-flow-section";

export function HowItWorksView() {
  const rewardsModuleName = useModuleStore(
    (state) => state.rewardsModuleName || "Rewards",
  );

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title="How Rewards & Engagement Games Work"
        badgeText="Visual Architecture Guide"
        description="Comprehensive guide to the 4 fulfillment pillars, interactive engagement games, dynamic audience targeting, and member digital wallet lifecycle."
        icon={BookOpen}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification/points-and-badges" },
          { label: rewardsModuleName, href: "/gamification/rewards" },
          { label: "How It Works" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/gamification/rewards/pillars">
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs font-semibold gap-1.5 rounded-lg shadow-2xs"
              >
                <Layers className="h-3.5 w-3.5" />
                Configure Pillars
              </Button>
            </Link>
            <Link href="/gamification/rewards/coupons/create">
              <Button
                size="sm"
                className="h-9 text-xs font-semibold gap-1.5 rounded-lg shadow-2xs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Create Reward
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="p-6 space-y-10">
        {/* ── Quick Navigation Anchor Bar ──────────────────────────────────── */}
        <div className="p-4 rounded-xl border border-border/60 bg-gradient-to-r from-card via-card to-primary/5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              🧭
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">
                Quick Navigation & Visual Sitemap
              </span>
              <span className="text-[11px] text-muted-foreground">
                Jump directly to any architectural component
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection("section-pillars")}
              className="h-7 text-xs font-semibold gap-1 rounded-md bg-card/80 hover:bg-card shadow-2xs cursor-pointer"
            >
              <Layers className="h-3 w-3 text-indigo-500" />
              1. 4 Fulfillment Pillars
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection("section-games")}
              className="h-7 text-xs font-semibold gap-1 rounded-md bg-card/80 hover:bg-card shadow-2xs cursor-pointer"
            >
              <Gamepad2 className="h-3 w-3 text-violet-500" />
              2. Interactive Games
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection("section-fraud")}
              className="h-7 text-xs font-semibold gap-1 rounded-md bg-card/80 hover:bg-card shadow-2xs cursor-pointer"
            >
              <ShieldCheck className="h-3 w-3 text-rose-500" />
              3. Audience & Anti-Fraud
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection("section-lifecycle")}
              className="h-7 text-xs font-semibold gap-1 rounded-md bg-card/80 hover:bg-card shadow-2xs cursor-pointer"
            >
              <Wallet className="h-3 w-3 text-emerald-500" />
              4. Member Lifecycle
            </Button>
          </div>
        </div>

        {/* ── Section 1: The 4 Reward Fulfillment Pillars ────────────────── */}
        <section id="section-pillars" className="scroll-mt-6">
          <PillarsSection />
        </section>

        <div className="border-t border-border/60" />

        {/* ── Section 2: Interactive Engagement Mini-Games ───────────────── */}
        <section id="section-games" className="scroll-mt-6">
          <GamesSection />
        </section>

        <div className="border-t border-border/60" />

        {/* ── Section 3: Audience Targeting & Anti-Fraud ──────────────────── */}
        <section id="section-fraud" className="scroll-mt-6">
          <AntiFraudSection />
        </section>

        <div className="border-t border-border/60" />

        {/* ── Section 4: Member Journey & Wallet Lifecycle ────────────────── */}
        <section id="section-lifecycle" className="scroll-mt-6">
          <LifecycleFlowSection />
        </section>

        {/* ── Quick Setup Shortcuts Footer Grid ───────────────────────────── */}
        <div className="p-6 rounded-2xl border border-border/60 bg-muted/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Ready to configure your reward ecosystem?
              </h3>
              <p className="text-xs text-muted-foreground">
                Jump directly to setup each pillar or minigame rule in seconds.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/gamification/rewards/pillars/store">
              <Card className="p-3.5 rounded-xl border border-border/60 bg-card hover:border-indigo-500/50 hover:shadow-xs transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-7 w-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs font-bold text-foreground">
                  Shopify Discounts
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Setup 15% / $10 store rules
                </div>
              </Card>
            </Link>

            <Link href="/gamification/rewards/pillars/gift-cards">
              <Card className="p-3.5 rounded-xl border border-border/60 bg-card hover:border-purple-500/50 hover:shadow-xs transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Gift className="h-3.5 w-3.5" />
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs font-bold text-foreground">
                  Digital Gift Cards
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Amazon, Uber, Starbucks brand pool
                </div>
              </Card>
            </Link>

            <Link href="/gamification/rewards/pillars/manual">
              <Card className="p-3.5 rounded-xl border border-border/60 bg-card hover:border-emerald-500/50 hover:shadow-xs transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Ticket className="h-3.5 w-3.5" />
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs font-bold text-foreground">
                  Internal Vouchers
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Batch upload CSV promo codes
                </div>
              </Card>
            </Link>

            <Link href="/gamification/rewards/engagement-games">
              <Card className="p-3.5 rounded-xl border border-border/60 bg-card hover:border-amber-500/50 hover:shadow-xs transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Gamepad2 className="h-3.5 w-3.5" />
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs font-bold text-foreground">
                  Mini-Games Hub
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Launch Spin Wheel & Scratch Cards
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
