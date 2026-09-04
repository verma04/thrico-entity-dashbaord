"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Plus,
  Mail,
  RotateCcw,
  Megaphone,
  LayoutGrid,
  List as ListIcon,
  SlidersHorizontal,
  Upload,
  Sparkles,
  Send,
  Zap,
  Gift,
  ArrowRight,
} from "lucide-react";
import {
  useGetEmailCampaignsList,
  EmailCampaignEntity,
} from "@/graphql/actions/email/campaign-actions";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

import { CampaignKpiSummary } from "./campaign-kpi-summary";
import { CampaignCard } from "./campaign-card";
import { CampaignsTable } from "./campaigns-table";
import { CampaignAnalyticsSheet } from "./campaign-analytics-sheet";

const BROADCAST_STARTERS = [
  {
    title: "Weekly Community Digest",
    description: "Curate top discussions, featured leaderboards, and member milestones.",
    icon: Sparkles,
    gradient: "from-blue-500 to-indigo-600",
    audience: "All Members",
  },
  {
    title: "Exclusive Product Launch 🚀",
    description: "Announce new releases, early access perks, and special promotional discounts.",
    icon: Zap,
    gradient: "from-purple-500 to-pink-600",
    audience: "Active Buyers",
  },
  {
    title: "Event & Webinar Invitation",
    description: "Invite members to upcoming live workshops, AMA sessions, and meetups.",
    icon: Megaphone,
    gradient: "from-amber-500 to-orange-600",
    audience: "RSVP Targets",
  },
  {
    title: "Re-Engagement Win-Back",
    description: "Welcome dormant users back with special points rewards and community highlights.",
    icon: Gift,
    gradient: "from-emerald-500 to-teal-600",
    audience: "Inactive 30d",
  },
];

