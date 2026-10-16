"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Sparkles,
  Zap,
  Gift,
  Camera,
  ArrowRight,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface CampaignPreset {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  badge: string;
  aspectRatio: string;
  fitMode: "FIT" | "FILL";
  maxUserDurationSeconds: number;
  allowCameraRecording: boolean;
  autoPublishMoment: boolean;
  shareInFeed: boolean;
}

export const CAMPAIGN_PRESETS: CampaignPreset[] = [
  {
    id: "summer-challenge",
    title: "Summer Vibes Creator Challenge 🌴",
    description: "Engage community members with an upbeat intro clip, custom tropical frame border, and 60-second portrait take.",
    icon: Sparkles,
    gradient: "from-amber-500 to-orange-600",
    badge: "Most Popular",
    aspectRatio: "9:16",
    fitMode: "FIT",
    maxUserDurationSeconds: 60,
    allowCameraRecording: true,
    autoPublishMoment: false,
    shareInFeed: true,
  },
  {
    id: "product-unboxing",
    title: "Product Unboxing & Showcase 🎁",
    description: "High-definition product spotlight with branded frame safe-zones and an outro call-to-action.",
    icon: Gift,
    gradient: "from-blue-500 to-indigo-600",
    badge: "E-Commerce",
    aspectRatio: "9:16",
    fitMode: "FILL",
    maxUserDurationSeconds: 45,
    allowCameraRecording: true,
    autoPublishMoment: true,
    shareInFeed: true,
  },
  {
    id: "vip-conference",
    title: "VIP Conference & Summit Lens 🎟️",
    description: "Official attendee badge frame for summit attendees to record their event takeaway reel.",
    icon: Video,
    gradient: "from-purple-500 to-pink-600",
    badge: "Event Pass",
    aspectRatio: "9:16",
    fitMode: "FIT",
    maxUserDurationSeconds: 30,
    allowCameraRecording: true,
    autoPublishMoment: true,
    shareInFeed: true,
  },
  {
    id: "flash-contest",
    title: "Flash Giveaway & 15s Quick Reel ⚡",
    description: "Fast, viral 15-second mobile camera reaction challenge designed to maximize user submissions.",
    icon: Zap,
    gradient: "from-emerald-500 to-teal-600",
    badge: "High Velocity",
    aspectRatio: "9:16",
    fitMode: "FIT",
    maxUserDurationSeconds: 15,
    allowCameraRecording: true,
    autoPublishMoment: false,
    shareInFeed: true,
  },
];

interface CampaignPresetsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignPresetsDrawer({
  open,
  onOpenChange,
}: CampaignPresetsDrawerProps) {
  const router = useRouter();

  const handleSelectPreset = (preset: CampaignPreset) => {
    onOpenChange(false);
    router.push(
      `/moments/campaigns/create?preset=${preset.id}&title=${encodeURIComponent(
        preset.title
      )}&duration=${preset.maxUserDurationSeconds}`
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col bg-background">
        <SheetHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-sm font-bold text-foreground">
                Campaign Starters & Presets
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                Pre-configured campaign recipes with optimal framing and duration rules
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {CAMPAIGN_PRESETS.map((preset) => {
            const Icon = preset.icon;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="group relative rounded-xl border border-border/70 p-4 bg-card hover:border-indigo-500/60 hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-lg bg-gradient-to-br ${preset.gradient} text-white flex items-center justify-center shadow-xs shrink-0`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-indigo-600 transition-colors">
                        {preset.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[9px] font-mono">
                          {preset.aspectRatio} Portrait
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Max {preset.maxUserDurationSeconds}s
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 text-[9px] font-semibold">
                    {preset.badge}
                  </Badge>
                </div>

                <p className="text-[11px] text-muted-foreground leading-snug">
                  {preset.description}
                </p>

                <div className="pt-1 flex items-center justify-end text-[11px] font-medium text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                  Use this recipe <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-border/60 bg-muted/10 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
