"use client";

import React from "react";
import {
  Video,
  MapPin,
  Sparkles,
  Users2,
  ArrowRight,
  ChevronDown,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventStartersProps {
  onSelectStarter?: (starter: {
    type: "ONLINE" | "OFFLINE" | "HYBRID";
    titlePrefix: string;
    description: string;
  }) => void;
  onRequestCreate?: () => void;
}

export const EVENT_STARTERS = [
  {
    id: "webinar",
    title: "Virtual Webinar & Workshop",
    description:
      "Interactive livestream sessions with screen sharing, participant chat, and Q&A.",
    type: "ONLINE" as const,
    typeLabel: "Online Stream",
    icon: Video,
    gradient: "from-cyan-500 to-blue-600",
    badgeColor: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
    titlePrefix: "Webinar: ",
  },
  {
    id: "meetup",
    title: "In-Person Meetup & Social",
    description:
      "Local community gatherings with physical venue mapping, RSVP limits, and check-in tickets.",
    type: "OFFLINE" as const,
    typeLabel: "In-Person",
    icon: MapPin,
    gradient: "from-violet-500 to-indigo-600",
    badgeColor: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
    titlePrefix: "Meetup: ",
  },
  {
    id: "keynote",
    title: "Product Launch & Keynote",
    description:
      "High-impact broadcasts combining stage presentations, recorded teasers, and hybrid access.",
    type: "HYBRID" as const,
    typeLabel: "Hybrid Format",
    icon: Sparkles,
    gradient: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    titlePrefix: "Keynote: ",
  },
  {
    id: "townhall",
    title: "Community Town Hall & AMA",
    description:
      "Open mic discussions, core updates, and leadership Q&A to align community stakeholders.",
    type: "ONLINE" as const,
    typeLabel: "Open Access",
    icon: Users2,
    gradient: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    titlePrefix: "Town Hall: ",
  },
];

export function EventStarters({
  onSelectStarter,
  onRequestCreate,
}: EventStartersProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Fast Assembly Launchpads
          </span>
          <Badge
            variant="secondary"
            className="text-[9px] px-1.5 py-0 font-bold bg-muted text-muted-foreground rounded"
          >
            4 Presets
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2 rounded-lg"
        >
          {collapsed ? "Show Launchpads" : "Hide"}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              !collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {!collapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
          {EVENT_STARTERS.map((starter) => {
            const Icon = starter.icon;
            return (
              <Card
                key={starter.id}
                onClick={() => {
                  if (onSelectStarter) {
                    onSelectStarter({
                      type: starter.type,
                      titlePrefix: starter.titlePrefix,
                      description: starter.description,
                    });
                  } else if (onRequestCreate) {
                    onRequestCreate();
                  }
                }}
                className="group relative overflow-hidden border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer rounded-xl flex flex-col justify-between"
              >
                {/* Subtle top gradient bar */}
                <div
                  className={cn(
                    "h-1 w-full bg-gradient-to-r opacity-80 group-hover:opacity-100 transition-opacity",
                    starter.gradient
                  )}
                />

                <CardContent className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform",
                          starter.gradient
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-tight border",
                          starter.badgeColor
                        )}
                      >
                        {starter.typeLabel}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                        {starter.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {starter.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-semibold text-primary">
                    <span>Deploy Preset</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
