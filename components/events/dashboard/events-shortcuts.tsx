"use client";

import React from "react";
import Link from "next/link";
import { Calendar, List, Tag, Network, Plus, ArrowRight } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { cn } from "@/lib/utils";

interface EventsShortcutsProps {
  moduleName?: string;
  singularName?: string;
}

export function EventsShortcuts({
  moduleName = "Events",
  singularName = "Event",
}: EventsShortcutsProps) {
  const shortcuts = [
    {
      title: `All ${moduleName}`,
      description: "Manage upcoming & past gatherings",
      href: "/events/all",
      icon: List,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Event Categories",
      description: "Organize assemblies by theme",
      href: "/events/categories",
      icon: Tag,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Graph View",
      description: "Network map of attendees & sponsors",
      href: "/events/graph",
      icon: Network,
      color: "text-purple-500",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      title: `Create ${singularName}`,
      description: "Publish a physical or virtual event",
      href: "/events/create",
      icon: Plus,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <section className="space-y-3 flex flex-col h-full">
      <DashboardSectionHeading
        title="Event Operations"
        icon={<Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 flex-1">
        {shortcuts.map((shortcut) => {
          const Icon = shortcut.icon;
          return (
            <Link
              key={shortcut.href}
              href={shortcut.href}
              className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105",
                    shortcut.bg
                  )}
                >
                  <Icon className={cn("h-4 w-4", shortcut.color)} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors block truncate">
                    {shortcut.title}
                  </span>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {shortcut.description}
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
