"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import {
  Star,
  Shield,
  Zap,
  Target,
  Trophy,
  Crown,
  Medal,
  TrendingUp,
  Users,
} from "lucide-react";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface Entry {
  rank: number;
  name: string;
  score: string;
  avatar?: string;
  role?: string;
  category?: string;
  change?: "up" | "down" | "neutral";
  stats?: { label: string; value: string }[];
}

interface LayoutProps {
  content: {
    title?: string;
    description?: string;
    entries: Entry[];
  };
}

const CardRankings = ({ content }: LayoutProps) => {
  const { entries } = content;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entries.map((entry, idx) => (
        <div
          key={idx}
          className="group relative bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] hover:bg-white hover:border-slate-900 transition-all duration-500 hover:shadow-2xl"
        >
          <div className="absolute top-8 right-8 text-4xl font-black text-slate-100 group-hover:text-slate-900/5 transition-colors select-none">
            #{entry.rank}
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm shrink-0">
              {entry.avatar ? (
                <img
                  src={entry.avatar}
                  alt={entry.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  👤
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-black text-slate-900 tracking-tight truncate">
                {entry.name}
              </h3>
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                {entry.role || "Community Member"}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 group-hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500" size={16} />
              <span className="text-sm font-black text-slate-900">
                {entry.score}
              </span>
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Global Pts
            </div>
          </div>

          <div className="mt-8 flex gap-2">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600/10 group-hover:text-blue-600 transition-colors"
              >
                {i === 0 ? (
                  <Shield size={14} />
                ) : i === 1 ? (
                  <Zap size={14} />
                ) : (
                  <Target size={14} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const PodiumView = ({ content }: LayoutProps) => {
  const { entries } = content;

  const first = entries.find((e) => e.rank === 1);
  const second = entries.find((e) => e.rank === 2);
  const third = entries.find((e) => e.rank === 3);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-end justify-center gap-8 md:gap-0 min-h-[500px] mb-20">
        {/* Second Place */}
        {second && (
          <div className="w-full md:w-64 flex flex-col items-center">
            <div className="mb-8 text-center px-4 w-full">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-slate-300/30 mb-4 mx-auto relative group">
                {second.avatar ? (
                  <img
                    src={second.avatar}
                    alt={second.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-4xl">
                    👤
                  </div>
                )}
                <div className="absolute top-0 right-0 p-2 bg-slate-300 text-slate-900 rounded-bl-xl font-black text-[10px]">
                  #2
                </div>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white truncate w-full">
                {second.name}
              </div>
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">
                {second.score} pts
              </div>
            </div>
            <div className="w-full bg-slate-800/50 border-x border-t border-white/10 rounded-t-[3rem] h-[160px] flex items-center justify-center relative shadow-2xl">
              <div className="text-6xl font-black text-white/5 absolute -bottom-4">
                2nd
              </div>
            </div>
          </div>
        )}

        {/* First Place */}
        {first && (
          <div className="w-full md:w-80 flex flex-col items-center relative z-20 -mt-10 md:mt-0">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="mb-10 text-center px-4 relative w-full">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden border-4 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.3)] mb-6 mx-auto relative group">
                {first.avatar ? (
                  <img
                    src={first.avatar}
                    alt={first.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-6xl">
                    👤
                  </div>
                )}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <Crown
                    className="text-yellow-400 fill-yellow-400 drop-shadow-2xl"
                    size={48}
                  />
                </div>
                <div className="absolute top-0 right-0 p-3 bg-yellow-400 text-slate-900 rounded-bl-2xl font-black text-xs">
                  Winner
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">
                {first.name}
              </div>
              <div className="text-sm font-black text-blue-400 uppercase tracking-[0.2em]">
                {first.score} pts
              </div>
            </div>
            <div className="w-full bg-linear-to-b from-blue-600 to-blue-900 border-x border-t border-blue-400/30 rounded-t-[4rem] h-[260px] flex items-center justify-center relative shadow-[0_-20px_60px_rgba(37,99,235,0.2)]">
              <div className="text-8xl font-black text-white/10 absolute -bottom-6">
                1st
              </div>
              <Trophy
                className="text-white/20 absolute top-10"
                size={80}
                strokeWidth={1}
              />
            </div>
          </div>
        )}

        {/* Third Place */}
        {third && (
          <div className="w-full md:w-64 flex flex-col items-center">
            <div className="mb-8 text-center px-4 w-full">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-orange-400/30 mb-4 mx-auto relative group">
                {third.avatar ? (
                  <img
                    src={third.avatar}
                    alt={third.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-4xl">
                    👤
                  </div>
                )}
                <div className="absolute top-0 right-0 p-2 bg-orange-400 text-white rounded-bl-xl font-black text-[10px]">
                  #3
                </div>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white truncate w-full">
                {third.name}
              </div>
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">
                {third.score} pts
              </div>
            </div>
            <div className="w-full bg-slate-800/50 border-x border-t border-white/10 rounded-t-[3rem] h-[120px] flex items-center justify-center relative shadow-2xl">
              <div className="text-6xl font-black text-white/5 absolute -bottom-4">
                3rd
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Honorable Mentions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 pt-20 border-t border-slate-200 dark:border-white/5">
        {entries.slice(3, 9).map((entry, idx) => (
          <div key={idx} className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 mb-3 group-hover:border-blue-500 dark:group-hover:border-white/30 transition-all">
              {entry.avatar ? (
                <img
                  src={entry.avatar}
                  alt={entry.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl">
                  👤
                </div>
              )}
            </div>
            <div className="text-[10px] font-black text-slate-400 truncate w-full text-center group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
              {entry.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RankList = ({ content }: LayoutProps) => {
  const { entries } = content;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="grid grid-cols-[80px_1fr_120px_100px] gap-4 p-8 border-b border-slate-200 bg-white items-center">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
            Rank
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Contributor
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
            Points
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
            Status
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {entries.map((entry, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[80px_1fr_120px_100px] gap-4 p-6 hover:bg-white transition-colors items-center group"
            >
              <div className="flex justify-center">
                {entry.rank === 1 ? (
                  <div className="w-10 h-10 rounded-2xl bg-yellow-400 flex items-center justify-center text-white shadow-lg shadow-yellow-400/30">
                    <Trophy size={20} />
                  </div>
                ) : entry.rank === 2 ? (
                  <div className="w-10 h-10 rounded-2xl bg-slate-300 flex items-center justify-center text-white">
                    <Medal size={20} />
                  </div>
                ) : entry.rank === 3 ? (
                  <div className="w-10 h-10 rounded-2xl bg-orange-400 flex items-center justify-center text-white">
                    <Medal size={20} />
                  </div>
                ) : (
                  <div className="text-xl font-black text-slate-300 group-hover:text-slate-900 transition-colors">
                    {entry.rank}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 overflow-hidden border-2 border-white shadow-sm shrink-0">
                  {entry.avatar ? (
                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      👤
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {entry.name}
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                    {entry.category || "General Contributor"}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-slate-900">
                  {entry.score}
                </div>
              </div>

              <div className="flex justify-center">
                {entry.change === "up" ? (
                  <div className="flex items-center gap-1 text-green-500 font-black text-xs">
                    <TrendingUp size={14} />
                  </div>
                ) : entry.change === "down" ? (
                  <div className="text-red-400 text-xs font-black rotate-180">
                    <TrendingUp size={14} />
                  </div>
                ) : (
                  <div className="w-4 h-1 bg-slate-200 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatsBoard = ({ content }: LayoutProps) => {
  const { entries } = content;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {entries.slice(0, 4).map((entry, idx) => (
        <div
          key={idx}
          className="group bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 hover:border-slate-300 hover:shadow-2xl transition-all duration-500"
        >
          <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-50">
            <div className="relative">
              <div className="w-20 h-20 rounded-4xl overflow-hidden border-4 border-slate-50 relative z-10">
                {entry.avatar ? (
                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-4xl">
                    👤
                  </div>
                )}
              </div>
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm z-20 shadow-xl border-4 border-white">
                {entry.rank}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight truncate">
                {entry.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Zap className="text-yellow-500" size={14} />
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  {entry.role || "Master Contributor"}
                </span>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <div className="text-3xl font-black text-blue-600 tracking-tighter">
                {entry.score}
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                Total Points
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {(
              entry.stats || [
                { label: "Pull Requests", value: "142" },
                { label: "Reviews", value: "89" },
                { label: "Impact", value: "High" },
                { label: "Streak", value: "12 Days" },
              ]
            ).map((stat, sIdx) => (
              <div key={sIdx}>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </div>
                <div className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-50 text-right">
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-colors">
              Detailed Contribution Stats
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

interface LeaderboardModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const LeaderboardModule = ({
  module,
  previewDevice,
}: LeaderboardModuleProps) => {
  const { content, layout } = module;
  const rankings = content.rankings || [];

  // Transform rankings to entries expected by layouts
  const entries: Entry[] = rankings.map((r: any, idx: number) => {
    let parsedStats = [];
    try {
      if (typeof r.stats === "string") {
        parsedStats = JSON.parse(r.stats);
      } else if (Array.isArray(r.stats)) {
        parsedStats = r.stats;
      }
    } catch (e) {
      console.error("Failed to parse stats for ranking", idx);
    }

    return {
      rank: r.rank || idx + 1,
      name: r.name,
      score: String(r.score || 0),
      avatar: r.avatar,
      role: r.role || r.badge, // Fallback to badge if role not set
      category: r.category,
      change: r.change,
      stats: parsedStats,
    };
  });

  const layoutContent = {
    title: content.title,
    description: content.description,
    entries,
  };

  if (entries.length === 0) {
    return (
      <ModuleContainer>
        <ModuleHeader
          title={content.title || "Leaderboard"}
          description={content.description || "Top community members"}
          alignment="center"
          titleColor={content.titleColor}
          descriptionColor={content.descriptionColor}
          hideTitle={content.hideTitle}
          hideDescription={content.hideDescription}
        />
        <div className="text-center py-12 bg-white rounded-4xl border border-dashed border-slate-200">
          <p className="text-muted-foreground">
            No rankings added yet. Add entries in the settings panel.
          </p>
        </div>
      </ModuleContainer>
    );
  }

  // Determine dark mode layouts if any (currently mostly light mostly, Podium has dark text fallbacks)
  const isDark = false;

  return (
    <ModuleContainer
      className={cn(
        isDark && "bg-slate-950 text-white py-24",
        !isDark && "py-24"
      )}
      containerSettings={{ fullWidth: false }}
    >
      <ModuleHeader
        title={content.title || "Leaderboard"}
        description={content.description || "Top community members"}
        alignment="center"
        containerClassName="mb-16"
        titleColor={content.titleColor}
        descriptionColor={content.descriptionColor}
        hideTitle={content.hideTitle}
        hideDescription={content.hideDescription}
      />

      {layout === "card-rankings" && <CardRankings content={layoutContent} />}
      {layout === "podium-view" && <PodiumView content={layoutContent} />}
      {layout === "rank-list" && <RankList content={layoutContent} />}
      {layout === "stats-board" && <StatsBoard content={layoutContent} />}

      {/* Default Fallback */}
      {(!layout ||
        !["card-rankings", "podium-view", "rank-list", "stats-board"].includes(
          layout
        )) && <RankList content={layoutContent} />}
    </ModuleContainer>
  );
};
