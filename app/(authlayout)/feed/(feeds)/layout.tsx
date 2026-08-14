"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Briefcase,
  ShoppingBag,
  Globe,
  ShieldCheck,
  Sparkles,
  Activity,
  LucideIcon,
  Pin,
} from "lucide-react";

import PostModal from "@/components/feed/add-feed";
import { useNumberOfFeeds } from "@/graphql/actions/feed";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: feedData } = useNumberOfFeeds();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.split("/")[2] || "all";

  const tabs: {
    key: string;
    label: string;
    count?: number;
    icon: LucideIcon;
  }[] = [
    {
      key: "all",
      label: "Global Feed",
      count: feedData?.numberOfFeeds,
      icon: Globe,
    },
    { key: "pinned", label: "Pinned", count: undefined, icon: Pin },
    { key: "admin", label: "Admin", count: undefined, icon: ShieldCheck },
    { key: "moments", label: "Moments", count: undefined, icon: Sparkles },
    { key: "jobs", label: "Jobs", count: undefined, icon: Briefcase },
    { key: "listing", label: "Listing", count: undefined, icon: ShoppingBag },
  ];

  return (
    <EcosystemWrapper
      anonymized-1="feed"
      className="animate-in fade-in duration-700"
    >
      <EcosystemHeader
        title="Community Feed"
        description="Share updates, stay connected, and explore activities across your community ecosystem."
        icon={Activity}
        badgeText="Real-time Feed"
        breadcrumbs={[
          { label: "Feed", href: "/feed" },
          { label: "Content Feed" },
        ]}
        actions={<PostModal />}
      />

      <EcosystemActionBar
        shadow="none"
        className="p-0 border-b border-border bg-white dark:bg-background"
      >
        <div className="flex items-center gap-0 w-full overflow-x-auto no-scrollbar px-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => router.push(`/feed/${tab.key}`)}
              className={cn(
                "group/tab relative flex items-center gap-1.5 px-4 py-3 text-[12px] font-medium transition-colors duration-150 outline-none whitespace-nowrap",
                activeTab === tab.key
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {/* Active underline indicator */}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="feed-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground dark:bg-white"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.4,
                  }}
                />
              )}

              {/* Icon */}
              <tab.icon
                className={cn(
                  "h-3.5 w-3.5 transition-colors duration-150",
                  activeTab === tab.key
                    ? "text-foreground"
                    : "text-muted-foreground group-hover/tab:text-foreground",
                )}
              />

              {/* Label */}
              <span className="leading-none">{tab.label}</span>

              {/* Count */}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "ml-1 flex h-4 items-center justify-center rounded-full px-1.5 text-[10px] font-medium transition-colors",
                    activeTab === tab.key
                      ? "bg-foreground/10 text-foreground"
                      : "bg-muted text-muted-foreground group-hover/tab:bg-muted/80",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </EcosystemActionBar>
      <EcosystemContainer className="mt-8 space-y-6">
        <div className="transition-all duration-500">{children}</div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default RootLayout;
