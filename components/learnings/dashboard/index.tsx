"use client";

import React, { useState } from "react";
import { PlayCircle, Clock, BookOpen, ExternalLink, ArrowRight, Play, ShieldCheck, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Static Content
// ---------------------------------------------------------------------------
const VIDEOS = [
  {
    id: "dQw4w9WgXcQ",
    title: "How to Build a Thriving Online Community",
    description:
      "Learn the foundational principles of community building — from defining your mission to fostering genuine connection among members.",
    duration: "14:22",
    category: "Community",
    author: "Thrico Team",
  },
  {
    id: "9bZkp7q19f0",
    title: "Member Onboarding Strategies That Actually Work",
    description:
      "Discover proven onboarding flows that turn new signups into long-term, engaged community members from day one.",
    duration: "18:05",
    category: "Engagement",
    author: "Thrico Team",
  },
  {
    id: "M7lc1UVf-VE",
    title: "Content Strategy for Community-Led Growth",
    description:
      "A step-by-step breakdown of how to create content pillars, editorial calendars, and distribution strategies built around your community.",
    duration: "22:47",
    category: "Content",
    author: "Thrico Team",
  },
  {
    id: "tgbNymZ7vqY",
    title: "Moderation Best Practices for Healthy Communities",
    description:
      "How to set community guidelines, handle conflict, and build a moderation system that scales without burning out your team.",
    duration: "11:14",
    category: "Moderation",
    author: "Thrico Team",
  },
  {
    id: "ysz5S6PUM-U",
    title: "Using Gamification to Drive Participation",
    description:
      "Points, badges, leaderboards — learn which mechanics genuinely boost engagement and which ones backfire.",
    duration: "16:33",
    category: "Gamification",
    author: "Thrico Team",
  },
  {
    id: "6_b7RDuLwcI",
    title: "Analytics for Community Managers",
    description:
      "The metrics that actually matter: retention, activation depth, and contribution loops. Stop tracking vanity metrics.",
    duration: "19:58",
    category: "Analytics",
    author: "Thrico Team",
  },
];

const CATEGORIES = ["All", "Community", "Engagement", "Content", "Moderation", "Gamification", "Analytics"];

// ---------------------------------------------------------------------------
// Video Card
// ---------------------------------------------------------------------------
function VideoCard({ video }: { video: (typeof VIDEOS)[0] }) {
  const [playing, setPlaying] = useState(false);

  return (
    <article className="group bg-white rounded-lg border border-zinc-200 overflow-hidden hover:border-indigo-200 transition-all duration-300">
      {/* Thumbnail / Player */}
      <div className="relative aspect-video bg-zinc-50 overflow-hidden border-b border-zinc-100">
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-zinc-950/20 group-hover:bg-zinc-950/10 transition-colors" />
            
            {/* Play button */}
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center"
              aria-label={`Play ${video.title}`}
            >
              <div className="h-12 w-12 rounded-full bg-white/95 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="h-5 w-5 text-zinc-900 fill-zinc-900 ml-1" />
              </div>
            </button>
            
            {/* Duration badge */}
            <div className="absolute bottom-2.5 right-2.5 bg-zinc-900/90 text-[10px] font-bold text-white px-2 py-0.5 rounded uppercase tracking-widest backdrop-blur-sm flex items-center gap-1.5">
              <Clock size={10} />
              {video.duration}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
           <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase tracking-widest">
              {video.category}
           </span>
           <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic">
              {video.author}
           </span>
        </div>
        <h2 className="text-sm font-bold text-zinc-900 leading-tight line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
          {video.title}
        </h2>
        <p className="text-[11px] font-medium text-zinc-500 leading-relaxed line-clamp-2 uppercase tracking-tighter">
          {video.description}
        </p>
        <div className="pt-3 border-t border-zinc-50 flex items-center justify-between">
          <Button variant="ghost" className="h-7 px-0 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 gap-2" onClick={() => setPlaying(true)}>
             Initialize Stream <ArrowRight size={12} />
          </Button>
          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-zinc-300 hover:text-zinc-600 transition-colors"
          >
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function LearningsDashboard() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? VIDEOS
      : VIDEOS.filter((v) => v.category === activeCategory);

  return (
    <EcosystemWrapper anonymized-1="learnings-hub">
      <EcosystemHeader
        title="Knowledge Registry"
        description="Curated technical and community analytics resources focused on exponential scale."
        badgeText="Learnings"
        icon={BookOpen}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full overflow-hidden">
          <div className="flex items-center gap-2 px-1 shrink-0">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">
              Verified Knowledge Node
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
             <div className="h-4 w-px bg-zinc-200 mx-2 shrink-0" />
             {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 border border-zinc-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-32 text-center space-y-4">
             <div className="h-12 w-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto opacity-50">
                <Timer size={24} className="text-zinc-300" />
             </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">No registry entries available in this segment.</p>
          </div>
        )}
      </EcosystemContainer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </EcosystemWrapper>
  );
}
