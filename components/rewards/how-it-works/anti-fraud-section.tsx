"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  Zap,
  Users,
  Lock,
  Ban,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FRAUD_GUARDS = [
  {
    icon: Users,
    title: "Membership Tier Gating",
    badge: "Audience Targeting",
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    desc: "Reserve high-value gift cards or high discount percentages exclusively for VIP, Gold, or Alumni member tiers.",
    action: "Gated per tier",
  },
  {
    icon: Clock,
    title: "Minimum Account Age",
    badge: "Sybil Protection",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    desc: "Prevent throwaway multi-accounting and bot farming by requiring member profiles to be active for at least N days (e.g. 7 or 30 days).",
    action: "Anti-bot filter",
  },
  {
    icon: Zap,
    title: "Activity Points Threshold",
    badge: "Proof of Contribution",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    desc: "Require members to have earned a minimum threshold of gamification points from genuine discussions, posts, or event attendance before playing.",
    action: "Engagement gated",
  },
  {
    icon: Lock,
    title: "Fair-Play Limits & Cooldowns",
    badge: "Velocity Control",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    desc: "Enforce strict per-user lifetime claim limits (e.g. max 1 claim per member) and cooldown periods (e.g. 24 hours between attempts).",
    action: "Velocity caps",
  },
  {
    icon: Ban,
    title: "Auto Moderation Guard",
    badge: "Safety Shield",
    badgeColor: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    desc: "Members who have received community safety warnings or are currently under moderation review are automatically barred from claiming rewards.",
    action: "Auto blacklist",
  },
  {
    icon: ShieldCheck,
    title: "Two-Phase Reservation Lock",
    badge: "Financial Security",
    badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    desc: "Gift card wallet funds and limited voucher stock are temporarily reserved during game play and only captured upon successful validation.",
    action: "Zero fund loss",
  },
];

export function AntiFraudSection() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20">
              Security & Guardrails
            </Badge>
            <span className="text-xs text-muted-foreground">• Abuse Prevention Engine</span>
          </div>
          <h2 className="text-lg font-bold text-foreground">Dynamic Audience Targeting & Anti-Fraud Engine</h2>
          <p className="text-xs text-muted-foreground">
            Protect your budget and ensure rewards reach genuine, high-value community members with multi-layered verification rules.
          </p>
        </div>

        <Link href="/gamification/rewards/fraud">
          <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1 shrink-0">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
            View Fraud Control Audit
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FRAUD_GUARDS.map((guard, idx) => {
          const Icon = guard.icon;
          return (
            <Card key={idx} className="rounded-xl border-border/60 bg-card/60 backdrop-blur-xs p-4 space-y-3 hover:border-primary/40 hover:shadow-xs transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="h-9 w-9 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center text-foreground shrink-0">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <Badge variant="outline" className={cn("text-[9px] font-bold uppercase tracking-wider", guard.badgeColor)}>
                  {guard.badge}
                </Badge>
              </div>

              <div>
                <h3 className="text-xs font-bold text-foreground mb-1">{guard.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{guard.desc}</p>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                <span>Protection Mechanism:</span>
                <span className="font-semibold text-foreground">{guard.action}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
