"use client";

import React from "react";
import { BookOpen, AlertCircle, Activity, Award, Shield, Network, Calendar, TrendingDown } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemCard } from "@/components/layout/ecosystem/ecosystem-analytics";

export default function ImpactDocumentationPage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Impact Score Engine Documentation"
        description="Learn how the reputation-based scoring system measures and calculates community value."
        badgeText="Documentation"
        icon={BookOpen}
        breadcrumbs={[{ label: "Gamification", href: "/gamification" }, { label: "Impact Score", href: "/impact-score" }, { label: "Documentation" }]}
      />
      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        <div className="max-w-4xl space-y-8">
          
          {/* Overview */}
          <EcosystemCard
            title="Overview"
            description="What is the Impact Score?"
            icon={BookOpen}
          >
            <div className="mt-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-sm text-indigo-900 leading-relaxed">
              The Impact Score Engine is a dynamic, reputation-based scoring system designed to measure the true value a user brings to a community. Unlike standard gamification points (which only go up as users grind tasks), the Impact Score behaves like a <strong>"credit score"</strong> for the community. It can go up, go down, and decays over time if a user becomes inactive.
            </div>
          </EcosystemCard>

          <h2 className="text-xl font-bold text-zinc-900 pt-4">How It Works Conceptually</h2>

          {/* 1. Categories & Weights */}
          <EcosystemCard
            title="1. Categories & Weights"
            description="The 5 key pillars of an Impact Score."
            icon={Award}
          >
            <div className="mt-4 space-y-4">
              <p className="text-sm text-zinc-600">
                An Impact Score is calculated based on a weighted average of 5 key categories. The Community Admin can adjust these weights using Impact Templates:
              </p>
              
              <div className="grid gap-3">
                {[
                  { icon: Activity, title: "Engagement (e.g., 30%)", desc: "Liking, commenting, attending events, reading posts.", color: "text-blue-600 bg-blue-50 border-blue-100" },
                  { icon: Award, title: "Contribution (e.g., 30%)", desc: "Creating high-quality posts, hosting events, answering forum questions.", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                  { icon: Shield, title: "Trust (e.g., 20%)", desc: "Having verified profile details, receiving endorsements, NOT receiving reports/bans.", color: "text-purple-600 bg-purple-50 border-purple-100" },
                  { icon: Network, title: "Network (e.g., 10%)", desc: "Number of mutual connections, followers, or successful mentorship matches.", color: "text-amber-600 bg-amber-50 border-amber-100" },
                  { icon: Calendar, title: "Consistency (e.g., 10%)", desc: "Logging in regularly, maintaining streaks.", color: "text-rose-600 bg-rose-50 border-rose-100" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-zinc-100 bg-white">
                    <div className={`p-2 rounded-lg border ${item.color}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">{item.title}</h4>
                      <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </EcosystemCard>

          {/* 2. Scoring Mechanism */}
          <EcosystemCard
            title="2. Scoring Mechanism"
            description="How points are bounded and recalculated."
            icon={Activity}
          >
            <div className="mt-4 space-y-4 text-sm text-zinc-600 leading-relaxed">
              <ul className="space-y-3 list-disc pl-5">
                <li><strong>Min/Max Boundaries:</strong> By default, a score might range from 0 to 1000 (like a credit score).</li>
                <li><strong>Default Score:</strong> New users start with a base score (e.g., 0, or 300 to show some initial trust).</li>
                <li><strong>Activity Window:</strong> The score is continuously recalculated based on a rolling window (e.g., the last 30 or 90 days). Ancient actions hold less weight than recent ones.</li>
              </ul>
            </div>
          </EcosystemCard>

          {/* 3. Impact Rules */}
          <EcosystemCard
            title="3. Impact Rules"
            description="Mapping specific platform actions to points."
            icon={AlertCircle}
          >
            <div className="mt-4 space-y-4">
              <p className="text-sm text-zinc-600">
                Admins define specific Impact Rules mapped to platform modules. Examples:
              </p>
              <div className="bg-zinc-900 text-zinc-300 p-4 rounded-xl font-mono text-xs space-y-2">
                <div className="flex gap-2"><span className="text-indigo-400">Module:</span> FEED, <span className="text-indigo-400">Action:</span> CREATE_POST <span className="text-emerald-400">-&gt; +10 Points</span> <span className="text-zinc-500">(Category: Contribution)</span></div>
                <div className="flex gap-2"><span className="text-indigo-400">Module:</span> EVENTS, <span className="text-indigo-400">Action:</span> ATTEND_EVENT <span className="text-emerald-400">-&gt; +5 Points</span> <span className="text-zinc-500">(Category: Engagement)</span></div>
                <div className="flex gap-2"><span className="text-indigo-400">Module:</span> MODERATION, <span className="text-indigo-400">Action:</span> SPAM_REPORTED <span className="text-rose-400">-&gt; -50 Points</span> <span className="text-zinc-500">(Category: Trust)</span></div>
              </div>
              <p className="text-sm text-zinc-600 mt-4">
                <strong>Daily Limits:</strong> To prevent abuse, rules have daily limits (e.g., you can only get points for "Liking a post" up to 10 times a day).
              </p>
            </div>
          </EcosystemCard>

          {/* 4. Penalties and Decay */}
          <EcosystemCard
            title="4. Penalties and Decay"
            description="Handling inactivity and toxic behavior."
            icon={TrendingDown}
          >
            <div className="mt-4 space-y-4 text-sm text-zinc-600 leading-relaxed">
              <ul className="space-y-3 list-disc pl-5">
                <li><strong>Decay Engine:</strong> If a user is completely inactive for a certain period (e.g., 7 days), the system starts slowly decaying their score (e.g., -5 points per week). This ensures the top leaderboard only shows truly active members.</li>
                <li><strong>Penalties:</strong> Toxic behavior directly hits the "Trust" category, dragging the overall score down heavily.</li>
              </ul>
            </div>
          </EcosystemCard>

        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
