"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { getPreferredMediaUrl } from "@/utils/media";

interface GamificationIconPreviewProps {
  icon: string;
  name?: string;
  subtitle?: string;
  badgeLabel?: string;
  color?: string;
  className?: string;
}

/**
 * Shared icon preview card used in both Rank and Badge dialogs.
 * Shows the icon with a glowing background, name, subtitle, and an optional badge label.
 */
export function GamificationIconPreview({
  icon,
  name,
  subtitle,
  badgeLabel,
  color,
  className,
}: GamificationIconPreviewProps) {
  const isImage = icon?.includes("/") || icon?.startsWith("http");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-linear-to-br from-primary/5 via-background to-primary/10 p-6 shadow-sm ring-1 ring-inset ring-primary/10",
        className,
      )}
    >
      <div className="flex items-center gap-6">
        <div className="relative">
          <div
            className="absolute -inset-4 rounded-full blur-2xl animate-pulse"
            style={{
              backgroundColor: color
                ? `${color}33`
                : "hsl(var(--primary) / 0.2)",
            }}
          />
          <div
            className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-background shadow-xl ring-1 ring-border text-4xl transform hover:scale-110 transition-transform duration-300 overflow-hidden"
            style={
              color
                ? { boxShadow: `0 4px 24px ${color}22` }
                : undefined
            }
          >
            {isImage ? (
              <img
                src={getPreferredMediaUrl(icon) || ""}
                alt="Icon"
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{icon || "⭐"}</span>
            )}
          </div>
        </div>
        <div className="space-y-1 min-w-0">
          <h3 className="text-xl font-bold tracking-tight text-foreground truncate">
            {name || "Untitled"}
          </h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-2 max-w-[200px]">
              {subtitle}
            </p>
          )}
          {badgeLabel && (
            <div className="pt-1">
              <span
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 bg-background/50 backdrop-blur-sm text-[10px] uppercase tracking-wider font-bold text-muted-foreground"
                style={
                  color
                    ? { borderColor: `${color}44`, color }
                    : undefined
                }
              >
                {badgeLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
