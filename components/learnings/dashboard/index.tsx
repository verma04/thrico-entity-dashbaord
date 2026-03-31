"use client";

import React, { useState } from "react";
import { PlayCircle, Clock, BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <article className="group bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      {/* Thumbnail / Player */}
      <div className="relative aspect-video bg-slate-100 overflow-hidden">
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
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/20 transition-colors" />
            {/* Play button */}
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center"
              aria-label={`Play ${video.title}`}
            >
              <div className="h-14 w-14 rounded-full bg-white/95 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <PlayCircle className="h-8 w-8 text-slate-900 fill-slate-900" />
              </div>
            </button>
            {/* Duration badge */}
            <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {video.duration}
            </div>
            {/* Category badge */}
            <div className="absolute top-3 left-3 bg-white/90 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded-md backdrop-blur-sm uppercase tracking-wider">
              {video.category}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-2">
        <h2 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {video.title}
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
          {video.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] font-semibold text-slate-400">{video.author}</span>
          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            YouTube
            <ExternalLink className="h-2.5 w-2.5" />
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
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-slate-400" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Knowledge Library
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Learnings</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium max-w-xl">
          Curated video resources to help you grow and manage your community more effectively.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "h-8 px-3 rounded-lg text-xs font-bold transition-all border",
              activeCategory === cat
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm font-semibold text-slate-400">No videos in this category yet.</p>
        </div>
      )}
    </div>
  );
}
