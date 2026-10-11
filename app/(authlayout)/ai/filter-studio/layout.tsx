"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Layers,
  History,
  FolderOpen,
  Calendar,
  BarChart2,
  Code2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudioNavTab {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const STUDIO_TABS: StudioNavTab[] = [
  {
    label: "Filter Studio",
    href: "/ai/filter-studio",
    icon: Sparkles,
    exact: true,
  },
  {
    label: "Filters & Effects",
    href: "/ai/filter-studio/filters",
    icon: Layers,
  },
  {
    label: "AI Generations",
    href: "/ai/filter-studio/generations",
    icon: History,
  },
  {
    label: "Assets Library",
    href: "/ai/filter-studio/assets",
    icon: FolderOpen,
  },
  {
    label: "Campaigns",
    href: "/ai/filter-studio/campaigns",
    icon: Calendar,
  },
  {
    label: "Analytics",
    href: "/ai/filter-studio/analytics",
    icon: BarChart2,
  },
  {
    label: "SDK & Integrations",
    href: "/ai/filter-studio/sdk",
    icon: Code2,
  },
];

export default function FilterStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen bg-background select-none">
      {/* Studio Header & Tab Navigation Bar */}
      <div className="border-b border-border/80 bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 pt-3 pb-0 gap-3">
          {/* Breadcrumbs & Title */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
              <Link
                href="/ai"
                className="hover:text-foreground transition-colors"
              >
                AI Hub
              </Link>
              <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
              <span className="text-foreground font-medium">
                AR Filter Studio
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <h1 className="text-base font-bold text-foreground tracking-tight">
                Thrico AR AI Filter Studio
              </h1>
            </div>
          </div>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-2 overflow-x-auto scrollbar-none">
          {STUDIO_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.exact
              ? pathname === tab.href
              : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-all whitespace-nowrap",
                  isActive
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Studio Route Outlet */}
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}
