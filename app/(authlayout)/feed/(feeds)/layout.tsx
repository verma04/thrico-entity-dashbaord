"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Users,
  UserCog,
  CalendarDays,
  Briefcase,
  ShoppingBag,
  List,
  Globe,
  ShieldCheck,
  Sparkles,
  Activity,
  LucideIcon,
  Pin
} from "lucide-react";

import PostModal from "@/components/feed/add-feed";
import { useNumberOfFeeds } from "@/graphql/actions/feed";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { cn } from "@/lib/utils";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: feedData } = useNumberOfFeeds();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.split("/")[2] || "all";

  const tabs: { key: string; label: string; count?: number; icon: LucideIcon }[] = [
    { key: "all", label: "Global Feed", count: feedData?.numberOfFeeds, icon: Globe },
    { key: "pinned", label: "Pinned", count: undefined, icon: Pin },
    { key: "admin", label: "Admin", count: undefined, icon: ShieldCheck },
    { key: "moments", label: "Moments", count: undefined, icon: Sparkles },
    { key: "jobs", label: "Jobs", count: undefined, icon: Briefcase },
    { key: "listing", label: "Listing", count: undefined, icon: ShoppingBag },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <EcosystemHeader
        title="Community Feed"
        description="Share updates, stay connected, and explore activities across your community ecosystem."
        icon={Activity}
        badgeText="Real-time Feed"
        actions={<PostModal />}
      />

      <div className="mt-8 space-y-6">
        <EcosystemActionBar shadow="sm">
          <div className="flex items-center gap-1 w-full overflow-x-auto no-scrollbar pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => router.push(`/feed/${tab.key}`)}
                className={cn(
                  "group/tab relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 whitespace-nowrap",
                  activeTab === tab.key
                    ? "text-indigo-700"
                    : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/70"
                )}
              >
                {/* Animated pill background */}
                {activeTab === tab.key && (
                  <motion.span
                    layoutId="feed-tab-pill"
                    className="absolute inset-0 rounded-lg bg-indigo-50 border border-indigo-100/80 shadow-[0_1px_3px_0_oklch(0.55_0.24_264/0.08)]"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.38 }}
                  />
                )}

                {/* Icon */}
                <span
                  className={cn(
                    "relative z-10 shrink-0 transition-all duration-200",
                    activeTab === tab.key
                      ? "text-indigo-600"
                      : "text-zinc-400 group-hover/tab:text-zinc-600"
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                </span>

                {/* Label */}
                <span className="relative z-10 leading-none">{tab.label}</span>

                {/* Count */}
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      "relative z-10 ml-0.5 flex h-4 items-center justify-center rounded-full px-1.5 text-[10px] font-medium",
                      activeTab === tab.key
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-zinc-100 text-zinc-500"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </EcosystemActionBar>

        <div className="transition-all duration-500">{children}</div>
      </div>
    </div>
  );
}

export default RootLayout;
