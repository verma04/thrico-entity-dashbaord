"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Calendar,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BlueprintPreset,
  BLUEPRINT_PRESETS,
} from "./create-leaderboard-dialog";

// ── In-Page Banner to Trigger Blueprints Drawer ─────────────────────────────
interface LeaderboardBlueprintsBannerProps {
  onClick: () => void;
  className?: string;
}

export function LeaderboardBlueprintsBanner({
  onClick,
  className,
}: LeaderboardBlueprintsBannerProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/70 bg-gradient-to-r from-amber-50/60 via-purple-50/30 to-background dark:from-amber-950/20 dark:via-purple-950/10 dark:to-card hover:border-amber-300 dark:hover:border-amber-700/60 transition-all cursor-pointer shadow-2xs",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[12.5px] font-bold text-foreground">
              Leaderboard Blueprints & Quick Starters
            </span>
            <Badge
              variant="outline"
              className="text-[9px] px-1.5 py-0 font-bold border-amber-300 text-amber-800 dark:border-amber-800 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/40"
            >
              6 Blueprints Ready
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-1">
            Production-ready recipes for Weekly Sprints, All-Time Hall of Fame, Daily Blitz, Quarterly OKRs, and Privacy-Safe Embeds.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:underline">
          Browse Blueprints
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}

// ── The Blueprints Drawer (Sheet) Component ────────────────────────────────
interface LeaderboardBlueprintsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectBlueprint: (blueprint: BlueprintPreset) => void;
}

export function LeaderboardBlueprintsDrawer({
  open,
  onOpenChange,
  onSelectBlueprint,
}: LeaderboardBlueprintsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col justify-between overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          <SheetHeader className="p-0 space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/40 shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold text-foreground">
                  Leaderboard Blueprints
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Select a pre-configured architecture to launch a new headless leaderboard in seconds
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* List of Recipe Cards */}
          <div className="grid grid-cols-1 gap-3.5">
            {BLUEPRINT_PRESETS.map((preset) => {
              const IconComponent = preset.icon;

              return (
                <div
                  key={preset.id}
                  className="group relative rounded-xl border border-border/70 bg-card p-4 hover:border-amber-400 dark:hover:border-amber-600/70 hover:shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-foreground group-hover:text-amber-600 transition-colors">
                            {preset.name}
                          </h4>
                          <Badge
                            variant="secondary"
                            className="text-[9px] px-1.5 py-0 font-semibold bg-muted text-muted-foreground"
                          >
                            {preset.badge}
                          </Badge>
                        </div>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          slug: {preset.codeSlug}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => onSelectBlueprint(preset)}
                      className="h-7 text-xs gap-1 font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0 cursor-pointer"
                    >
                      <span>Use Blueprint</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {preset.description}
                  </p>

                  {/* Badges / Specs row */}
                  <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-border/40 text-[10.5px]">
                    <span className="inline-flex items-center gap-1 font-medium text-foreground">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{preset.periodType}</span>
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Layers className="h-3 w-3" />
                      <span>Page: {preset.defaultPageSize} (max {preset.maxPageSize})</span>
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {preset.maskUserName ? "Masked Names (GDPR)" : "Public Names"}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {preset.showRankMovement ? "Movement Tracked" : "Static Rank"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <SheetFooter className="p-4 border-t border-border bg-muted/20 sm:justify-between items-center text-xs text-muted-foreground">
          <span>You can modify any setting after selecting a blueprint.</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8"
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default LeaderboardBlueprintsDrawer;
