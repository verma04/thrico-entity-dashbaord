/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Sparkles,
  Maximize2,
  Upload,
  RefreshCw,
  Eye,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Alumni Gathering",
    url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Celebration",
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
  },
];

export function FeedFramePreviewCanvas({
  frameUrl,
  aspectRatio = "1:1",
  placements = ["FEED"],
  ctaButtonText = "Share Post",
  ctaBgColor = "#4F46E5",
  ctaTextColor = "#FFFFFF",
  className,
}: FeedFramePreviewCanvasProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [previewPlacement, setPreviewPlacement] = useState<"FEED" | "STORIES">(() => {
    if (placements.includes("STORIES") && !placements.includes("FEED")) return "STORIES";
    return "FEED";
  });

  const resolvedFrame = frameUrl ? getPreferredMediaUrl(frameUrl) : null;
  const currentPhoto = SAMPLE_PHOTOS[activePhotoIdx].url;

  // Derive aspect ratio class based on placement / selected ratio
  const aspectClass = (() => {
    if (previewPlacement === "STORIES") return "aspect-[9/16]";
    if (aspectRatio === "4:5") return "aspect-[4/5]";
    if (aspectRatio === "9:16") return "aspect-[9/16]";
    return "aspect-square";
  })();

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Top Controls: Placement preview toggle & sample switcher */}
      <div className="w-full flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-muted/60 border border-border/50">
          <button
            type="button"
            onClick={() => setPreviewPlacement("FEED")}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all",
              previewPlacement === "FEED"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Feed View ({aspectRatio || "1:1"})
          </button>
          <button
            type="button"
            onClick={() => setPreviewPlacement("STORIES")}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all",
              previewPlacement === "STORIES"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Story View (9:16)
          </button>
        </div>

        <div className="flex items-center gap-1">
          {SAMPLE_PHOTOS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActivePhotoIdx(i)}
              className={cn(
                "h-5 px-2 rounded text-[10px] font-medium transition-colors border",
                activePhotoIdx === i
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300"
                  : "bg-background border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              Photo {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Phone / Feed Card Frame Container */}
      <div className="relative w-full max-w-[340px] rounded-2xl bg-card border-2 border-border/80 shadow-xl overflow-hidden p-3">
        {/* Mock Post Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-2xs">
              TP
            </div>
            <div>
              <p className="text-[11px] font-semibold text-foreground leading-tight">Sarah Jenkins</p>
              <p className="text-[9px] text-muted-foreground">Class of 2024</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal border-indigo-200 bg-indigo-50/50 text-indigo-700 dark:text-indigo-300">
            {previewPlacement === "STORIES" ? "Story Mode" : "Feed Post"}
          </Badge>
        </div>

        {/* Live Canvas Preview Area */}
        <div className={cn("relative w-full rounded-xl overflow-hidden bg-neutral-900 border border-border/40 shadow-inner", aspectClass)}>
          {/* 1. Underlying User Photo */}
          <img
            src={currentPhoto}
            alt="Sample user post"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* 2. Overlaid Transparent Frame */}
          {resolvedFrame ? (
            <img
              src={resolvedFrame}
              alt="Campaign Frame Overlay"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 bg-black/30 backdrop-blur-[2px]">
              <Sparkles className="h-8 w-8 text-white/70 animate-pulse mb-1.5" />
              <p className="text-xs font-medium text-white shadow-xs">Frame Preview</p>
              <p className="text-[10px] text-white/70 mt-0.5">Upload a transparent PNG to see it framed here</p>
            </div>
          )}

          {/* Placement Badge on Preview */}
          <div className="absolute top-2.5 left-2.5 z-20">
            <Badge className="bg-black/60 backdrop-blur-md border-white/20 text-white text-[9px] font-medium px-1.5 py-0">
              Live Frame Overlay
            </Badge>
          </div>
        </div>

        {/* Mock Post Footer / CTA Preview */}
        <div className="mt-2.5 pt-2 border-t border-border/40 space-y-2">
          {ctaButtonText && (
            <button
              type="button"
              style={{
                backgroundColor: ctaBgColor || "#4F46E5",
                color: ctaTextColor || "#FFFFFF",
              }}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{ctaButtonText}</span>
            </button>
          )}

          <div className="flex items-center justify-between text-[10px] text-muted-foreground px-0.5">
            <span>❤️ 142 likes</span>
            <span>💬 18 comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
