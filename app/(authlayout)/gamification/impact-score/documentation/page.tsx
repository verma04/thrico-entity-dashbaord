"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Activity,
  Award,
  Shield,
  Network,
  Calendar,
  Zap,
  TrendingDown,
  Sparkles,
  Layers,
  Settings,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Scale,
  FileText,
  Sliders,
  HelpCircle,
  RefreshCw,
  Clock,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemCard,
  EcosystemKPI,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { CtaButton } from "@/components/ui/cta-button";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// TIER DEFINITIONS
// ---------------------------------------------------------------------------
interface TierDef {
  name: string;
  min: number;
  max: number;
  badgeBg: string;
  badgeText: string;
  description: string;
}

const TIERS: TierDef[] = [
  {
    name: "Novice",
    min: 0,
    max: 299,
    badgeBg: "bg-zinc-100 dark:bg-zinc-800",
    badgeText: "text-zinc-700 dark:text-zinc-300",
    description: "New community entrants building initial verification and presence.",
  },
  {
    name: "Contributor",
    min: 300,
    max: 549,
    badgeBg: "bg-sky-50 dark:bg-sky-950/50",
    badgeText: "text-sky-700 dark:text-sky-300",
    description: "Active participants regularly consuming content and engaging in events.",
  },
  {
    name: "Champion",
    min: 550,
    max: 749,
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/50",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    description: "Established contributors creating posts, hosting sessions, and helping peers.",
  },
  {
    name: "Luminary",
    min: 750,
    max: 899,
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/50",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    description: "High-trust leaders with high consistency, network reach, and zero infractions.",
  },
  {
    name: "Vanguard",
    min: 900,
    max: 1000,
    badgeBg: "bg-amber-50 dark:bg-amber-950/50",
    badgeText: "text-amber-700 dark:text-amber-300",
    description: "Top-tier pillar members driving ecosystem growth and peer mentorship.",
  },
];

// ---------------------------------------------------------------------------
// 5 PILLARS DATA
// ---------------------------------------------------------------------------
const PILLARS = [
  {
    id: "engagement",
    title: "Engagement",
    defaultWeight: 30,
    icon: Activity,
    colorScheme: "sky" as const,
    description:
      "Measures everyday interaction, presence, and responsiveness across feeds and events.",
    signals: [
      "Liking, reacting, and commenting on discussions",
      "Attending webinars, AMAs, and community events",
      "Voting in real-time polls and completing surveys",
      "Consuming shared resources and articles",
    ],
    sampleRules: [
      { action: "LIKE_POST", points: "+1", limit: "10/day" },
      { action: "SUBMIT_COMMENT", points: "+3", limit: "8/day" },
      { action: "ATTEND_EVENT", points: "+10", limit: "2/day" },
    ],
  },
  {
    id: "contribution",
    title: "Contribution",
    defaultWeight: 30,
    icon: Award,
    colorScheme: "indigo" as const,
    description:
      "Captures original content creation, knowledge sharing, and peer-assisted problem solving.",
    signals: [
      "Publishing long-form articles and high-value posts",
      "Hosting community workshops or panels",
      "Answering unanswered technical questions",
      "Publishing case studies and research summaries",
    ],
    sampleRules: [
      { action: "CREATE_POST", points: "+15", limit: "3/day" },
      { action: "HOST_EVENT", points: "+50", limit: "1/week" },
      { action: "ACCEPTED_ANSWER", points: "+20", limit: "5/day" },
    ],
  },
  {
    id: "trust",
    title: "Trust & Safety",
    defaultWeight: 20,
    icon: Shield,
    colorScheme: "lime" as const,
    description:
      "Evaluates verification status, endorsements, and lack of moderation warnings.",
    signals: [
      "Completed profile verification (KYC/Email/Identity)",
      "Received peer endorsements and mentor feedback",
      "Maintained zero spam or harassment reports",
      "Active policy acknowledgment in Trust Center",
    ],
    sampleRules: [
      { action: "VERIFY_PROFILE", points: "+50", limit: "One-time" },
      { action: "RECEIVE_ENDORSEMENT", points: "+15", limit: "5/month" },
      { action: "SPAM_PENALTY", points: "-50", limit: "No cap" },
    ],
  },
  {
    id: "network",
    title: "Network & Reach",
    defaultWeight: 10,
    icon: Network,
    colorScheme: "purple" as const,
    description:
      "Reflects relational depth, mentorship matchmaking, and community onboarding reach.",
    signals: [
      "Mutual connections and bidirectional follows",
      "Completed 1-on-1 mentorship pairings",
      "Successful invites and referred active members",
      "Collaborative project participations",
    ],
    sampleRules: [
      { action: "MENTOR_MATCH_COMPLETED", points: "+25", limit: "2/month" },
      { action: "REFERRAL_ACTIVATED", points: "+20", limit: "10/month" },
      { action: "MUTUAL_CONNECT", points: "+2", limit: "5/day" },
    ],
  },
  {
    id: "consistency",
    title: "Consistency",
    defaultWeight: 10,
    icon: Calendar,
    colorScheme: "orange" as const,
    description:
      "Rewards persistent weekly cadence and daily activity streaks over sporadic bursts.",
    signals: [
      "Logging in at least 3 distinct days per week",
      "Maintaining weekly engagement streaks",
      "Regular recurring participation in monthly events",
      "Steady platform presence over 30+ day windows",
    ],
    sampleRules: [
      { action: "DAILY_CHECKIN", points: "+2", limit: "1/day" },
      { action: "STREAK_7_DAYS", points: "+15", limit: "1/week" },
      { action: "MONTHLY_CONSISTENCY", points: "+40", limit: "1/month" },
    ],
  },
];

