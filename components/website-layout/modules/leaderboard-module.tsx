"use client";

import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";
import {
  CleanMinimalist,
  CardRankings,
  PodiumView,
  NeonArcade,
  FlashyArena,
  LeaderboardEntry,
} from "./leaderboard";

interface LeaderboardModuleProps {
  module: ModuleData;
  previewDevice?: string;
}

const DEFAULT_DEMO_ENTRIES: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Alex Rivera",
    score: "12,450",
    change: "up",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    category: "Power Architect",
    role: "Lead Architect",
    streak: 14,
    level: 48,
    tier: "Mythic Legend",
  },
  {
    rank: 2,
    name: "Sarah Chen",
    score: "11,820",
    change: "up",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    category: "Elite Contributor",
    role: "Product Designer",
    streak: 9,
    level: 44,
    tier: "Grandmaster",
  },
  {
    rank: 3,
    name: "Jordan Smith",
    score: "10,900",
    change: "down",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    category: "Master Reviewer",
    role: "Core Engineer",
    streak: 6,
    level: 39,
    tier: "Immortal",
  },
  {
    rank: 4,
    name: "Elena Rodriguez",
    score: "9,650",
    change: "up",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
    category: "Top Mentor",
    role: "Senior Developer",
    streak: 4,
    level: 35,
    tier: "Diamond Elite",
  },
  {
    rank: 5,
    name: "David Kim",
    score: "8,900",
    change: "neutral",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    category: "Innovator",
    role: "Tech Lead",
    streak: 3,
    level: 31,
    tier: "Platinum",
  },
];

export const LeaderboardModule = ({ module }: LeaderboardModuleProps) => {
  const { content = {}, layout } = module;
  const rawRankings = content.rankings || [];

  // Parse raw rankings or provide high-fidelity defaults
  const entries: LeaderboardEntry[] =
    rawRankings.length > 0
      ? rawRankings.map((r: Record<string, unknown>, idx: number) => {
          let parsedStats = [];
          try {
            if (typeof r.stats === "string") {
              parsedStats = JSON.parse(r.stats);
            } else if (Array.isArray(r.stats)) {
              parsedStats = r.stats;
            }
          } catch {
            console.error("Failed to parse stats for ranking", idx);
          }

          return {
            rank: typeof r.rank === "number" ? r.rank : idx + 1,
            name: (r.name as string) || `Member #${idx + 1}`,
            score: r.score != null ? String(r.score) : "0",
            avatar: r.avatar as string | undefined,
            role: (r.role as string) || (r.badge as string) || undefined,
            category: r.category as string | undefined,
            change: r.change as "up" | "down" | "neutral" | undefined,
            stats: parsedStats,
            streak: typeof r.streak === "number" ? r.streak : undefined,
            level: typeof r.level === "number" ? r.level : undefined,
            tier: r.tier as string | undefined,
          };
        })
      : DEFAULT_DEMO_ENTRIES;

  const layoutContent = {
    title: content.title,
    description: content.description,
    entries,
  };

  const renderVariant = () => {
    switch (layout) {
      case "clean-minimalist":
      case "rank-list":
        return <CleanMinimalist content={layoutContent} />;
      case "card-rankings":
      case "stats-board":
        return <CardRankings content={layoutContent} />;
      case "podium-view":
        return <PodiumView content={layoutContent} />;
      case "neon-arcade":
        return <NeonArcade content={layoutContent} />;
      case "flashy-arena":
        return <FlashyArena content={layoutContent} />;
      default:
        return <CleanMinimalist content={layoutContent} />;
    }
  };

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className={cn(
        "py-16 md:py-24",
        layout === "neon-arcade" && "bg-slate-950/60",
        layout === "flashy-arena" && "bg-slate-950/40"
      )}
    >
      <ModuleHeader
        title={content.title || "Community Leaderboard"}
        description={
          content.description ||
          "Celebrating our most dedicated contributors, top earners, and community champions."
        }
        alignment="center"
        containerClassName="mb-12 md:mb-16"
        titleColor={content.titleColor}
        descriptionColor={content.descriptionColor}
        hideTitle={content.hideTitle}
        hideDescription={content.hideDescription}
        layoutSettings={content.layoutSettings}
      />

      {renderVariant()}
    </ModuleContainer>
  );
};
