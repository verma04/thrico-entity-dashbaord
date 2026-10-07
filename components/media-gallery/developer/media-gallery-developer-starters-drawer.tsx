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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ShieldCheck,
  Image as ImageIcon,
  Film,
  Zap,
  ArrowRight,
  HardDrive,
  Users,
} from "lucide-react";
import { DEVELOPER_RECIPE_PRESETS, MediaGalleryRecipePreset } from "./types";

interface MediaGalleryDeveloperStartersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPreset: (preset: MediaGalleryRecipePreset) => void;
}

export function MediaGalleryDeveloperStartersDrawer({
  open,
  onOpenChange,
  onSelectPreset,
}: MediaGalleryDeveloperStartersDrawerProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
      case "Sparkles":
        return <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      case "Image":
        return <ImageIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />;
      case "Film":
        return <Film className="h-5 w-5 text-rose-600 dark:text-rose-400" />;
      default:
        return <Zap className="h-5 w-5 text-indigo-600" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-xl w-full flex flex-col p-0 bg-background"
      >
        {/* Sticky Header */}
        <SheetHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold text-foreground">
                Developer Policy Recipes & Presets
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                Apply pre-configured enterprise policies tailored for UGC contests, short videos, or high-security portals.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {DEVELOPER_RECIPE_PRESETS.map((recipe) => (
            <div
              key={recipe.id}
              className="p-4 rounded-xl border border-border/70 bg-card hover:border-indigo-400/80 dark:hover:border-indigo-700/80 transition-all shadow-2xs group flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted/50 border border-border/50 shrink-0 mt-0.5">
                    {getIcon(recipe.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-foreground">
                        {recipe.name}
                      </h4>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                      >
                        {recipe.badge}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick specs pill row */}
              <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1 font-mono">
                  <HardDrive className="h-3 w-3 text-zinc-400" />
                  {recipe.values.maxImageSizeMb || 10}MB Image / {recipe.values.maxVideoSizeMb || 100}MB Video
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Users className="h-3 w-3 text-zinc-400" />
                  Max {recipe.values.maxDailyUploadsPerUploader || 10}/user/day
                </span>
                <span>•</span>
                <span className="font-semibold text-foreground">
                  {recipe.values.requireModeration ? "Moderated Queue" : "Direct Publish"}
                </span>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  onClick={() => {
                    onSelectPreset(recipe);
                    onOpenChange(false);
                  }}
                  className="h-7 text-xs gap-1.5 font-medium bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
                >
                  <span>Apply This Recipe</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Footer */}
        <SheetFooter className="p-4 border-t border-border/60 bg-muted/10 flex sm:flex-row gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8 cursor-pointer"
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