export function CampaignsHub() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "grid" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const view = (searchParams.get("view") as "grid" | "list") || "grid";
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "ALL");
  const [audienceFilter, setAudienceFilter] = useState(searchParams.get("audience") || "ALL");
  const [debouncedSearch] = useDebounce(search, 400);

  const [selectedCampaignForAnalytics, setSelectedCampaignForAnalytics] =
    useState<EmailCampaignEntity | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const { data, loading, refetch } = useGetEmailCampaignsList();
  const rawCampaigns: EmailCampaignEntity[] = data?.getEmailCampaigns || [];

  const filteredCampaigns = useMemo(() => {
    return rawCampaigns.filter((c) => {
      // 1. Search Query
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase().trim();
        const nameMatch = (c.name || "").toLowerCase().includes(q);
        const subjectMatch = (c.subject || "").toLowerCase().includes(q);
        const senderMatch = (c.senderEmail || "").toLowerCase().includes(q);
        if (!nameMatch && !subjectMatch && !senderMatch) return false;
      }

      // 2. Status Filter
      if (statusFilter !== "ALL") {
        if ((c.status || "").toLowerCase() !== statusFilter.toLowerCase()) return false;
      }

      // 3. Audience Filter
      if (audienceFilter !== "ALL") {
        if ((c.audienceType || "").toLowerCase() !== audienceFilter.toLowerCase()) return false;
      }

      return true;
    });
  }, [rawCampaigns, debouncedSearch, statusFilter, audienceFilter]);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* ── KPI Summary Cards ────────────────────────────────────────────── */}
      <CampaignKpiSummary campaigns={rawCampaigns} loading={loading} />

      {/* ── Action / Filter Bar ─────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search campaigns by name, subject, or sender…"
            />
          </EcosystemActionBar.Item>

          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              updateParams({ status: val === "ALL" ? null : val });
            }}
          >
            <SelectTrigger className="h-[30px] w-[130px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12px] font-medium rounded-[4px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-[6px]">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SENDING">Sending</SelectItem>
              <SelectItem value="PAUSED">Paused</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={audienceFilter}
            onValueChange={(val) => {
              setAudienceFilter(val);
              updateParams({ audience: val === "ALL" ? null : val });
            }}
          >
            <SelectTrigger className="h-[30px] w-[130px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12px] font-medium rounded-[4px]">
              <SelectValue placeholder="Audience" />
            </SelectTrigger>
            <SelectContent className="rounded-[6px]">
              <SelectItem value="ALL">All Audiences</SelectItem>
              <SelectItem value="All Users">All Users</SelectItem>
              <SelectItem value="Segment">Segments</SelectItem>
              <SelectItem value="Manual CSV">Manual CSV</SelectItem>
            </SelectContent>
          </Select>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              refetch();
              toast.success("Campaign metrics refreshed");
            }}
            className="h-[30px] w-[30px] border-[#aeb4b9] dark:border-zinc-700 rounded-[4px] text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
          >
            <Upload className="h-3 w-3" />
            Export
          </Button>

          <Button
            onClick={() => router.push("/email/send")}
            className="h-[30px] gap-1.5 shrink-0 bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-[12px] font-semibold px-2.5 rounded-[4px] cursor-pointer hover:bg-[#202020]"
          >
            <Plus className="h-3 w-3" />
            Create Campaign
          </Button>

          <EcosystemActionBar.ViewToggle
            value={view}
            onChange={(v) => setView(v as "grid" | "list")}
            options={[
              { id: "grid", label: "Grid", icon: LayoutGrid },
              { id: "list", label: "List", icon: ListIcon },
            ]}
          />
          <EcosystemActionBar.Separator />
          <EcosystemActionBar.Status active={filteredCampaigns.length > 0}>
            Showing {filteredCampaigns.length} of {rawCampaigns.length} Campaigns
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Broadcast Starters Recipes ─────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-[11.5px] font-bold text-foreground uppercase tracking-wider">
            Broadcast Ideas & Starters
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BROADCAST_STARTERS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => router.push("/email/send")}
                className="group flex flex-col justify-between p-3.5 rounded-xl border border-border/60 bg-card hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-2xs transition-all text-left cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shrink-0 shadow-xs",
                        item.gradient
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1.5 py-0 font-semibold rounded-[3px]"
                    >
                      {item.audience}
                    </Badge>
                  </div>
                  <p className="text-[12px] font-bold text-foreground group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[10.5px] text-muted-foreground leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10.5px] font-semibold text-indigo-600 dark:text-indigo-400 pt-3 border-t border-border/40 mt-3">
                  <span>Send Broadcast</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-0 border-none bg-transparent shadow-none ring-0 space-y-4">
        {filteredCampaigns.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-zinc-900 rounded-[8px] border border-dashed border-[#d2d5d9] dark:border-zinc-800 text-center space-y-2.5">
            <div className="w-10 h-10 rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800 flex items-center justify-center text-[#616161]">
              <Megaphone className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[13px] font-bold text-[#303030] dark:text-zinc-100">
                {search ? "No matching campaigns found" : "No email campaigns created yet"}
              </h3>
              <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 max-w-sm">
                {search
                  ? "Try clearing your search query or adjusting your filters."
                  : "Launch broadcast announcements, product drops, and community digests to your target audience."}
              </p>
            </div>
            {!search && (
              <Button
                type="button"
                onClick={() => router.push("/email/send")}
                className="h-[30px] px-3 text-[12px] font-semibold gap-1.5 mt-1 bg-[#303030] text-white rounded-[4px] cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Send First Campaign
              </Button>
            )}
          </div>
        ) : view === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onSelectAnalytics={setSelectedCampaignForAnalytics}
              />
            ))}
          </div>
        ) : (
          /* List View (Table) */
          <CampaignsTable
            campaigns={filteredCampaigns}
            isLoading={loading}
            onSelectAnalytics={setSelectedCampaignForAnalytics}
          />
        )}

        {/* Analytics Drilldown Slide-Over Modal */}
        {selectedCampaignForAnalytics && (
          <CampaignAnalyticsSheet
            campaign={selectedCampaignForAnalytics}
            onClose={() => setSelectedCampaignForAnalytics(null)}
          />
        )}

        {/* Export CSV Modal */}
        <ExportCsvModal
          open={showExportModal}
          onOpenChange={setShowExportModal}
          entityName="email campaigns"
          description="Export all campaign metadata, recipient metrics, and KPI rates as CSV."
          totalCount={rawCampaigns.length}
          matchingCount={
            search.trim() || statusFilter !== "ALL" || audienceFilter !== "ALL"
              ? filteredCampaigns.length
              : undefined
          }
          onExport={(scope, format) => {
            const rows = scope === "matching" ? filteredCampaigns : rawCampaigns;

            if (rows.length === 0) {
              toast.error("Nothing to export", {
                description: "No campaigns match your filter criteria.",
              });
              return;
            }

            const csv = buildCsv(rows, [
              { header: "Campaign Name",    getValue: (c) => c.name || "" },
              { header: "Subject",          getValue: (c) => c.subject || "" },
              { header: "Status",           getValue: (c) => c.status || "" },
              { header: "Audience Type",    getValue: (c) => c.audienceType || "" },
              { header: "Total Recipients", getValue: (c) => c.totalRecipients || 0 },
              { header: "Open Rate (%)",    getValue: (c) => c.metrics?.openRate || 0 },
              { header: "Click Rate (%)",   getValue: (c) => c.metrics?.clickRate || 0 },
              { header: "Delivery Rate (%)",getValue: (c) => c.metrics?.deliveryRate || 100 },
              { header: "Sent At",          getValue: (c) => c.sentAt || c.createdAt || "" },
            ]);

            const label = scope === "matching" ? "email-campaigns-filtered" : "email-campaigns";
            downloadCsv(csv, `${label}-${new Date().toISOString().slice(0, 10)}`, format);

            toast.success("Export ready", {
              description: `${rows.length} campaigns exported successfully.`,
            });
          }}
        />
      </EcosystemContainer>
    </div>
  );
}
