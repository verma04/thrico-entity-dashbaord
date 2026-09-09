"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Globe, ImageIcon, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OgCardPreviewProps {
  title?: string;
  description?: string;
  ogImage?: string;
  slug?: string;
  websiteUrl?: string;
}

type PlatformTab = "twitter" | "facebook" | "chat";

export function OgCardPreview({
  title,
  description,
  ogImage,
  slug,
  websiteUrl = "https://thrico.community",
}: OgCardPreviewProps) {
  const [activePlatform, setActivePlatform] = useState<PlatformTab>("twitter");
  const [imageError, setImageError] = useState(false);

  const safeDomain = (websiteUrl || "thrico.community")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  const displayTitle =
    title && title.trim().length > 0 ? title : "Your Page Title";
  const displayDescription =
    description && description.trim().length > 0
      ? description
      : "Configure a meta description to control the preview text shown when this page is shared across social media and messaging apps.";
  const displayUrl = `${safeDomain}/${slug || "page"}`;

  const resolvedImageUrl = ogImage
    ? ogImage.startsWith("http://") ||
      ogImage.startsWith("https://") ||
      ogImage.startsWith("blob:") ||
      ogImage.startsWith("data:")
      ? ogImage
      : `https://cdn.thrico.network/${ogImage}`
    : "";

  return (
    <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900/50 p-3.5 space-y-3">
      {/* Header with Title and Platform Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#303030] dark:text-zinc-200">
          <Share2 className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
          <span>Social Media Card Preview</span>
          {resolvedImageUrl && !imageError && (
            <Badge
              variant="outline"
              className="ml-1 text-[9.5px] px-1.5 py-0 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 font-medium"
            >
              1200×630
            </Badge>
          )}
        </div>

        {/* Platform Toggle Tabs */}
        <div className="inline-flex rounded-md bg-white dark:bg-zinc-800 p-0.5 border border-[#d2d5d9] dark:border-zinc-700 shadow-2xs">
          <button
            type="button"
            onClick={() => setActivePlatform("twitter")}
            className={cn(
              "px-2 py-0.5 text-[11px] font-medium rounded-[4px] transition-colors",
              activePlatform === "twitter"
                ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100",
            )}
          >
            X / Twitter
          </button>
          <button
            type="button"
            onClick={() => setActivePlatform("facebook")}
            className={cn(
              "px-2 py-0.5 text-[11px] font-medium rounded-[4px] transition-colors",
              activePlatform === "facebook"
                ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100",
            )}
          >
            Facebook / LinkedIn
          </button>
          <button
            type="button"
            onClick={() => setActivePlatform("chat")}
            className={cn(
              "px-2 py-0.5 text-[11px] font-medium rounded-[4px] transition-colors",
              activePlatform === "chat"
                ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100",
            )}
          >
            Chat / Slack
          </button>
        </div>
      </div>

      {/* Card Preview Container */}
      <div className="max-w-xl mx-auto">
        {activePlatform === "twitter" && (
          <div className="overflow-hidden rounded-2xl border border-[#cfd9de] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all">
            {/* Banner Image Container */}
            <div className="relative aspect-[1.91/1] w-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-b border-[#cfd9de] dark:border-zinc-800">
              {resolvedImageUrl && !imageError ? (
                <img
                  src={resolvedImageUrl}
                  alt={displayTitle}
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
                  <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-700/60 flex items-center justify-center text-zinc-400">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <span className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
                    No Social Share Image (OG Image)
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 max-w-xs">
                    Upload an image or enter a URL below to preview how it looks when shared.
                  </span>
                </div>
              )}
            </div>

            {/* Metadata Bottom Box */}
            <div className="p-3 bg-white dark:bg-zinc-900 space-y-1">
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span className="truncate">{safeDomain}</span>
              </div>
              <div className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 leading-snug">
                {displayTitle}
              </div>
              <div className="text-[12px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                {displayDescription}
              </div>
            </div>
          </div>
        )}

        {activePlatform === "facebook" && (
          <div className="overflow-hidden border border-[#dadde1] dark:border-zinc-800 bg-[#f0f2f5] dark:bg-zinc-900 shadow-sm transition-all rounded-[6px]">
            {/* Banner Image Container */}
            <div className="relative aspect-[1.91/1] w-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-b border-[#dadde1] dark:border-zinc-800">
              {resolvedImageUrl && !imageError ? (
                <img
                  src={resolvedImageUrl}
                  alt={displayTitle}
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
                  <div className="h-9 w-9 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center text-zinc-500">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <span className="text-[12px] font-medium text-zinc-600 dark:text-zinc-400">
                    No Social Preview Image
                  </span>
                </div>
              )}
            </div>

            {/* Facebook Metadata Bottom */}
            <div className="p-3 bg-[#f0f2f5] dark:bg-zinc-900 space-y-1 border-t border-zinc-200 dark:border-zinc-800">
              <div className="text-[10.5px] uppercase font-medium text-zinc-500 dark:text-zinc-400 tracking-wider truncate">
                {safeDomain}
              </div>
              <div className="text-[14px] font-semibold text-[#1c1e21] dark:text-zinc-100 line-clamp-1 leading-snug hover:underline cursor-pointer">
                {displayTitle}
              </div>
              <div className="text-[12px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                {displayDescription}
              </div>
            </div>
          </div>
        )}

        {activePlatform === "chat" && (
          <div className="overflow-hidden rounded-[8px] border-l-4 border-l-blue-500 border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-2xs space-y-2">
            <div className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
              <Globe className="h-3 w-3" />
              <span>{safeDomain}</span>
            </div>
            <div className="text-[13px] font-bold text-blue-600 dark:text-blue-400 line-clamp-1 hover:underline cursor-pointer">
              {displayTitle}
            </div>
            <div className="text-[11.5px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {displayDescription}
            </div>
            {resolvedImageUrl && !imageError && (
              <div className="rounded-[6px] overflow-hidden aspect-[1.91/1] w-full max-h-48 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 mt-2">
                <img
                  src={resolvedImageUrl}
                  alt={displayTitle}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#616161] dark:text-zinc-400 pt-0.5">
        <span>Target URL: <code className="font-mono text-zinc-800 dark:text-zinc-300">https://{displayUrl}</code></span>
        <span>Ratio: <strong className="text-zinc-700 dark:text-zinc-300">1.91 : 1</strong></span>
      </div>
    </div>
  );
}
