/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef } from "react";
import {
  Smartphone,
  Sparkles,
  Radio,
  Check,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Wifi,
  Battery,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { cn } from "@/lib/utils";

interface FeedFramePreviewCanvasProps {
  frameUrl?: string | null;
  aspectRatio?: string;
  placements?: string[];
  ctaButtonText?: string | null;
  ctaBgColor?: string | null;
  ctaTextColor?: string | null;
  className?: string;
}

const SAMPLE_PHOTOS = [
  {
    name: "Campus & Community",
    shortName: "Campus",
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Alumni Gathering",
    shortName: "Alumni",
    url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Celebration",
    shortName: "Party",
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Graduation",
    shortName: "Grad",
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
  },
];

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export function FeedFramePreviewCanvas({
  frameUrl,
  aspectRatio = "1:1",
  placements = ["FEED"],
  ctaButtonText = "Use Frame",
  ctaBgColor = "#4F46E5",
  ctaTextColor = "#FFFFFF",
  className,
}: FeedFramePreviewCanvasProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [previewPlacement, setPreviewPlacement] = useState<"FEED" | "STORIES">(() => {
    if (placements.includes("STORIES") && !placements.includes("FEED")) return "STORIES";
    return "FEED";
  });
  const [mediaMode, setMediaMode] = useState<"PHOTO" | "VIDEO">("PHOTO");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const resolvedFrame = frameUrl ? getPreferredMediaUrl(frameUrl) : null;
  const currentPhoto = SAMPLE_PHOTOS[activePhotoIdx].url;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const feedMediaAspectClass = (() => {
    if (aspectRatio === "4:5") return "aspect-[4/5]";
    if (aspectRatio === "9:16") return "aspect-[9/16]";
    return "aspect-square";
  })();

  const isFeedEnabled = placements.includes("FEED") || placements.includes("BOTH");
  const isStoriesEnabled = placements.includes("STORIES") || placements.includes("BOTH");

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Smartphone Chassis Frame */}
      <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] rounded-[36px] p-2 bg-gradient-to-b from-zinc-800 to-zinc-950 shadow-2xl border-2 border-zinc-700/60 overflow-hidden flex flex-col justify-between">
        {/* Speaker Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 h-3.5 w-24 bg-zinc-900 rounded-full z-30 flex items-center justify-center pointer-events-none">
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-700 mr-2" />
          <div className="h-1 w-10 rounded-full bg-zinc-800" />
        </div>

        {/* Inner Phone Screen */}
        <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-zinc-950 flex flex-col justify-between select-none group">
          {/* Surface View 1: STORIES (9:16 Fullscreen Vertical) */}
          {previewPlacement === "STORIES" ? (
            <div className="relative w-full h-full flex flex-col justify-between">
              {/* Media Layer (Photo or Video) */}
              <div className="absolute inset-0 z-0 bg-black overflow-hidden flex items-center justify-center">
                {mediaMode === "VIDEO" ? (
                  <video
                    ref={videoRef}
                    src={SAMPLE_VIDEO}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={currentPhoto}
                    alt="Sample Story"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Overlaid Transparent PNG Frame */}
                {resolvedFrame ? (
                  <img
                    src={resolvedFrame}
                    alt="Campaign Frame Overlay"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10 animate-fadeIn"
                  />
                ) : (
                  <div className="absolute inset-4 rounded-xl border border-dashed border-white/25 pointer-events-none z-10 flex flex-col items-center justify-center p-4 text-center bg-black/20 backdrop-blur-2xs">
                    <Sparkles className="h-6 w-6 text-white/50 animate-pulse mb-1" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/60">
                      No Frame Uploaded
                    </span>
                    <span className="text-[9px] text-white/40 mt-0.5">
                      Upload transparent PNG
                    </span>
                  </div>
                )}
              </div>

              {/* Story Top Header Bar */}
              <div className="relative z-20 pt-6 px-3 space-y-1.5 bg-gradient-to-b from-black/70 via-black/30 to-transparent">
                {/* Story Segment Bars */}
                <div className="grid grid-cols-3 gap-1">
                  <div className="h-0.5 rounded-full bg-white/90" />
                  <div className="h-0.5 rounded-full bg-white/40" />
                  <div className="h-0.5 rounded-full bg-white/20" />
                </div>

                {/* User Info Bar */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full ring-1 ring-purple-400 p-0.5 bg-zinc-800">
                      <div className="h-full w-full rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[9px] font-bold text-white">
                        SJ
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white leading-tight">sarah.jenkins</p>
                      <p className="text-[8px] text-zinc-300">Just now</p>
                    </div>
                  </div>

                  <Badge className="text-[8px] font-bold bg-purple-600/90 text-white border-0 shadow-xs px-1.5 py-0">
                    <Sparkles className="h-2.5 w-2.5 mr-1" /> Story Lens
                  </Badge>
                </div>
              </div>

              {/* Hover Overlay Controls (for video mode) */}
              {mediaMode === "VIDEO" && (
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col justify-center items-center pointer-events-none">
                  <div className="flex items-center gap-3 pointer-events-auto">
                    <button
                      type="button"
                      onClick={restartVideo}
                      title="Restart Video"
                      className="h-8 w-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="h-10 w-10 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center hover:scale-105 transition-all border border-white/20 shadow-lg cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4 fill-white" />
                      ) : (
                        <Play className="h-4 w-4 fill-white ml-0.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      title={isMuted ? "Unmute" : "Mute"}
                      className="h-8 w-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
                    >
                      {isMuted ? (
                        <VolumeX className="h-3.5 w-3.5" />
                      ) : (
                        <Volume2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Story Bottom Interactive Action Bar */}
              <div className="relative z-20 p-3 pb-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent space-y-2">
                <button
                  type="button"
                  style={{
                    backgroundColor: ctaBgColor || "#4F46E5",
                    color: ctaTextColor || "#FFFFFF",
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95 pointer-events-none"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{ctaButtonText?.trim() || "Use Frame"}</span>
                </button>

                <div className="flex items-center justify-between text-[9px] text-white/70 px-1">
                  <span className="font-mono">9:16 Story Viewport</span>
                  {resolvedFrame && (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="h-2.5 w-2.5" /> Frame Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Surface View 2: FEED POST VIEW (1:1 / 4:5 / 9:16 in Social Feed) */
            <div className="relative w-full h-full flex flex-col justify-between bg-zinc-950 text-white">
              {/* Top iOS Status Bar */}
              <div className="pt-6 px-4 pb-1 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                <span className="font-semibold text-zinc-200">9:41</span>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Wifi className="h-3 w-3" />
                  <Battery className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Feed App Header */}
              <div className="px-3 py-1 flex items-center justify-between border-b border-zinc-800/80">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block" />
                    Thrico Feed
                  </span>
                </div>
                <Badge variant="outline" className="text-[8px] border-zinc-700 text-zinc-400 px-1.5 py-0">
                  {aspectRatio} Post
                </Badge>
              </div>

              {/* Scrollable Feed Card Area */}
              <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-2">
                {/* Post Creator / Author Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-[9px] font-bold text-white shadow-xs">
                      TP
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-white leading-tight">Sarah Jenkins</p>
                      <p className="text-[8px] text-zinc-400">Class of 2026 • 2h ago</p>
                    </div>
                  </div>
                  <Badge className="text-[8px] bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-1 py-0">
                    Community
                  </Badge>
                </div>

                {/* Framed Media Container */}
                <div
                  className={cn(
                    "relative w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-md flex items-center justify-center",
                    feedMediaAspectClass
                  )}
                >
                  {/* Layer 1: Background Media */}
                  {mediaMode === "VIDEO" ? (
                    <video
                      ref={videoRef}
                      src={SAMPLE_VIDEO}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={currentPhoto}
                      alt="Sample Post"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Layer 2: Transparent PNG Frame Overlay */}
                  {resolvedFrame ? (
                    <img
                      src={resolvedFrame}
                      alt="Campaign Frame Overlay"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10 animate-fadeIn"
                    />
                  ) : (
                    <div className="absolute inset-3 rounded-lg border border-dashed border-white/20 pointer-events-none z-10 flex flex-col items-center justify-center p-2 text-center bg-black/20">
                      <Sparkles className="h-5 w-5 text-white/50 animate-pulse mb-1" />
                      <span className="text-[9px] uppercase font-bold tracking-wider text-white/60">
                        Frame Overlay
                      </span>
                    </div>
                  )}

                  {/* Frame Active Badge */}
                  <div className="absolute top-2 left-2 z-20">
                    <Badge className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[8px] font-medium px-1.5 py-0">
                      Framed Take
                    </Badge>
                  </div>
                </div>

                {/* Post Action Icons Bar */}
                <div className="flex items-center justify-between px-1 text-zinc-400">
                  <div className="flex items-center gap-3">
                    <Heart className="h-3.5 w-3.5 hover:text-red-400 cursor-pointer" />
                    <MessageCircle className="h-3.5 w-3.5 hover:text-white cursor-pointer" />
                    <Share2 className="h-3.5 w-3.5 hover:text-white cursor-pointer" />
                  </div>
                  <Bookmark className="h-3.5 w-3.5 hover:text-white cursor-pointer" />
                </div>

                {/* Interactive Branded CTA Button */}
                <button
                  type="button"
                  style={{
                    backgroundColor: ctaBgColor || "#4F46E5",
                    color: ctaTextColor || "#FFFFFF",
                  }}
                  className="w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold shadow-xs flex items-center justify-center gap-1.5 pointer-events-none transition-transform active:scale-95"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{ctaButtonText?.trim() || "Use Frame"}</span>
                </button>

                {/* Caption Snippet */}
                <div className="text-[9px] text-zinc-300 leading-tight px-1">
                  <span className="font-bold text-white mr-1">Sarah Jenkins</span>
                  Celebrating alumni homecoming with the official campaign frame! 🎉
                </div>
              </div>

              {/* Bottom Mini Home Info */}
              <div className="p-2 pt-1 border-t border-zinc-800/80 flex items-center justify-between text-[8px] text-zinc-400 px-3">
                <span className="font-mono">Feed Post Preview</span>
                {resolvedFrame && (
                  <span className="text-emerald-400 font-medium">PNG Overlay Active</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Home Bar Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-24 bg-zinc-600/60 rounded-full z-30 pointer-events-none" />
      </div>

      {/* Interactive Surface Switcher & Timeline Bar Underneath */}
      <div className="mt-4 w-full max-w-[320px] rounded-xl border border-border/70 p-3 bg-card shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between text-muted-foreground font-semibold text-[10px]">
          <span>INTERACTIVE SURFACE SIMULATION</span>
          <span className="text-[9px] uppercase font-mono text-indigo-500">Live Simulation</span>
        </div>

        {/* Surface Buttons Bar */}
        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => setPreviewPlacement("FEED")}
            disabled={!isFeedEnabled}
            className={cn(
              "h-8 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer",
              previewPlacement === "FEED"
                ? "bg-indigo-500/15 border-indigo-600 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/30 shadow-xs"
                : isFeedEnabled
                ? "bg-muted/40 border-border/60 text-foreground hover:bg-muted/70"
                : "opacity-40 border-dashed border-border/40 text-muted-foreground cursor-not-allowed"
            )}
          >
            <Radio className="h-3 w-3" />
            1. Feed Post ({aspectRatio})
          </button>

          <button
            type="button"
            onClick={() => setPreviewPlacement("STORIES")}
            disabled={!isStoriesEnabled}
            className={cn(
              "h-8 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer",
              previewPlacement === "STORIES"
                ? "bg-purple-500/15 border-purple-500 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/30 shadow-xs"
                : isStoriesEnabled
                ? "bg-muted/40 border-border/60 text-foreground hover:bg-muted/70"
                : "opacity-40 border-dashed border-border/40 text-muted-foreground cursor-not-allowed"
            )}
          >
            <Smartphone className="h-3 w-3" />
            2. Story Lens (9:16)
          </button>
        </div>

        {/* Media Simulator Mode (Photos vs Video) */}
        <div className="pt-1 border-t border-border/40 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
            <span>MEDIA SIMULATION</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMediaMode("PHOTO")}
                className={cn(
                  "px-2 py-0.5 rounded text-[9px] font-medium transition-colors border cursor-pointer",
                  mediaMode === "PHOTO"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-muted/40 border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                Photos
              </button>
              <button
                type="button"
                onClick={() => setMediaMode("VIDEO")}
                className={cn(
                  "px-2 py-0.5 rounded text-[9px] font-medium transition-colors border cursor-pointer",
                  mediaMode === "VIDEO"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-muted/40 border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                Video
              </button>
            </div>
          </div>

          {/* Sample Photo Selector Buttons */}
          {mediaMode === "PHOTO" && (
            <div className="grid grid-cols-4 gap-1 pt-0.5">
              {SAMPLE_PHOTOS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActivePhotoIdx(i)}
                  className={cn(
                    "py-1 px-1 rounded-md text-[10px] font-medium transition-all text-center border truncate cursor-pointer",
                    activePhotoIdx === i
                      ? "bg-indigo-500/15 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "bg-muted/30 border-border/50 text-muted-foreground hover:text-foreground"
                  )}
                  title={p.name}
                >
                  {p.shortName}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground text-center pt-0.5 leading-snug">
          {previewPlacement === "FEED"
            ? `Viewing ${aspectRatio} layout as community members will see it on the mobile Feed grid.`
            : "Viewing full-bleed portrait Story camera viewfinder with transparent frame overlay."}
        </p>
      </div>
    </div>
  );
}
