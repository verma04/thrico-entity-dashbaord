"use client";

import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  ShoppingBag,
  Globe,
  ShieldCheck,
  Sparkles,
  Activity,
  LucideIcon,
  Pin,
  Upload,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type {
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";

import PostModal from "@/components/feed/add-feed";
import { useNumberOfFeeds, useAllFeed } from "@/graphql/actions/feed";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

const TAB_CONFIG: Record<
  string,
  {
    label: string;
    title: string;
    description: string;
    badgeText: string;
    icon: LucideIcon;
  }
> = {
  all: {
    label: "Global Feed",
    title: "Global Feed",
    description:
      "Explore announcements, discussions, and updates across your entire community ecosystem.",
    badgeText: "Real-time Feed",
    icon: Globe,
  },
  pinned: {
    label: "Pinned",
    title: "Pinned Announcements",
    description:
      "High-priority announcements and pinned posts for your community.",
    badgeText: "Pinned Posts",
    icon: Pin,
  },
  admin: {
    label: "Admin",
    title: "Admin Posts",
    description:
      "Official updates and announcements published by community managers.",
    badgeText: "Admin Feed",
    icon: ShieldCheck,
  },
  moments: {
    label: "Moments",
    title: "Video Moments",
    description:
      "Short-form videos, highlights, and reels shared by community members.",
    badgeText: "Video Feed",
    icon: Sparkles,
  },
  jobs: {
    label: "Jobs",
    title: "Job Opportunities",
    description:
      "Career openings, internships, and hiring posts in your ecosystem.",
    badgeText: "Career Feed",
    icon: Briefcase,
  },
  listing: {
    label: "Listing",
    title: "Marketplace Listings",
    description: "Products, services, and offers listed by community members.",
    badgeText: "Marketplace Feed",
    icon: ShoppingBag,
  },
};

function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: feedData } = useNumberOfFeeds();
  const [showExportModal, setShowExportModal] = React.useState(false);
  const { data: allFeedData } = useAllFeed({
    variables: {
      input: {
        offset: 0,
        limit: 100,
      },
    },
  });
  const feeds = allFeedData?.getAllFeed || [];
  const router = useRouter();
  const pathname = usePathname();
  const activeTabKey = pathname.split("/")[2] || "all";
  const activeConfig = TAB_CONFIG[activeTabKey] || TAB_CONFIG.all;

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
    { key: "pinned", label: "Pinned", icon: Pin },
    { key: "admin", label: "Admin", icon: ShieldCheck },
    { key: "moments", label: "Moments", icon: Sparkles },
    { key: "jobs", label: "Jobs", icon: Briefcase },
    { key: "listing", label: "Listing", icon: ShoppingBag },
  ];

  return (
    <EcosystemWrapper className="animate-in fade-in duration-700">
      <EcosystemHeader
        title={activeConfig.title}
        description={activeConfig.description}
        icon={activeConfig.icon || Activity}
        badgeText={activeConfig.badgeText}
        breadcrumbs={[
          { label: "Feed", href: "/feed" },
          { label: activeConfig.label },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
              className="h-9 px-3 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button
              asChild
              size="sm"
              className="h-9 px-3 gap-1.5 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xs text-xs font-semibold rounded-lg"
            >
              <Link href="/feed/create">
                <Plus className="h-3.5 w-3.5" />
                Create Post
              </Link>
            </Button>
          </div>
        }
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
                activeTabKey === tab.key
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {/* Active underline indicator */}
              {activeTabKey === tab.key && (
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
                  activeTabKey === tab.key
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
                    activeTabKey === tab.key
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
      <EcosystemContainer className="mt-3 space-y-3">
        <div className="transition-all duration-500">{children}</div>
      </EcosystemContainer>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="feed posts"
        description="Export community feed updates, announcements, and engagement metrics as CSV."
        totalCount={feedData?.numberOfFeeds || feeds.length}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          if (feeds.length === 0) {
            toast.error("Nothing to export", {
              description: "No feed posts found.",
            });
            return;
          }
          const csv = buildCsv(feeds, [
            {
              header: "Author First Name",
              getValue: (p: any) => p.user?.firstName || "",
            },
            {
              header: "Author Last Name",
              getValue: (p: any) => p.user?.lastName || "",
            },
            {
              header: "Content / Description",
              getValue: (p: any) => p.description || "",
            },
            { header: "Source", getValue: (p: any) => p.source || "" },
            { header: "Privacy", getValue: (p: any) => p.privacy || "" },
            {
              header: "Reactions",
              getValue: (p: any) => p.totalReactions ?? 0,
            },
            { header: "Comments", getValue: (p: any) => p.totalComment ?? 0 },
            { header: "Reshares", getValue: (p: any) => p.totalReShare ?? 0 },
            {
              header: "Created At",
              getValue: (p: any) =>
                p.createdAt
                  ? new Date(parseInt(p.createdAt)).toISOString().slice(0, 10)
                  : "",
            },
          ]);
          downloadCsv(
            csv,
            `community-feed-${new Date().toISOString().slice(0, 10)}`,
            format,
          );
          toast.success("Export ready", {
            description: `${feeds.length} post${feeds.length !== 1 ? "s" : ""} exported.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
}

export default RootLayout;
