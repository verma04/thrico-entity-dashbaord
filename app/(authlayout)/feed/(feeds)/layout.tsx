"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => router.push(`/feed/${tab.key}`)}
              className={cn(
                "relative group px-5 py-2.5 rounded-2xl text-[12px] font-black uppercase tracking-wider transition-all duration-300",
                activeTab === tab.key
                  ? "bg-white text-zinc-900 shadow-md ring-1 ring-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-white/50"
              )}
            >
              <div className="flex items-center gap-2.5 relative z-10">
                <tab.icon className={cn(
                  "h-4 w-4 transition-all duration-300",
                  activeTab === tab.key 
                    ? "text-zinc-900 scale-110" 
                    : "text-zinc-400 group-hover:text-zinc-900"
                )} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-lg text-[9px] font-bold",
                    activeTab === tab.key
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-200 text-zinc-500"
                  )}>
                    {tab.count}
                  </span>
                )}
              </div>
              {activeTab === tab.key && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-zinc-900" />
              )}
            </button>
          ))}
        </EcosystemActionBar>

        <div className="transition-all duration-500">{children}</div>
      </div>
    </div>
  );
}

export default RootLayout;
