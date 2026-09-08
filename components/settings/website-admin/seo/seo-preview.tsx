"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SeoPreviewProps {
  title: string;
  description: string;
  slug: string;
  baseUrl: string;
}

export function SeoPreview({
  title,
  description,
  slug,
  baseUrl,
}: SeoPreviewProps) {
  const displayTitle = title || "Your Page Title - My Website";
  const displayDescription =
    description ||
    "Add a meta description to preview how your snippet appears to searchers on Google and Bing.";
  const safeBaseUrl =
    typeof baseUrl === "string" ? baseUrl : "thrico.community";
  const displayDomain = safeBaseUrl
    .replace("https://", "")
    .replace("http://", "");

  const titleLength = title?.length || 0;
  const descLength = description?.length || 0;

  return (
    <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-2xs space-y-3.5">
      {/* Google Snippet Card */}
      <div className="bg-[#f6f6f7]/80 dark:bg-zinc-800/50 rounded-[8px] p-3.5 space-y-1.5 border border-[#e1e3e5] dark:border-zinc-700/80">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#303030] dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-[9px] font-bold">
            G
          </div>
          <span className="text-[11px] font-medium text-[#616161] dark:text-zinc-400 truncate">
            {displayDomain}
          </span>
        </div>
        <div className="text-[14px] text-blue-600 dark:text-blue-400 font-semibold line-clamp-1 leading-snug hover:underline cursor-pointer">
          {displayTitle}
        </div>
        <div className="text-[11px] font-mono text-[#616161] dark:text-zinc-400 truncate max-w-full">
          https://{displayDomain}/{slug || "page"}
        </div>
        <div className="text-[12px] text-[#303030] dark:text-zinc-300 line-clamp-2 leading-relaxed pt-0.5">
          {displayDescription}
        </div>
      </div>

      {/* Length meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-1 border-t border-[#e1e3e5] dark:border-zinc-800">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11.5px]">
            <span className="font-medium text-[#616161] dark:text-zinc-400">Title Length</span>
            <span
              className={cn(
                "font-bold font-mono text-[11px]",
                titleLength > 60
                  ? "text-[#d72c0d] dark:text-rose-400"
                  : titleLength >= 45
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-[#616161] dark:text-zinc-400",
              )}
            >
              {titleLength}/60
            </span>
          </div>
          <div className="h-1.5 bg-[#e1e3e5] dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300 rounded-full",
                titleLength > 60
                  ? "bg-[#d72c0d]"
                  : titleLength >= 45
                    ? "bg-emerald-500"
                    : "bg-[#303030] dark:bg-zinc-300",
              )}
              style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11.5px]">
            <span className="font-medium text-[#616161] dark:text-zinc-400">Description Length</span>
            <span
              className={cn(
                "font-bold font-mono text-[11px]",
                descLength > 160
                  ? "text-[#d72c0d] dark:text-rose-400"
                  : descLength >= 120
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-[#616161] dark:text-zinc-400",
              )}
            >
              {descLength}/160
            </span>
          </div>
          <div className="h-1.5 bg-[#e1e3e5] dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300 rounded-full",
                descLength > 160
                  ? "bg-[#d72c0d]"
                  : descLength >= 120
                    ? "bg-emerald-500"
                    : "bg-[#303030] dark:bg-zinc-300",
              )}
              style={{ width: `${Math.min((descLength / 160) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
