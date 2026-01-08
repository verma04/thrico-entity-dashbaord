"use client";

import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";
import {
  Play,
  Mic2,
  Clock,
  Calendar,
  Share2,
  MoreHorizontal,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  Sparkles,
  PlayCircle,
  Headphones,
  ArrowRight,
  ListMusic,
  ChevronRight,
} from "lucide-react";

// --- Interfaces ---

interface Episode {
  id?: string;
  number?: string;
  title?: string;
  date?: string;
  duration?: string;
  description?: string;
  guest?: string;
  audioUrl?: string;
  thumbnail?: string;
  season?: number;
}

interface LayoutProps {
  episodes: Episode[];
  isMobile?: boolean;
}

// --- Episode List Layout ---

export const EpisodeList: React.FC<LayoutProps> = ({ episodes }) => {
  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {episodes.map((episode, idx) => (
        <div
          key={idx}
          className="group relative bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 hover:border-slate-900/10 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            {/* Play Button & Number */}
            <div className="relative flex-shrink-0">
              <button className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg active:scale-90 group/play">
                <Play className="w-6 h-6 fill-current ml-1 group-hover/play:scale-110 transition-transform" />
              </button>
              <span className="absolute -top-3 -left-3 bg-white border border-slate-200 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">
                {episode.number || String(idx + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mb-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors truncate max-w-md">
                  {episode.title}
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                  With {episode.guest || "Guest Speaker"}
                </span>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-1">
                {episode.description ||
                  "Join us for an in-depth conversation on the next phase of modular disruption."}
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />{" "}
                  {episode.date || "Coming Soon"}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> {episode.duration || "45m"}
                </span>
                <span className="flex items-center gap-2 text-blue-500">
                  <Mic2 className="w-3.5 h-3.5" /> Season {episode.season || 1}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <button className="p-3 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-3 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Featured Episode Layout ---

export const FeaturedEpisode: React.FC<LayoutProps> = ({ episodes }) => {
  // Use the first episode as featured or a default placeholder
  const episode = episodes[0] || {
    title: "The Architecture of Autonomy",
    guest: "Dr. Elena Vance",
    duration: "1h 12m",
    description:
      "Deep dive into how modular systems and autonomous agents are converging to create the next generation of resilient infrastructure.",
  };

  return (
    <div className="relative bg-slate-900 rounded-[4rem] overflow-hidden border border-white/10 shadow-3xl group max-w-6xl mx-auto">
      {/* Background Visuals */}
      <div className="absolute inset-0 bg-slate-900" />
      {/* Optional: Add a real background image logic here if available in module settings */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

      <div className="relative p-10 lg:p-20">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Play/Thumbnail Side */}
          <div className="relative flex-shrink-0 group/cover">
            <div className="w-64 h-64 lg:w-80 lg:h-80 bg-slate-800 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-40 group-hover/cover:opacity-60 transition-opacity" />
              {episode.thumbnail ? (
                <img
                  src={episode.thumbnail}
                  alt={episode.title}
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mic2 className="w-24 h-24 text-white/20 group-hover/cover:scale-110 transition-transform duration-700" />
                </div>
              )}
            </div>
            <button className="absolute -bottom-8 -right-8 w-24 h-24 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-90 z-20">
              <Play className="w-10 h-10 fill-current ml-1" />
            </button>
          </div>

          {/* Info Side */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/30 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest mb-10 backdrop-blur-xl">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Featured Episode
            </div>

            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tighter leading-tight italic">
              {episode.title}
            </h2>

            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl">
                  {episode.guest ? "👤" : "🎤"}
                </div>
                <span className="text-lg font-black text-blue-100 italic">
                  {episode.guest || "Special Guest"}
                </span>
              </div>
              <div className="h-px w-10 bg-white/10 hidden lg:block" />
              <span className="text-sm font-black text-white/40 uppercase tracking-[0.2em]">
                {episode.duration || "45m"}
              </span>
            </div>

            <p className="text-blue-100/50 text-xl font-medium leading-relaxed max-w-2xl mb-12">
              {episode.description}
            </p>

            {/* Player UI */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 max-w-2xl">
              <div className="flex items-center gap-8 text-white mb-8">
                <SkipBack className="w-6 h-6 opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
                <div className="flex-1 h-1.5 bg-white/10 rounded-full relative">
                  <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-500 rounded-full" />
                  <div className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
                </div>
                <SkipForward className="w-6 h-6 opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
              </div>

              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                <span>24:12</span>
                <div className="flex items-center gap-4">
                  <Volume2 className="w-4 h-4" />
                  <Maximize2 className="w-4 h-4" />
                </div>
                <span>{episode.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Player Cards Layout ---

export const PlayerCards: React.FC<LayoutProps> = ({ episodes, isMobile }) => {
  return (
    <div
      className={cn(
        "grid gap-8",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {episodes.map((episode, idx) => (
        <div
          key={idx}
          className="group relative bg-white rounded-[3.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col"
        >
          {/* Cover Art */}
          <div className="relative h-72 overflow-hidden bg-slate-900">
            {episode.thumbnail ? (
              <img
                src={episode.thumbnail}
                alt={episode.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800">
                <Headphones className="w-20 h-20 text-white/10 group-hover:scale-125 transition-transform duration-700" />
              </div>
            )}

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-blue-600">
                <PlayCircle className="w-10 h-10 ml-1" />
              </button>
            </div>

            {/* Float Info */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <span className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                EP {episode.number || idx + 1}
              </span>
              <div className="flex items-center gap-2 bg-blue-600/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-blue-400/30">
                <Volume2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {episode.duration || "24m"}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-10 flex-1 flex flex-col">
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
              {episode.title}
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 italic">
              "{episode.description}"
            </p>

            <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">
                  {episode.guest ? "🗣️" : "👤"}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-900 line-clamp-1">
                    {episode.guest || "Host"}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Featured Guest
                  </span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-slate-900 transition-colors" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Season Grid Layout ---

export const SeasonGrid: React.FC<LayoutProps> = ({ episodes, isMobile }) => {
  // Group episodes by season
  const groupedSeasons = episodes.reduce((acc, episode) => {
    const seasonNum = episode.season || 1;
    if (!acc[seasonNum]) {
      acc[seasonNum] = {
        number: seasonNum,
        title: `Season ${seasonNum}`,
        description: `Collection of episodes from season ${seasonNum}.`,
        episodes: [],
      };
    }
    acc[seasonNum].episodes.push(episode);
    return acc;
  }, {} as Record<number, { number: number; title: string; description: string; episodes: Episode[] }>);

  const seasons = Object.values(groupedSeasons).sort(
    (a, b) => a.number - b.number
  );

  // If no episodes, show default mock
  if (seasons.length === 0) {
    // Default empty state handled by parent, but just in case
    return null;
  }

  return (
    <div
      className={cn(
        "grid gap-10",
        isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
      )}
    >
      {seasons.map((season, idx) => (
        <div
          key={idx}
          className="group bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 hover:bg-white hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
        >
          {/* Season Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-lg group-hover:bg-blue-600 transition-colors">
                <ListMusic className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {season.title}
                </h3>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                  Season {season.number} • {season.episodes.length} Episodes
                </p>
              </div>
            </div>
            <Share2 className="w-5 h-5 text-slate-300 hover:text-slate-900 cursor-pointer transition-colors" />
          </div>

          <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">
            {season.description}
          </p>

          {/* Episode Mini-List */}
          <div className="space-y-3">
            {season.episodes.slice(0, 5).map((ep, eIdx) => (
              <div
                key={eIdx}
                className="bg-white p-5 rounded-2.5xl border border-slate-100 group-hover:border-slate-200 hover:border-blue-500/30 transition-all flex items-center justify-between group/item cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 group-hover/item:text-blue-600 transition-colors line-clamp-1">
                      {ep.title}
                    </h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      {ep.date || "Now Playing"} • {ep.duration || "30m"}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-200 group-hover/item:text-slate-900 transition-colors" />
              </div>
            ))}
            {season.episodes.length > 5 && (
              <div className="text-center text-slate-400 text-xs py-2 italic">
                + {season.episodes.length - 5} more episodes
              </div>
            )}
          </div>

          <button className="mt-10 w-full py-5 rounded-2.5xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]">
            Browse Season {season.number}
          </button>
        </div>
      ))}
    </div>
  );
};

// --- Main Module Component ---

interface PodcastModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export function PodcastModule({ module, previewDevice }: PodcastModuleProps) {
  const { layout, content } = module;
  const episodes = content.episodes || [];
  const isMobile = previewDevice === "mobile";

  // Render appropriate layout
  const renderLayout = () => {
    switch (layout) {
      case "episode-list":
        return <EpisodeList episodes={episodes} isMobile={isMobile} />;
      case "featured-episode":
        return <FeaturedEpisode episodes={episodes} isMobile={isMobile} />;
      case "player-cards":
        return <PlayerCards episodes={episodes} isMobile={isMobile} />;
      case "season-grid":
        return <SeasonGrid episodes={episodes} isMobile={isMobile} />;
      default:
        // Default layout
        return <PlayerCards episodes={episodes} isMobile={isMobile} />;
    }
  };

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-white border-y"
    >
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

      {episodes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <p className="text-muted-foreground">
            No episodes added yet. Add episodes in the settings panel.
          </p>
        </div>
      ) : (
        renderLayout()
      )}
    </ModuleContainer>
  );
}
