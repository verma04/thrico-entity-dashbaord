"use client";

import React, { createContext, useContext } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  ADMIN_GET_UTM_CAMPAIGN_BY_ID,
} from "@/graphql/actions/utm/admin-utm.graphql";
import { UtmCampaignItem } from "@/types/utm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Link2,
  ChevronLeft,
  BarChart3,
  Edit3,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Campaign Context ───────────────────────────────────────────────────────
interface CampaignDetailContextValue {
  campaign: UtmCampaignItem;
}

const CampaignDetailContext = createContext<CampaignDetailContextValue | null>(null);

export function useCampaignDetail(): CampaignDetailContextValue {
  const ctx = useContext(CampaignDetailContext);
  if (!ctx) throw new Error("useCampaignDetail must be used inside CampaignDetailLayout");
  return ctx;
}

// ── Skeleton ──────────────────────────────────────────────────────────────
function CampaignDetailSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="h-16 bg-muted/50 border-b border-border/60 px-6 flex items-center gap-4">
        <div className="h-6 w-24 bg-muted rounded" />
        <div className="h-5 w-48 bg-muted rounded" />
        <div className="ml-auto h-8 w-28 bg-muted rounded-lg" />
      </div>
      <div className="p-8 space-y-4">
        <div className="h-6 w-64 bg-muted rounded" />
        <div className="h-4 w-96 bg-muted rounded" />
        <div className="grid grid-cols-5 gap-3 mt-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Nav Tab ───────────────────────────────────────────────────────────────
function CampaignNavTab({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === href || (href.endsWith("/") && pathname.startsWith(href));

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer",
        isActive
          ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

// ── Layout ─────────────────────────────────────────────────────────────────
export default function CampaignDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, loading, error } = useQuery(ADMIN_GET_UTM_CAMPAIGN_BY_ID, {
    variables: { id },
    skip: !id,
    fetchPolicy: "cache-and-network",
  });

  const campaign: UtmCampaignItem | null = data?.getUtmCampaignById || null;

  if (loading && !campaign) return <CampaignDetailSkeleton />;

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center p-8">
        <div className="h-12 w-12 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center border border-rose-200 dark:border-rose-800">
          <Link2 className="h-6 w-6 text-rose-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">Campaign Not Found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            The UTM campaign with ID <code className="font-mono text-xs">{id}</code> could not be found.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push("/marketing/utm")}
          className="cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 mr-1.5" />
          Back to All Campaigns
        </Button>
      </div>
    );
  }

  const statusColor =
    campaign.status === "ACTIVE"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      : campaign.status === "PAUSED"
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";

  return (
    <CampaignDetailContext.Provider value={{ campaign }}>
      <div className="flex flex-col h-full bg-background">
        {/* ── Campaign Shell Header ─────────────────────────────────────── */}
        <div className="border-b border-border/60 bg-white dark:bg-zinc-950 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/marketing/utm")}
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
              <Link2 className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-foreground truncate">
                  {campaign.name}
                </span>
                <Badge
                  className={cn(
                    "text-[10px] font-semibold border px-2 py-0.5 rounded-full",
                    statusColor
                  )}
                >
                  {campaign.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono mt-0.5">
                <span className="text-indigo-600 dark:text-indigo-400">{campaign.utmCampaign}</span>
                <span>·</span>
                <span>{campaign.utmSource}</span>
                <span>/</span>
                <span>{campaign.utmMedium}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(campaign.generatedUrl, "_blank")}
              className="h-8 text-xs gap-1.5 cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Test Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/marketing/utm/${campaign.id}/edit`)}
              className="h-8 text-xs gap-1.5 cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
        </div>

        {/* ── Sub-nav ───────────────────────────────────────────────────── */}
        <div className="border-b border-border/60 bg-muted/20 px-4 sm:px-6 py-2 flex items-center gap-1">
          <CampaignNavTab
            href={`/marketing/utm/${campaign.id}`}
            label="360° Analytics"
            icon={BarChart3}
          />
          <CampaignNavTab
            href={`/marketing/utm/${campaign.id}/edit`}
            label="Edit Campaign"
            icon={Edit3}
          />
        </div>

        {/* ── Page Content ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </div>
      </div>
    </CampaignDetailContext.Provider>
  );
}
