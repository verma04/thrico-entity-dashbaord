"use client";

import React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Play,
  Briefcase,
  ShoppingBag,
  Pin,
  Layers,
  ArrowRight,
} from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { cn } from "@/lib/utils";

const FEED_CHANNELS = [
  {
    title: "All Feed Stream",
    description: "Global broadcast stream",
    href: "/feed/all",
    icon: MessageSquare,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    title: "Moments & Clips",
    description: "Short video bursts",
    href: "/feed/moments",
    icon: Play,
    color: "text-rose-500",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
  {
    title: "Jobs & Opportunities",
    description: "Career boards & hiring",
    href: "/feed/jobs",
    icon: Briefcase,
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    title: "Marketplace",
    description: "Products & services",
    href: "/feed/marketplace",
    icon: ShoppingBag,
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    title: "Pinned Announcements",
    description: "Official entity notices",
    href: "/feed/pinned",
    icon: Pin,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

export function FeedChannels() {
  return (
    <section className="space-y-3">
      <DashboardSectionHeading
        title="Feed Channels"
        icon={<Layers className="h-3.5 w-3.5 text-muted-foreground" />}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
        {FEED_CHANNELS.map((channel) => {
          const Icon = channel.icon;
          return (
            <Link
              key={channel.href}
              href={channel.href}
              className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105",
                    channel.bg
                  )}
                >
                  <Icon className={cn("h-4 w-4", channel.color)} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors block truncate">
                    {channel.title}
                  </span>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {channel.description}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
