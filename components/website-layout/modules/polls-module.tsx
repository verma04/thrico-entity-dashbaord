"use client";

import React, { useState, useEffect } from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";
import {
  Zap,
  Users,
  Flame,
  Trophy,
  TrendingUp,
  CheckCircle2,
  Circle,
  Clock,
  Share2,
  LayoutDashboard,
  Target,
  Download,
  PieChart,
  Activity,
  ArrowRight,
} from "lucide-react";

// --- Interfaces ---

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  category?: string;
  description?: string;
  endDate?: string;
}

interface LayoutProps {
  polls: Poll[];
  isMobile?: boolean;
}

// --- Live Voting Layout ---

export const LiveVoting: React.FC<LayoutProps> = ({ polls, isMobile }) => {
  const [pulse, setPulse] = useState(false);
  const poll = polls[0] || {
    question: "Loading Poll...",
    options: [],
    totalVotes: 0,
  };

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div
        className={cn(
          "bg-slate-900 rounded-[4rem] overflow-hidden relative border border-white/5 shadow-3xl",
          isMobile ? "p-6" : "p-10 lg:p-20"
        )}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -mr-48 -mt-48 transition-all duration-1000" />

        <div className="relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full bg-red-500",
                    pulse && "animate-ping"
                  )}
                />
                Live Ecosystem Voting
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter leading-tight max-w-2xl italic">
                {poll.question}
              </h2>
            </div>

            <div className="flex-shrink-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center min-w-[200px]">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <span className="block text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform">
                {poll.totalVotes.toLocaleString()}
              </span>
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                Active Voters
              </span>
            </div>
          </div>

          <div
            className={cn(
              "grid gap-6",
              isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
            )}
          >
            {poll.options.map((option, idx) => (
              <button
                key={option.id || idx}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] text-left hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
              >
                {/* Ranking Emblem */}
                {idx === 0 && (
                  <div className="absolute top-4 right-4 text-amber-500 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Trophy className="w-8 h-8 rotate-12" />
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black italic">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">
                      {option.text}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
                      <span>Momentum</span>
                      <span className="text-white">{option.percentage}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out",
                          idx === 0
                            ? "from-blue-500 to-indigo-500"
                            : "from-slate-600 to-slate-500"
                        )}
                        style={{ width: `${option.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 p-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <Zap className="w-6 h-6 text-blue-400 fill-current animate-pulse" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <div className="inline-flex items-center gap-3 text-white/30 text-[9px] font-black uppercase tracking-widest">
              <Flame className="w-4 h-4" />
              Trending: High Engagement in Region SEA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Poll Card Layout ---

export const PollCard: React.FC<LayoutProps> = ({ polls, isMobile }) => {
  const [selectedOption, setSelectedOption] = useState<Record<string, string>>(
    {}
  );

  const handleVote = (pollId: string, optionId: string) => {
    setSelectedOption((prev) => ({ ...prev, [pollId]: optionId }));
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {polls.map((poll, idx) => (
        <div
          key={poll.id || idx}
          className={cn(
            "group bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-blue-500/5 hover:border-slate-900/10 transition-all duration-500",
            isMobile ? "p-8" : "p-8 sm:p-12"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Community Poll
              </span>
            </div>
            <Share2 className="w-4 h-4 text-slate-300 hover:text-slate-900 cursor-pointer transition-colors" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8 leading-tight">
            {poll.question}
          </h3>

          {/* Options */}
          <div className="space-y-4">
            {poll.options.map((option, optIdx) => {
              const optionId = option.id || `opt-${optIdx}`;
              const isSelected = selectedOption[poll.id] === optionId;
              const hasVoted = !!selectedOption[poll.id];

              return (
                <button
                  key={optionId}
                  onClick={() => !hasVoted && handleVote(poll.id, optionId)}
                  disabled={hasVoted}
                  className={cn(
                    "relative w-full p-6 lg:p-7 rounded-2.5xl border-2 text-left transition-all duration-500 overflow-hidden",
                    isSelected
                      ? "border-blue-600 bg-blue-50/50"
                      : "border-slate-100 bg-slate-50 hover:border-slate-300",
                    hasVoted && !isSelected ? "opacity-60" : ""
                  )}
                >
                  {/* Progress Glow */}
                  {hasVoted && (
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 transition-all duration-1000 ease-out",
                        isSelected ? "bg-blue-600/10" : "bg-slate-200/50"
                      )}
                      style={{ width: `${option.percentage}%` }}
                    />
                  )}

                  <div className="relative flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                      {hasVoted ? (
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                            isSelected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-300"
                          )}
                        >
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                      )}
                      <span className="text-sm font-black text-slate-900">
                        {option.text}
                      </span>
                    </div>
                    {hasVoted && (
                      <span className="text-sm font-black text-slate-900 italic">
                        {option.percentage}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Meta */}
          <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {poll.totalVotes.toLocaleString()} Votes
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Ends in 2 Days
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Poll Grid Layout ---

export const PollGrid: React.FC<LayoutProps> = ({ polls, isMobile }) => {
  return (
    <div
      className={cn(
        "grid gap-8",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {polls.map((poll, idx) => (
        <div
          key={poll.id || idx}
          className="group flex flex-col bg-white p-10 rounded-[3rem] border border-slate-200 hover:border-slate-900/10 hover:shadow-2xl transition-all duration-500"
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-lg border border-blue-100">
              {poll.category || "General"}
            </span>
            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" />
              {poll.totalVotes}
            </div>
          </div>

          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8 leading-tight group-hover:text-blue-600 transition-colors flex-1">
            {poll.question}
          </h3>

          <div className="space-y-4 mb-10 pt-8 border-t border-slate-50">
            {poll.options.slice(0, 2).map((opt, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <span>{opt.text}</span>
                  <span className="text-slate-900">{opt.percentage}%</span>
                </div>
                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-200 group-hover:bg-blue-200 transition-all duration-700"
                    style={{ width: `${opt.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            {poll.options.length > 2 && (
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">
                + {poll.options.length - 2} more options
              </p>
            )}
          </div>

          <button className="w-full py-4.5 bg-slate-900 text-white rounded-2.5xl font-black uppercase tracking-widest text-[9px] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3">
            Cast Your Vote
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

// --- Results Chart Layout ---

export const ResultsChart: React.FC<LayoutProps> = ({ polls, isMobile }) => {
  const poll = polls[0] || {
    question: "Loading...",
    options: [],
    totalVotes: 0,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div
        className={cn(
          "bg-white rounded-[4rem] border border-slate-200 shadow-3xl shadow-blue-500/5",
          isMobile ? "p-8" : "p-10 lg:p-16"
        )}
      >
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Chart Visualization */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-center overflow-hidden group">
              {/* Simulated Chart Logic (Donut/Pie) */}
              <div className="w-48 h-48 rounded-full border-[20px] border-slate-200 group-hover:border-slate-300 transition-all duration-700 relative">
                <div className="absolute inset-0 rounded-full border-[20px] border-blue-600 border-t-transparent border-r-transparent rotate-45" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    {poll.totalVotes > 1000
                      ? (poll.totalVotes / 1000).toFixed(1) + "K"
                      : poll.totalVotes}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Total Votes
                  </span>
                </div>
              </div>

              {/* Decorative corner icon */}
              <div className="absolute bottom-8 right-8 text-slate-200 group-hover:text-blue-500 transition-colors">
                <PieChart className="w-12 h-12 rotate-12" />
              </div>
            </div>
          </div>

          {/* Detailed Results Side */}
          <div className="flex-1 space-y-8">
            <div>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-3 block">
                Final Audit Results
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
                {poll.question}
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                &quot;The community has spoken. These results will directly
                influence the development roadmap for Q3 2024 and beyond.&quot;
              </p>
            </div>

            <div className="space-y-6">
              {poll.options.map((option, idx) => (
                <div key={option.id || idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-500">{option.text}</span>
                    <span className="text-slate-900 italic">
                      {option.percentage}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out",
                        idx === 0 ? "bg-slate-900" : "bg-slate-300"
                      )}
                      style={{ width: `${option.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <Activity className="w-4 h-4" />
                Verified On-Chain
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors group/btn">
                Methodology
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Results Dashboard Layout ---

export const ResultsDashboard: React.FC<LayoutProps> = ({
  polls,
  isMobile,
}) => {
  const poll = polls[0] || {
    question: "Loading...",
    options: [],
    totalVotes: 0,
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Ecosystem Insights
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Analytics Dashboard v4.2
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" />
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10">
            Share Report
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Question Card (2/3) */}
        <div className="lg:col-span-2 bg-white p-10 lg:p-12 rounded-[3.5rem] border border-slate-200 shadow-3xl shadow-blue-500/5">
          <div className="mb-10">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 block">
              Active Proposal Analysis
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight italic">
              {poll.question}
            </h2>
          </div>

          <div className="space-y-10">
            {poll.options.map((opt, i) => (
              <div key={opt.id || i} className="group cursor-help">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                      Option 0{i + 1}
                    </span>
                    <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {opt.text}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 italic leading-none">
                      {opt.percentage}%
                    </span>
                    <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {opt.votes} Votes
                    </span>
                  </div>
                </div>
                <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000 ease-out",
                      i === 0
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                        : "bg-slate-200"
                    )}
                    style={{ width: `${opt.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Stats (1/3) */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <Activity className="w-8 h-8 text-blue-400" />
              <span className="text-sm font-black uppercase tracking-widest">
                Network Vitality
              </span>
            </div>
            <div className="space-y-6">
              <div>
                <span className="block text-3xl font-black italic mb-1">
                  {poll.totalVotes.toLocaleString()}
                </span>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                  Global Participation
                </span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xl font-black italic">84.2%</span>
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                    Confidence
                  </span>
                </div>
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-900 mb-2">
              Quorum Reached
            </h4>
            <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-widest">
              This poll has met the minimum participation threshold.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Module Component ---

interface PollsModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export function PollsModule({ module, previewDevice }: PollsModuleProps) {
  const { layout, content } = module;
  const rawPolls = content.polls || [];
  const isMobile = previewDevice === "mobile";

  // Normalize polls data with percentage calculation
  const polls: Poll[] = rawPolls.map((poll: any) => {
    const totalVotes =
      poll.totalVotes ||
      poll.options?.reduce(
        (sum: number, opt: any) => sum + (opt.votes || 0),
        0
      ) ||
      0;

    const options = (poll.options || []).map((opt: any) => ({
      ...opt,
      votes: opt.votes || 0,
      percentage:
        totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0,
    }));

    return {
      ...poll,
      totalVotes,
      options,
    };
  });

  // Render appropriate layout
  const renderLayout = () => {
    switch (layout) {
      case "live-voting":
        return <LiveVoting polls={polls} isMobile={isMobile} />;
      case "poll-card":
        return <PollCard polls={polls} isMobile={isMobile} />;
      case "poll-grid":
        return <PollGrid polls={polls} isMobile={isMobile} />;
      case "results-chart":
        return <ResultsChart polls={polls} isMobile={isMobile} />;
      case "results-dashboard":
        return <ResultsDashboard polls={polls} isMobile={isMobile} />;
      default:
        // Render fallback or default layout
        return <PollGrid polls={polls} isMobile={isMobile} />;
    }
  };

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-slate-50 border-y"
    >
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
        titleColor={content.titleColor}
        descriptionColor={content.descriptionColor}
        hideTitle={content.hideTitle}
        hideDescription={content.hideDescription}
      />

      {polls.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-muted-foreground">
            No polls added yet. Add polls in the settings panel.
          </p>
        </div>
      ) : (
        renderLayout()
      )}
    </ModuleContainer>
  );
}
