"use client";

import React from "react";
import { Trophy, Timer, Swords, Users, Star, Calendar } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Badge } from "@/components/ui/badge";

const upcomingFeatures = [
  { icon: Timer, label: "Timed Sprints", description: "Short-burst point challenges with live countdowns" },
  { icon: Users, label: "Team Battles", description: "Group vs group competitions across communities" },
  { icon: Star, label: "Badge Quests", description: "Guided progression with exclusive unlocks" },
  { icon: Calendar, label: "Seasonal Events", description: "Platform-wide recurring campaigns" },
];

const CompetitionsPage = () => {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Competitions"
        badgeText="Coming Soon"
        description="Time-bound challenges and events to drive high-intensity community engagement."
        icon={Swords}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <Badge variant="secondary" className="text-[11px] font-medium gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
            Feature in development
          </Badge>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-12">
        <div className="max-w-lg mx-auto text-center space-y-8">
          {/* Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className="h-20 w-20 rounded-2xl bg-muted border border-border flex items-center justify-center">
              <Trophy className="h-9 w-9 text-muted-foreground/50" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-amber-100 border border-amber-200 rounded-lg flex items-center justify-center text-base">
              🚧
            </div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              Competitions are coming
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We're building a powerful engine for cross-community challenges, seasonal leaderboards, and exclusive reward tracks.
            </p>
          </div>

          {/* Upcoming Features */}
          <div className="grid grid-cols-2 gap-3 text-left pt-2">
            {upcomingFeatures.map((feature) => (
              <div
                key={feature.label}
                className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center mb-3">
                  <feature.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default CompetitionsPage;