// ---------------------------------------------------------------------------
// MAIN DOCUMENTATION PAGE
// ---------------------------------------------------------------------------
export default function ImpactDocumentationPage() {
  // Interactive Simulator State
  const [baseScore, setBaseScore] = useState(300);
  const [sliderEngagement, setSliderEngagement] = useState(70);
  const [sliderContribution, setSliderContribution] = useState(65);
  const [sliderTrust, setSliderTrust] = useState(85);
  const [sliderNetwork, setSliderNetwork] = useState(50);
  const [sliderConsistency, setSliderConsistency] = useState(60);

  // Compute Simulated Impact Score
  const simulatedScore = useMemo(() => {
    // Weighted formula:
    // Scale maximum category raw points to 700 potential points above base
    const maxRange = 1000 - baseScore;
    const weightedNormalized =
      (sliderEngagement * 0.3 +
        sliderContribution * 0.3 +
        sliderTrust * 0.2 +
        sliderNetwork * 0.1 +
        sliderConsistency * 0.1) /
      100;

    const total = Math.round(baseScore + weightedNormalized * maxRange);
    return Math.min(1000, Math.max(0, total));
  }, [
    baseScore,
    sliderEngagement,
    sliderContribution,
    sliderTrust,
    sliderNetwork,
    sliderConsistency,
  ]);

  // Current simulated tier
  const currentTier = useMemo(() => {
    return (
      TIERS.find((t) => simulatedScore >= t.min && simulatedScore <= t.max) ||
      TIERS[0]
    );
  }, [simulatedScore]);

  return (
    <EcosystemWrapper>
      {/* ------------------------------------------------------------------- */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------- */}
      <EcosystemHeader
        title="Impact Score Engine Documentation"
        description="Comprehensive reference for the reputation-based community trust, scoring formulation, and decay engine."
        badgeText="Engine Architecture"
        icon={BookOpen}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Impact Score", href: "/gamification/impact-score" },
          { label: "Documentation" },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Link href="/gamification/impact-score/rules">
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-xs gap-1.5 font-medium border-border/70 text-foreground hover:bg-muted"
              >
                <Layers className="h-3.5 w-3.5 text-indigo-500" />
                Scoring Rules
              </Button>
            </Link>
            <Link href="/gamification/impact-score/settings">
              <CtaButton
                variant="outline"
                className="h-8 px-3 rounded-lg text-xs gap-1.5 font-medium border-border/70 text-foreground hover:bg-muted"
              >
                <Settings className="h-3.5 w-3.5 text-emerald-500" />
                Configure
              </CtaButton>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-10">
        {/* ----------------------------------------------------------------- */}
        {/* TOP KPI SPECIFICATIONS                                            */}
        {/* ----------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <EcosystemKPI
            title="Score Scale"
            value="0 – 1,000"
            icon={Scale}
            colorScheme="indigo"
            trendLabel="Reputation Scale"
            tooltip="Bounded between 0 and 1000, functioning like a community credit score."
          />
          <EcosystemKPI
            title="Scoring Pillars"
            value="5 Categories"
            icon={Award}
            colorScheme="sky"
            trendLabel="Dynamic Weights"
            tooltip="Engagement (30%), Contribution (30%), Trust (20%), Network (10%), Consistency (10%)."
          />
          <EcosystemKPI
            title="Recency Window"
            value="Rolling 30–90d"
            icon={Clock}
            colorScheme="lime"
            trendLabel="Time-Decayed"
            tooltip="Recent actions hold peak weight, naturally decaying over time to favor sustained activity."
          />
          <EcosystemKPI
            title="Safeguard Engine"
            value="Caps & Decay"
            icon={ShieldAlert}
            colorScheme="orange"
            trendLabel="Anti-Gaming"
            tooltip="Daily frequency caps per module prevent spam; inactivity decay removes dormant members from top ranks."
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* SECTION 1: CORE CONCEPT                                           */}
        {/* ----------------------------------------------------------------- */}
        <section className="space-y-4">
          <DashboardSectionHeading
            title="1. Core Concept & Value Model"
            description="Why the Impact Score functions like a credit score, not vanity points."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Traditional Points */}
            <div className="p-5 rounded-[20px] bg-muted/20 border border-border/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                      <XCircle className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Traditional Gamification
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    Vanity Model
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Points only move upward. Encourages repetitive grinding, spam
                  behavior, and permanently inflates old accounts regardless of
                  current value.
                </p>

                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>Monotonically increasing (only goes up)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>Susceptible to botting and task automation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>Dormant veterans dominate leaderboards forever</span>
                  </li>
                </ul>
              </div>

              <div className="mt-5 pt-4 border-t border-border/40 text-[11px] text-muted-foreground italic">
                Outcome: Low trust signal, vanity metric.
              </div>
            </div>

            {/* Right: Impact Score Engine */}
            <div className="p-5 rounded-[20px] bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Impact Score Engine
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                    Credit Score Model
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  A dynamic, 2-way reputation metric bounded between 0 and 1,000.
                  Reflects ongoing quality, trust endorsements, and decays when
                  members go inactive.
                </p>

                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Dynamic: Increases with quality, drops with penalties</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Recency-weighted: Inactive accounts gradually decay</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Anti-gaming: Daily caps and rate-limits per module</span>
                  </li>
                </ul>
              </div>

              <div className="mt-5 pt-4 border-t border-indigo-200/60 dark:border-indigo-900/40 text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">
                Outcome: True indicator of member standing and community value.
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* SECTION 2: THE 5 PILLARS                                          */}
        {/* ----------------------------------------------------------------- */}
        <section className="space-y-4">
          <DashboardSectionHeading
            title="2. The 5 Core Impact Pillars"
            description="How points are weighted across five fundamental community behaviors."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PILLARS.map((pillar) => (
              <EcosystemCard
                key={pillar.id}
                title={`${pillar.title} (${pillar.defaultWeight}%)`}
                description={pillar.description}
                icon={pillar.icon}
                colorScheme={pillar.colorScheme}
                className="min-h-[300px] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Behavioral signals */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                      Key Signals Tracked
                    </span>
                    <ul className="space-y-1.5">
                      {pillar.signals.map((sig, idx) => (
                        <li
                          key={idx}
                          className="text-[11px] text-muted-foreground flex items-start gap-1.5"
                        >
                          <span className="h-1 w-1 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                          <span>{sig}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample rules */}
                  <div className="pt-3 border-t border-border/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                      Sample Action Weights
                    </span>
                    <div className="space-y-1.5">
                      {pillar.sampleRules.map((rule, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-card/60 border border-border/40 text-[10.5px]"
                        >
                          <span className="font-mono text-muted-foreground">
                            {rule.action}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "font-bold font-mono",
                                rule.points.startsWith("+")
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400",
                              )}
                            >
                              {rule.points}
                            </span>
                            <span className="text-[9px] text-muted-foreground/70">
                              ({rule.limit})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </EcosystemCard>
            ))}

            {/* Template Tuning Card */}
            <div className="p-5 rounded-[20px] bg-gradient-to-br from-card to-muted/30 border border-border/60 flex flex-col justify-between">
              <div>
                <div className="h-8 w-8 rounded-[10px] bg-gradient-to-br from-zinc-700 to-zinc-900 text-white flex items-center justify-center shadow-sm mb-4">
                  <Sliders className="h-4 w-4" />
                </div>
                <h3 className="text-[14.5px] font-semibold text-foreground mb-1 leading-tight tracking-tight">
                  Custom Weights via Templates
                </h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed mt-2">
                  Admins can customize these weights to fit their community's
                  unique DNA. For example, a developer forum might weight{" "}
                  <strong>Contribution at 50%</strong>, while an alumni network
                  might prioritize <strong>Network & Mentorship at 40%</strong>.
                </p>

                <div className="mt-4 p-3 rounded-xl bg-background/80 border border-border/50 text-[11px] text-muted-foreground space-y-1.5">
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Default Distribution</span>
                    <span>100% Total</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                    <div className="bg-sky-500 w-[30%]" title="Engagement: 30%" />
                    <div className="bg-indigo-500 w-[30%]" title="Contribution: 30%" />
                    <div className="bg-emerald-500 w-[20%]" title="Trust: 20%" />
                    <div className="bg-purple-500 w-[10%]" title="Network: 10%" />
                    <div className="bg-orange-500 w-[10%]" title="Consistency: 10%" />
                  </div>
                  <div className="flex flex-wrap gap-2 text-[9px] pt-1 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> Eng 30%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Cont 30%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Trust 20%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Net 10%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Cons 10%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40">
                <Link href="/gamification/impact-score/settings">
                  <Button
                    variant="outline"
                    className="w-full text-xs h-8 gap-1.5 rounded-lg border-border/70 hover:bg-muted"
                  >
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                    Adjust Template Weights
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* SECTION 3: MATHEMATICAL FORMULATION & PIPELINE                    */}
        {/* ----------------------------------------------------------------- */}
        <section className="space-y-4">
          <DashboardSectionHeading
            title="3. Mathematical Formulation & Pipeline"
            description="How actions transition from real-time events to recalculated impact scores."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Mathematical Formulation */}
            <div className="lg:col-span-5 p-5 rounded-[20px] bg-muted/20 border border-border/60 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Scale className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  Scoring Formulation
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/60 font-mono text-xs text-foreground space-y-2 shadow-inner">
                <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                  Composite Score Function
                </div>
                <div className="text-indigo-600 dark:text-indigo-400 font-bold leading-relaxed">
                  ImpactScore = Base + Σ (wᵢ · Sᵢ(t)) - D(t)
                </div>
                <div className="text-[10px] text-muted-foreground space-y-1 pt-2 border-t border-border/40 font-sans">
                  <p>
                    <strong>Base</strong> = Initial starting score (e.g., 300)
                  </p>
                  <p>
                    <strong>wᵢ</strong> = Template weight for Category <em>i</em> (Σ wᵢ = 1.0)
                  </p>
                  <p>
                    <strong>Sᵢ(t)</strong> = Rolling time-decayed points in Category <em>i</em>
                  </p>
                  <p>
                    <strong>D(t)</strong> = Inactivity decay penalty if dormant &gt; grace period
                  </p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <p>
                  <strong>Normalization:</strong> Scores are clamped to [0,
                  1000]. If a member accumulates severe Trust violations, their
                  score can plummet to 0.
                </p>
                <p>
                  <strong>Rolling Window:</strong> Points earned in the last 30
                  days are calculated at 100% value, 31-60 days at 50%, and
                  61-90 days at 25%.
                </p>
              </div>
            </div>

            {/* Ingestion Pipeline Stages */}
            <div className="lg:col-span-7 p-5 rounded-[20px] bg-card border border-border/60 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Zap className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  Real-time Ingestion Pipeline
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: "01",
                    title: "Event Dispatched",
                    desc: "A member triggers an action in FEED, EVENTS, MENTORSHIP, FORUMS, or MODERATION.",
                    badge: "Trigger",
                  },
                  {
                    step: "02",
                    title: "Rate Limit & Abuse Filter",
                    desc: "The rule engine verifies whether the member has exceeded their daily frequency cap.",
                    badge: "Validation",
                  },
                  {
                    step: "03",
                    title: "Category Weight Application",
                    desc: "Points are categorized under Engagement, Contribution, Trust, Network, or Consistency.",
                    badge: "Formula",
                  },
                  {
                    step: "04",
                    title: "Decay & Half-Life Calculation",
                    desc: "Recency curves discount older actions and apply decay if the member is past grace period.",
                    badge: "Decay Engine",
                  },
                  {
                    step: "05",
                    title: "Ledger Update & Tier Evaluation",
                    desc: "The audit ledger records the mutation, updates the user's score, and awards new Tier badges.",
                    badge: "Finalize",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/40 hover:bg-muted/40 transition-colors"
                  >
                    <span className="text-[11px] font-mono font-bold text-muted-foreground/80 px-2 py-0.5 rounded bg-muted">
                      {item.step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-foreground">
                          {item.title}
                        </h4>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground px-1.5 py-0.5 rounded bg-background border border-border/50">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* SECTION 4: LIVE SCORE SIMULATOR & TIERS                           */}
        {/* ----------------------------------------------------------------- */}
        <section className="space-y-4">
          <DashboardSectionHeading
            title="4. Live Score Simulator & Tier Preview"
            description="Interactive playground to test how pillar scores and base trust affect the final Impact Score."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls */}
            <div className="lg:col-span-7 p-6 rounded-[20px] bg-card border border-border/60 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Simulated Category Inputs
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Adjust the sliders below to see real-time recalculation.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBaseScore(300);
                    setSliderEngagement(70);
                    setSliderContribution(65);
                    setSliderTrust(85);
                    setSliderNetwork(50);
                    setSliderConsistency(60);
                  }}
                  className="h-7 text-[11px] text-muted-foreground gap-1 hover:text-foreground"
                >
                  <RefreshCw className="h-3 w-3" /> Reset
                </Button>
              </div>

              <div className="space-y-4 pt-2">
                {/* Base Score */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">
                      Base Initial Score
                    </span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {baseScore} pts
                    </span>
                  </div>
                  <Slider
                    value={[baseScore]}
                    min={0}
                    max={400}
                    step={10}
                    onValueChange={(val) => setBaseScore(val[0])}
                  />
                  <span className="text-[10px] text-muted-foreground block">
                    Starting baseline trust score granted to new verified accounts.
                  </span>
                </div>

                {/* Engagement */}
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-sky-500" />
                      Engagement Score (30% weight)
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {sliderEngagement}%
                    </span>
                  </div>
                  <Slider
                    value={[sliderEngagement]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(val) => setSliderEngagement(val[0])}
                  />
                </div>

                {/* Contribution */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      Contribution Score (30% weight)
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {sliderContribution}%
                    </span>
                  </div>
                  <Slider
                    value={[sliderContribution]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(val) => setSliderContribution(val[0])}
                  />
                </div>

                {/* Trust */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Trust & Reliability (20% weight)
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {sliderTrust}%
                    </span>
                  </div>
                  <Slider
                    value={[sliderTrust]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(val) => setSliderTrust(val[0])}
                  />
                </div>

                {/* Network */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-purple-500" />
                      Network & Mentorship (10% weight)
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {sliderNetwork}%
                    </span>
                  </div>
                  <Slider
                    value={[sliderNetwork]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(val) => setSliderNetwork(val[0])}
                  />
                </div>

                {/* Consistency */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                      Consistency & Recency (10% weight)
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {sliderConsistency}%
                    </span>
                  </div>
                  <Slider
                    value={[sliderConsistency]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(val) => setSliderConsistency(val[0])}
                  />
                </div>
              </div>
            </div>

            {/* Live Result & Tiers */}
            <div className="lg:col-span-5 p-6 rounded-[20px] bg-gradient-to-b from-indigo-50/40 via-card to-card dark:from-indigo-950/20 dark:via-card dark:to-card border border-indigo-200/50 dark:border-indigo-900/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                  Real-time Simulation Output
                </span>
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Calculated Impact Score
                </h3>

                {/* Big Score Display */}
                <div className="flex items-baseline gap-3 my-3">
                  <span className="text-5xl font-black tracking-tight text-foreground font-mono">
                    {simulatedScore}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    / 1,000 pts
                  </span>
                </div>

                {/* Current Tier Badge */}
                <div className="mt-3 p-3.5 rounded-xl border bg-background/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs",
                        currentTier.badgeBg,
                        currentTier.badgeText,
                      )}
                    >
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">
                          {currentTier.name} Tier
                        </span>
                        <span
                          className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase",
                            currentTier.badgeBg,
                            currentTier.badgeText,
                          )}
                        >
                          {currentTier.min}–{currentTier.max} pts
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {currentTier.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tier Scale Grid */}
                <div className="mt-5 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Community Tier Hierarchy
                  </span>
                  <div className="space-y-1">
                    {TIERS.map((tier) => {
                      const isCurrent = currentTier.name === tier.name;
                      return (
                        <div
                          key={tier.name}
                          className={cn(
                            "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all",
                            isCurrent
                              ? "bg-indigo-600 text-white font-bold shadow-sm"
                              : "bg-muted/30 text-muted-foreground",
                          )}
                        >
                          <span className="flex items-center gap-1.5">
                            {isCurrent && <Sparkles className="h-3 w-3" />}
                            {tier.name}
                          </span>
                          <span className="font-mono text-[11px]">
                            {tier.min} – {tier.max}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>View real member rankings</span>
                <Link
                  href="/gamification/impact-score/members"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  Member Directory &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* SECTION 5: PLATFORM MODULE INTEGRATIONS & RULES                   */}
        {/* ----------------------------------------------------------------- */}
        <section className="space-y-4">
          <DashboardSectionHeading
            title="5. Platform Module Integrations & Rules"
            description="How impact rules map to specific entity modules across the platform."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                module: "Feed & Posts",
                icon: Activity,
                category: "Contribution & Engagement",
                rules: [
                  { action: "CREATE_POST", points: "+15 pts", cap: "3/day" },
                  { action: "RECEIVE_LIKE", points: "+2 pts", cap: "20/day" },
                  { action: "LEAVE_COMMENT", points: "+3 pts", cap: "10/day" },
                ],
              },
              {
                module: "Events & Webinars",
                icon: Calendar,
                category: "Engagement & Contribution",
                rules: [
                  { action: "HOST_EVENT", points: "+50 pts", cap: "2/month" },
                  { action: "ATTEND_EVENT", points: "+10 pts", cap: "2/day" },
                  { action: "ASK_AMA_QUESTION", points: "+5 pts", cap: "3/event" },
                ],
              },
              {
                module: "Mentorship & Matching",
                icon: Network,
                category: "Network & Trust",
                rules: [
                  { action: "COMPLETE_SESSION", points: "+25 pts", cap: "2/week" },
                  { action: "POSITIVE_MENTOR_REVIEW", points: "+15 pts", cap: "4/month" },
                  { action: "BECOME_MENTOR", points: "+30 pts", cap: "One-time" },
                ],
              },
              {
                module: "Trust Center & Safety",
                icon: Shield,
                category: "Trust & Safety",
                rules: [
                  { action: "VERIFY_IDENTITY", points: "+50 pts", cap: "One-time" },
                  { action: "SIGN_POLICY_UPDATE", points: "+10 pts", cap: "Per update" },
                  { action: "CONFIRMED_SPAM_STRIKE", points: "-50 pts", cap: "No cap" },
                ],
              },
              {
                module: "Polls & Surveys",
                icon: FileText,
                category: "Engagement & Consistency",
                rules: [
                  { action: "COMPLETE_SURVEY", points: "+15 pts", cap: "5/month" },
                  { action: "VOTE_IN_POLL", points: "+2 pts", cap: "5/day" },
                  { action: "CREATE_COMMUNITY_POLL", points: "+10 pts", cap: "1/day" },
                ],
              },
              {
                module: "Forums & Q&A",
                icon: HelpCircle,
                category: "Contribution & Trust",
                rules: [
                  { action: "ACCEPTED_SOLUTION", points: "+25 pts", cap: "5/day" },
                  { action: "UPVOTED_ANSWER", points: "+5 pts", cap: "15/day" },
                  { action: "POST_QUESTION", points: "+5 pts", cap: "3/day" },
                ],
              },
            ].map((mod, i) => (
              <div
                key={i}
                className="p-5 rounded-[20px] bg-card border border-border/60 hover:border-border transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-muted border border-border/50 flex items-center justify-center text-foreground">
                        <mod.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">
                          {mod.module}
                        </h4>
                        <span className="text-[10px] text-muted-foreground">
                          {mod.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    {mod.rules.map((r, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border/30 text-[11px]"
                      >
                        <span className="font-mono text-xs text-foreground">
                          {r.action}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-mono font-bold text-xs",
                              r.points.startsWith("+")
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400",
                            )}
                          >
                            {r.points}
                          </span>
                          <span className="text-[9px] text-muted-foreground">
                            {r.cap}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 text-right">
                  <Link
                    href="/gamification/impact-score/rules"
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View active rules &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* SECTION 6: DECAY & TRUST SAFEGUARDS                               */}
        {/* ----------------------------------------------------------------- */}
        <section className="space-y-4">
          <DashboardSectionHeading
            title="6. Inactivity Decay & Trust Safeguards"
            description="How the engine manages dormancy, decay curves, and moderation penalties."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-[20px] bg-muted/20 border border-border/60 space-y-3">
              <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Clock className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-foreground">
                Inactivity Grace Period
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When a member stops taking actions, a grace period (e.g. 7 to 14
                days) shields their score. No decay occurs during this window.
              </p>
              <div className="text-[10px] font-mono text-muted-foreground p-2 rounded bg-card border border-border/50">
                Grace Period: Default 7 Days
              </div>
            </div>

            <div className="p-5 rounded-[20px] bg-muted/20 border border-border/60 space-y-3">
              <div className="h-8 w-8 rounded-lg bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <TrendingDown className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-foreground">
                Linear Decay Rate
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Once past the grace period, the engine applies a gentle weekly
                decay (e.g. -5 points / week). Scores never drop below the base
                threshold through decay alone.
              </p>
              <div className="text-[10px] font-mono text-muted-foreground p-2 rounded bg-card border border-border/50">
                Decay Rate: -5 pts / 7 days
              </div>
            </div>

            <div className="p-5 rounded-[20px] bg-muted/20 border border-border/60 space-y-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-foreground">
                Trust Violation Penalties
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Confirmed strikes, spam flags, and moderation bans hit the
                Trust category with heavy negative multipliers, instantly
                dropping overall tier ranking.
              </p>
              <div className="text-[10px] font-mono text-muted-foreground p-2 rounded bg-card border border-border/50">
                Strike Impact: -50 to -200 pts
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* SECTION 7: QUICK ACTIONS & NEXT STEPS                             */}
        {/* ----------------------------------------------------------------- */}
        <section className="p-6 rounded-[24px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-sky-500/10 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">
                Ready to configure your Impact Score Engine?
              </h3>
              <p className="text-xs text-muted-foreground">
                Adjust scoring rules, manage active template weights, or review
                the real-time audit ledger.
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link href="/gamification/impact-score/rules">
                <Button
                  size="sm"
                  className="rounded-xl text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Manage Rules
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/gamification/impact-score/settings">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs font-semibold gap-1.5 border-border bg-background hover:bg-muted"
                >
                  Engine Settings
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
