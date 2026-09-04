"use client";

import React from "react";
import {
  AdminTable,
  AdminTableItem,
  AdminTableMetric,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import {
  useGetEmailCampaignLinks,
  EmailCampaignLink,
} from "@/graphql/actions/email/campaign-actions";
import { Link2, MousePointerClick, ExternalLink } from "lucide-react";
import { safeFormat } from "@/lib/date-utils";

interface CampaignLinkClicksProps {
  campaignId: string;
}

export function CampaignLinkClicks({ campaignId }: CampaignLinkClicksProps) {
  const { data, loading } = useGetEmailCampaignLinks(campaignId);
  const links: EmailCampaignLink[] = data?.getEmailCampaignLinks || [];

  const columns = [
    {
      key: "url",
      header: "Target Destination URL",
      cell: (link: EmailCampaignLink) => (
        <div className="flex items-center gap-2 max-w-[320px]">
          <div className="h-6 w-6 rounded-[4px] bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/40 shrink-0">
            <Link2 className="h-3 w-3" />
          </div>
          <a
            href={link.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold text-foreground hover:text-indigo-600 truncate transition-colors flex items-center gap-1"
          >
            <span className="truncate">{link.originalUrl}</span>
            <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-60" />
          </a>
        </div>
      ),
    },
    {
      key: "totalClicks",
      header: "Total Clicks",
      cell: (link: EmailCampaignLink) => (
        <AdminTableMetric
          icon={MousePointerClick}
          value={link.totalClicks || 0}
          unit="Clicks"
          variant="indigo"
        />
      ),
    },
    {
      key: "uniqueClicks",
      header: "Unique Clickers",
      cell: (link: EmailCampaignLink) => (
        <AdminTableMetric
          value={link.uniqueClicks || 0}
          unit="Members"
          variant="indigo"
        />
      ),
    },
    {
      key: "ctr",
      header: "Click Conversion",
      cell: (link: EmailCampaignLink) => {
        const ratio =
          link.totalClicks > 0
            ? Math.round((link.uniqueClicks / link.totalClicks) * 100)
            : 0;
        return (
          <span className="text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400">
            {ratio}% unique
          </span>
        );
      },
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={links}
      loading={loading}
      keyExtractor={(l) => l.id || l.originalUrl}
      emptyIcon={Link2}
      emptyTitle="No tracked links found"
      emptyDescription="Links clicked inside this email broadcast will be logged here with unique clicker heatmaps."
      size="sm"
      pageSize={10}
      loadingRows={4}
    />
  );
}
