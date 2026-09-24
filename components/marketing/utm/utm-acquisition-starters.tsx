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
  Zap,
  Megaphone,
  Gift,
  ArrowRight,
  Rocket,
  Share2,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UtmDestinationType } from "@/types/utm";

export interface AcquisitionStarterRecipe {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  source: string;
  medium: string;
  campaign: string;
  destinationType: UtmDestinationType;
  channel: string;
  recommendedTerm?: string;
  recommendedContent?: string;
}

export const ACQUISITION_STARTERS: AcquisitionStarterRecipe[] = [
  {
    title: "Google Search & PPC Campaign",
    description: "Capture high-intent traffic searching for community platforms and networking tools.",
    icon: Sparkles,
    gradient: "from-blue-500 to-indigo-600",
    source: "google",
    medium: "cpc",
    campaign: "search_high_intent",
    destinationType: "SIGNUP",
    channel: "Google Ads",
    recommendedTerm: "community software",
    recommendedContent: "search_ad_v1",
  },
  {
    title: "Social Growth Drop 🚀",
    description: "Launch coordinated announcements on Twitter / X, LinkedIn, and Instagram.",
    icon: Zap,
    gradient: "from-purple-500 to-pink-600",
    source: "twitter",
    medium: "social",
    campaign: "social_alpha_drop",
    destinationType: "SIGNUP",
    channel: "Twitter & X",
    recommendedTerm: "early_access",
    recommendedContent: "pinned_thread_hero",
  },
  {
    title: "Newsletter & Sponsorship Blast",
    description: "Attribute subscribers from industry digests, featured banners, and newsletter drops.",
    icon: Megaphone,
    gradient: "from-amber-500 to-orange-600",
    source: "newsletter",
    medium: "email",
    campaign: "digest_sponsor",
    destinationType: "SIGNUP",
    channel: "Email Sponsorships",
    recommendedContent: "issue_top_banner",
  },
  {
    title: "Affiliate & Partner Referral",
    description: "Attribute signups driven by co-marketing partners, influencers, and brand ambassadors.",
    icon: Gift,
    gradient: "from-emerald-500 to-teal-600",
    source: "partner",
    medium: "affiliate",
    campaign: "ambassador_q2",
    destinationType: "CUSTOM",
    channel: "Partner Network",
  },
  {
    title: "Product Hunt & Launch Directory",
    description: "Attribute high-velocity day-one traffic from directory launches and community forums.",
    icon: Rocket,
    gradient: "from-orange-500 to-rose-600",
    source: "producthunt",
    medium: "referral",
    campaign: "ph_launch_drop",
    destinationType: "SIGNUP",
    channel: "Launch Directories",
    recommendedContent: "first_comment_cta",
  },
  {
    title: "LinkedIn B2B Leadership",
    description: "Track B2B leaders and enterprise founders acquiring access through corporate posts.",
    icon: Share2,
    gradient: "from-sky-500 to-blue-700",
    source: "linkedin",
    medium: "social",
    campaign: "linkedin_leadership",
    destinationType: "SIGNUP",
    channel: "LinkedIn Posts",
    recommendedContent: "carousel_case_study",
  },
];

// ── Compact In-Page Banner to Trigger the Drawer ───────────────────────────
interface UtmAcquisitionStartersBannerProps {
  onClick: () => void;
  className?: string;
}

export function UtmAcquisitionStartersBanner({
  onClick,
  className,
}: UtmAcquisitionStartersBannerProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/70 bg-gradient-to-r from-indigo-50/60 via-purple-50/30 to-background dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-card hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer shadow-2xs",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[12.5px] font-bold text-foreground">
              Acquisition Starters & UTM Presets
            </span>
            <Badge
              variant="outline"
              className="text-[9px] px-1.5 py-0 font-bold border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300"
            >
              6 Recipes Ready
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-1">
            One-click templates for Google PPC, Twitter / X, Newsletters, Partner Links, and Product Hunt.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
          Browse Presets
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}

// ── The Drawer (Sheet) Component ──────────────────────────────────────────
interface UtmAcquisitionStartersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectStarter: (starter: AcquisitionStarterRecipe) => void;
}

export function UtmAcquisitionStarters({
  open,
  onOpenChange,
  onSelectStarter,
}: UtmAcquisitionStartersProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col justify-between overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          <SheetHeader className="p-0 space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold text-foreground">
                  Acquisition Starters & UTM Presets
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Select a pre-configured recipe to open and customize your tracking link
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Recipes List */}
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Available Presets ({ACQUISITION_STARTERS.length})
            </span>

            <div className="space-y-3">
              {ACQUISITION_STARTERS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => onSelectStarter(item)}
                    className="group relative p-4 rounded-xl border border-border/70 bg-card hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xs transition-all text-left cursor-pointer space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "h-8 w-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shrink-0 shadow-xs",
                            item.gradient
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {item.title}
                          </p>
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {item.channel}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant="secondary"
                        className="text-[9.5px] px-2 py-0.5 font-semibold bg-muted text-foreground rounded-full"
                      >
                        {item.destinationType === "SIGNUP" ? "Signup Funnel" : "Custom Page"}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>

                    {/* Pre-configured Tag Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/40 text-[10px] font-mono text-muted-foreground">
                      <span className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/50">
                        source: <strong className="text-foreground">{item.source}</strong>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/50">
                        medium: <strong className="text-foreground">{item.medium}</strong>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/50">
                        campaign: <strong className="text-foreground">{item.campaign}</strong>
                      </span>
                    </div>

                    {/* Action prompt */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Use This Preset & Open Builder</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <SheetFooter className="p-6 pt-3 border-t border-border/60 bg-muted/10">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full text-xs h-9 cursor-pointer"
          >
            Close Presets Drawer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
