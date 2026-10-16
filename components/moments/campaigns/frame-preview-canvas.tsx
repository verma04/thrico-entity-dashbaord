/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef } from "react";
import {
  Smartphone,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Film,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { cn } from "@/lib/utils";

interface FramePreviewCanvasProps {
  frameUrl?: string | null;
  videoUrl?: string | null;
  introVideoUrl?: string | null;
  outroVideoUrl?: string | null;
  fitMode?: "FIT" | "FILL" | "CONTAIN";
  introDuration?: number;
  outroDuration?: number;
  className?: string;
}

const DEFAULT_PREVIEW_USER_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export function FramePreviewCanvas({
  frameUrl,
  videoUrl,
  introVideoUrl,
  outroVideoUrl,
  fitMode = "FIT",
  className,
}: FramePreviewCanvasProps) {
  const resolvedIntro = introVideoUrl ? getPreferredMediaUrl(introVideoUrl) : null;
  const resolvedOutro = outroVideoUrl ? getPreferredMediaUrl(outroVideoUrl) : null;
  const resolvedUser = videoUrl ? getPreferredMediaUrl(videoUrl) : DEFAULT_PREVIEW_USER_VIDEO;
  const resolvedFrame = frameUrl ? getPreferredMediaUrl(frameUrl) : null;

  // Available segments in sequence
  const hasIntro = Boolean(resolvedIntro);
  const hasUser = Boolean(resolvedUser);
  const hasOutro = Boolean(resolvedOutro);

  // Active segment state: "intro" | "user" | "outro"
  const [selectedSegment, setSelectedSegment] = useState<"intro" | "user" | "outro">(() => {
    if (hasIntro) return "intro";
    if (hasUser) return "user";
    return "intro";
  });

  // Effective segment dynamically based on available sequence media
  const activeSegment: "intro" | "user" | "outro" = (() => {
    if (selectedSegment === "intro" && !hasIntro && hasUser) return "user";
    if (selectedSegment === "outro" && !hasOutro) return hasUser ? "user" : "intro";
    return selectedSegment;
  })();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Which video source is currently bound to the video element
  const currentVideoSrc = (() => {
    if (activeSegment === "intro" && resolvedIntro) return resolvedIntro;
    if (activeSegment === "outro" && resolvedOutro) return resolvedOutro;
    if (resolvedUser) return resolvedUser;
    return null;
  })();

  // Transition to next segment when video ends
  const handleVideoEnded = () => {
    if (activeSegment === "intro") {
      if (hasUser) {
        setSelectedSegment("user");
      } else if (hasOutro) {
        setSelectedSegment("outro");
      } else {
        // Replay intro if no other clip
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }
    } else if (activeSegment === "user") {
      if (hasOutro) {
        setSelectedSegment("outro");
      } else if (hasIntro) {
        setSelectedSegment("intro");
      } else {
        // Replay user clip
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }
    } else if (activeSegment === "outro") {
      // Outro finished: loop back to intro or user
      if (hasIntro) {
        setSelectedSegment("intro");
      } else if (hasUser) {
        setSelectedSegment("user");
      } else {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

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

  const restartSequence = () => {
    if (hasIntro) {
      setSelectedSegment("intro");
    } else if (hasUser) {
      setSelectedSegment("user");
    }
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Smartphone Viewfinder Frame */}
      <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] rounded-[36px] p-2 bg-gradient-to-b from-zinc-800 to-zinc-950 shadow-2xl border-2 border-zinc-700/60 overflow-hidden flex flex-col justify-between">
        {/* Speaker Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 h-3.5 w-24 bg-zinc-900 rounded-full z-30 flex items-center justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-700 mr-2" />
          <div className="h-1 w-10 rounded-full bg-zinc-800" />
        </div>

        {/* Inner Screen */}
        <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-zinc-950 flex items-center justify-center group">
          {/* Layer 1: Active Video Segment */}
          {currentVideoSrc ? (
            <video
              ref={videoRef}
              key={currentVideoSrc + activeSegment}
              src={currentVideoSrc}
              autoPlay
              muted={isMuted}
              playsInline
              onEnded={handleVideoEnded}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className={cn(
                "w-full h-full",
                activeSegment === "user" && fitMode === "FILL"
                  ? "object-cover"
                  : "object-contain bg-black"
              )}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-indigo-950/20 via-zinc-900 to-zinc-950">
              <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mb-3 animate-pulse">
                <Smartphone className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-zinc-300">
                User Video Viewport
              </p>
              <p className="text-[10px] text-zinc-500 mt-1 max-w-[180px]">
                {hasIntro
                  ? "Intro clip plays first, followed by user video beneath frame"
                  : "Camera feed or uploaded video plays beneath the transparent frame cutout"}
              </p>
            </div>
          )}

          {/* Layer 2: Decorative Transparent PNG Frame (ACTIVE ONLY DURING USER SEGMENT) */}
          {activeSegment === "user" && (
            <>
              {resolvedFrame ? (
                <img
                  src={resolvedFrame}
                  alt="Campaign Frame"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10 select-none animate-fadeIn"
                />
              ) : (
                <div className="absolute inset-4 rounded-xl border border-dashed border-white/20 pointer-events-none z-10 flex items-center justify-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white/30">
                    No Frame Uploaded
                  </span>
                </div>
              )}
            </>
          )}

          {/* Layer 3: Dynamic Segment Indicator Badge (Top Right) */}
          <div className="absolute top-8 right-3 z-20 flex items-center gap-1.5 pointer-events-none">
            {activeSegment === "intro" && (
              <Badge className="text-[9px] font-bold bg-emerald-500/90 text-white shadow-md border-0 animate-pulse">
                <Film className="h-2.5 w-2.5 mr-1" /> Intro Clip
              </Badge>
            )}
            {activeSegment === "user" && (
              <Badge className="text-[9px] font-bold bg-indigo-600/90 text-white shadow-md border-0">
                <Sparkles className="h-2.5 w-2.5 mr-1" /> Framed Take
              </Badge>
            )}
            {activeSegment === "outro" && (
              <Badge className="text-[9px] font-bold bg-purple-600/90 text-white shadow-md border-0 animate-pulse">
                <Film className="h-2.5 w-2.5 mr-1" /> Outro Clip
              </Badge>
            )}
          </div>

          {/* Layer 4: Overlay Controls on Hover */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col justify-between p-3 pointer-events-none">
            <div className="flex justify-between items-center pointer-events-auto pt-6">
              <button
                type="button"
                onClick={restartSequence}
                title="Restart Sequence"
                className="h-7 w-7 rounded-full bg-black/60 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={toggleMute}
                title={isMuted ? "Unmute" : "Mute"}
                className="h-7 w-7 rounded-full bg-black/60 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              >
                {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Play/Pause Center Button */}
            <div className="flex justify-center pointer-events-auto">
              <button
                type="button"
                onClick={togglePlay}
                className="h-10 w-10 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center hover:scale-105 transition-all cursor-pointer border border-white/20 shadow-lg"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white ml-0.5" />}
              </button>
            </div>

            {/* Bottom Progress Bar */}
            <div className="w-full space-y-1">
              <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-100"
                  style={{
                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Watermark Tag (Bottom Bar) */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            <span className="text-[9px] font-mono text-white/60 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10">
              9:16 Portrait
            </span>
            {resolvedFrame && activeSegment === "user" && (
              <span className="text-[9px] font-bold text-emerald-400 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full border border-emerald-500/30">
                Frame Active
              </span>
            )}
          </div>
        </div>

        {/* Home Bar Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-24 bg-zinc-600/60 rounded-full z-30" />
      </div>

      {/* Interactive Sequence Switcher & Timeline */}
      <div className="mt-4 w-full max-w-[320px] rounded-xl border border-border/70 p-3 bg-card shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-muted-foreground font-semibold text-[10px]">
          <span>COMPOSITE PLAYBACK SEQUENCE</span>
          <span className="text-[9px] uppercase font-mono text-indigo-500">Live Simulation</span>
        </div>

        {/* Segment Buttons Bar */}
        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => setSelectedSegment("intro")}
            disabled={!hasIntro}
            className={cn(
              "h-8 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 border cursor-pointer",
              activeSegment === "intro"
                ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30 shadow-xs"
                : hasIntro
                ? "bg-muted/40 border-border/60 text-foreground hover:bg-muted/70"
                : "opacity-40 border-dashed border-border/40 text-muted-foreground cursor-not-allowed"
            )}
          >
            <Film className="h-3 w-3" />
            1. Intro
          </button>

          <button
            type="button"
            onClick={() => setSelectedSegment("user")}
            disabled={!hasUser && !resolvedFrame}
            className={cn(
              "h-8 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 border cursor-pointer",
              activeSegment === "user"
                ? "bg-indigo-500/15 border-indigo-600 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/30 shadow-xs"
                : "bg-muted/40 border-border/60 text-foreground hover:bg-muted/70"
            )}
          >
            <Sparkles className="h-3 w-3" />
            2. Framed Video
          </button>

          <button
            type="button"
            onClick={() => setSelectedSegment("outro")}
            disabled={!hasOutro}
            className={cn(
              "h-8 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 border cursor-pointer",
              activeSegment === "outro"
                ? "bg-purple-500/15 border-purple-500 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/30 shadow-xs"
                : hasOutro
                ? "bg-muted/40 border-border/60 text-foreground hover:bg-muted/70"
                : "opacity-40 border-dashed border-border/40 text-muted-foreground cursor-not-allowed"
            )}
          >
            <Film className="h-3 w-3" />
            3. Outro
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground text-center pt-0.5 leading-snug">
          {activeSegment === "intro" && "Playing intro clip. Automatically transitions to framed video when finished."}
          {activeSegment === "user" && "Playing user video with transparent frame overlaid. Transitions to outro next."}
          {activeSegment === "outro" && "Playing outro clip call-to-action. Loops back to start when finished."}
        </p>
      </div>
    </div>
  );
}
