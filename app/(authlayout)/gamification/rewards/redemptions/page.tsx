"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Upload,
  Ticket,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShoppingBag,
  Gift,
  Layers,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetRedemptions } from "@/graphql/actions/rewards";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { RedemptionsTable, Redemption } from "@/components/rewards/redemptions/redemptions-table";
import { useModuleStore } from "@/store/useModuleStore";
import { useDebounce } from "use-debounce";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type PillarFilterType = "ALL" | "PILLAR_1" | "PILLAR_2" | "PILLAR_3";

const PILLAR_TABS = [
  {
    value: "ALL",
    label: "All Redemptions",
    icon: Layers,
    dot: "",
  },
  {
    value: "PILLAR_1",
    label: "Internal Vouchers",
    icon: Ticket,
    dot: "bg-emerald-500",
  },
  {
    value: "PILLAR_2",
    label: "Shopify Discounts",
    icon: ShoppingBag,
    dot: "bg-indigo-500",
  },
  {
    value: "PILLAR_3",
    label: "Digital Gift Cards",
    icon: Gift,
    dot: "bg-purple-500",
  },
];

export default function RedemptionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rewardsModuleName = useModuleStore((state) => state.rewardsModuleName);

  // URL state synchronization
  const pillarParam = (searchParams.get("pillar") as PillarFilterType) || "ALL";
  const statusParam = searchParams.get("status") || "ALL";
  const queryParam = searchParams.get("q") || "";
  const pageParam = Number(searchParams.get("page") || "1");

  const [search, setSearch] = useState(queryParam);
  const [debouncedSearch] = useDebounce(search, 300);
  const [showExportModal, setShowExportModal] = useState(false);
  const pageSize = 12;

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null, page: null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const { data, loading, refetch } = useGetRedemptions({
    pagination: { page: pageParam, limit: 100 },
  });

  // Map live GraphQL data
  const allRedemptions: Redemption[] = useMemo(() => {
    return (data?.getRedemptions || []).map((r: any) => {
      const provider = (r.metadata?.provider || "").toUpperCase();
      const rewardType = (r.reward?.rewardType || "").toUpperCase();
      let pillar: "PILLAR_1" | "PILLAR_2" | "PILLAR_3" = "PILLAR_1";

      if (
        rewardType === "GIFT_CARD" ||
        provider === "GIFT_CARD" ||
        provider === "THRICO" ||
        provider === "XOXODAY"
      ) {
        pillar = "PILLAR_3";
      } else if (
        rewardType === "STORE" ||
        provider === "SHOPIFY" ||
        provider === "STORE"
      ) {
        pillar = "PILLAR_2";
      }

      return {
        id: r.id,
        user: r.user,
        reward: r.reward,
        ecUsed: r.ecUsed,
        tcUsed: r.tcUsed,
        faceValue: r.faceValue || r.metadata?.faceValue,
        serviceFee: r.serviceFee || r.metadata?.serviceFee,
        totalCost: r.totalCost,
        claimedAt: r.claimedAt,
        createdAt: r.createdAt,
        status: r.status,
        pillar,
        metadata: r.metadata,
      };
    });
  }, [data]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      ALL: allRedemptions.length,
      PILLAR_1: allRedemptions.filter((r) => r.pillar === "PILLAR_1").length,
      PILLAR_2: allRedemptions.filter((r) => r.pillar === "PILLAR_2").length,
      PILLAR_3: allRedemptions.filter((r) => r.pillar === "PILLAR_3").length,
    };
  }, [allRedemptions]);

  // Filtered redemptions
  const filteredRedemptions = useMemo(() => {
    return allRedemptions.filter((r) => {
      // Pillar filter
      if (pillarParam === "PILLAR_1" && r.pillar !== "PILLAR_1") return false;
      if (pillarParam === "PILLAR_2" && r.pillar !== "PILLAR_2") return false;
      if (pillarParam === "PILLAR_3" && r.pillar !== "PILLAR_3") return false;

      // Status filter
      if (
        statusParam === "COMPLETED" &&
        !["DELIVERED", "REDEEMED", "FULFILLED", "SUCCESS", "APPROVED", "COMPLETED"].includes(
          r.status?.toUpperCase()
        )
      ) {
        return false;
      }
      if (
        statusParam === "PENDING" &&
        !["PENDING", "RESERVED"].includes(r.status?.toUpperCase())
      ) {
        return false;
      }

      // Search filter
      if (debouncedSearch.trim()) {
        const s = debouncedSearch.toLowerCase();
        const memberName = `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.toLowerCase();
        const memberEmail = (r.user?.email || "").toLowerCase();
        const rewardTitle = (r.reward?.title || "").toLowerCase();
        const code = (
          r.metadata?.voucherCode ||
          r.metadata?.couponCode ||
          ""
        ).toLowerCase();
        return (
          memberName.includes(s) ||
          memberEmail.includes(s) ||
          rewardTitle.includes(s) ||
          code.includes(s)
        );
      }

      return true;
    });
  }, [allRedemptions, pillarParam, statusParam, debouncedSearch]);

  const totalPages = Math.ceil(filteredRedemptions.length / pageSize) || 1;
  const paginatedRedemptions = useMemo(() => {
    const start = (pageParam - 1) * pageSize;
    return filteredRedemptions.slice(start, start + pageSize);
  }, [filteredRedemptions, pageParam, pageSize]);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Redemption History"
        badgeText="All Pillars"
        description={`Complete audit trail of internal vouchers, Shopify coupons, and digital gift cards claimed across your ecosystem.`}
        icon={Receipt}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Redemptions" },
        ]}
      />

      {/* ── KPI Summary Cards ────────────────────────────────────────────── */}
      <div className="px-6 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
            Total Redemptions
          </span>
          <span className="text-lg font-bold text-foreground font-mono block">
            {allRedemptions.length}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-1">
          <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase tracking-wider font-bold">
            Pillar 1 • Internal Vouchers
          </span>
          <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300 font-mono block">
            {tabCounts.PILLAR_1}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-1">
          <span className="text-[10px] text-indigo-800 dark:text-indigo-300 uppercase tracking-wider font-bold">
            Pillar 2 • Shopify Discounts
          </span>
          <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300 font-mono block">
            {tabCounts.PILLAR_2}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-purple-200/60 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/10 space-y-1">
          <span className="text-[10px] text-purple-800 dark:text-purple-300 uppercase tracking-wider font-bold">
            Pillar 3 • Digital Gift Cards
          </span>
          <span className="text-lg font-bold text-purple-700 dark:text-purple-300 font-mono block">
            {tabCounts.PILLAR_3}
          </span>
        </div>
      </div>

      {/* ── Action & Filter Bar ──────────────────────────────────────────── */}
      <div className="px-6 pt-3">
        <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item grow className="max-w-xs">
              <EcosystemActionBar.Search
                value={search}
                onChange={setSearch}
                placeholder="Search member, email, reward or code..."
              />
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Separator />

          <EcosystemActionBar.Group>
            {/* Status Select */}
            <Select
              value={statusParam}
              onValueChange={(val) => updateParams({ status: val, page: null })}
            >
              <SelectTrigger className="h-8 text-xs font-semibold bg-card border-border shadow-2xs w-[160px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">
                  All Statuses
                </SelectItem>
                <SelectItem value="COMPLETED" className="text-xs">
                  Delivered / Redeemed
                </SelectItem>
                <SelectItem value="PENDING" className="text-xs">
                  Pending / Reserved
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-8 w-8 rounded-lg cursor-pointer"
            >
              <RotateCcw className={cn(loading && "animate-spin", "h-3.5 w-3.5 text-muted-foreground")} />
            </Button>

            {/* Export CSV Button */}
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>

            <EcosystemActionBar.Separator />

            <EcosystemActionBar.Status active={filteredRedemptions.length > 0}>
              Showing {paginatedRedemptions.length} of {filteredRedemptions.length} Redemptions
            </EcosystemActionBar.Status>
          </EcosystemActionBar.Group>
        </EcosystemActionBar>
      </div>

      {/* ── Pillar Quick Filter Tabs ─────────────────────────────────────── */}
      <div className="px-6 pt-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {PILLAR_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pillarParam === tab.value;
          const count = tabCounts[tab.value as keyof typeof tabCounts] || 0;

          return (
            <button
              key={tab.value}
              onClick={() => updateParams({ pillar: tab.value, page: null })}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer border",
                isActive
                  ? "bg-foreground text-background border-foreground shadow-xs"
                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border/70"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                  isActive
                    ? "bg-background/20 text-background"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Table Container ──────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-4">
        <div className="px-6">
          <RedemptionsTable
            redemptions={paginatedRedemptions}
            isLoading={loading}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 pb-6 flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Page {pageParam} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateParams({ page: String(Math.max(1, pageParam - 1)) })}
                disabled={pageParam <= 1 || loading}
                className="h-8 w-8"
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateParams({ page: String(Math.min(totalPages, pageParam + 1)) })}
                disabled={pageParam >= totalPages || loading}
                className="h-8 w-8"
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </EcosystemContainer>

      {/* ── Export CSV Modal ─────────────────────────────────────────────── */}
      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="redemptions"
        description="Export multi-pillar redemption history as a CSV file. Includes member info, reward title, pillar source, cost, voucher code, PIN, and date."
        totalCount={allRedemptions.length}
        matchingCount={filteredRedemptions.length}
        onExport={(scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = (scope === "matching" ? filteredRedemptions : allRedemptions) as any[];

          if (rows.length === 0) {
            toast.error("Nothing to export", {
              description: "No redemptions match the current view.",
            });
            return;
          }

          const csv = buildCsv(rows, [
            { header: "Transaction ID", getValue: (r) => r.id || "" },
            { header: "First Name",     getValue: (r) => r.user?.firstName || "" },
            { header: "Last Name",      getValue: (r) => r.user?.lastName || "" },
            { header: "Email",          getValue: (r) => r.user?.email || "" },
            { header: "Reward Title",   getValue: (r) => r.reward?.title || "" },
            { header: "Pillar",         getValue: (r) => r.pillar || "" },
            { header: "Total Cost (₹)", getValue: (r) => r.totalCost || r.faceValue || 0 },
            { header: "Coins Spent",    getValue: (r) => r.ecUsed || r.tcUsed || 0 },
            { header: "Status",         getValue: (r) => r.status || "" },
            { header: "Voucher Code",   getValue: (r) => r.metadata?.voucherCode || r.metadata?.couponCode || "" },
            { header: "Card PIN",       getValue: (r) => r.metadata?.pin || r.metadata?.cardPin || "" },
            { header: "Provider",       getValue: (r) => r.metadata?.provider || "" },
            { header: "Idempotency Key", getValue: (r) => r.metadata?.idempotencyKey || "" },
            { header: "Game Source",    getValue: (r) => r.metadata?.gameSource || "" },
            { header: "Claimed Date",   getValue: (r) => r.claimedAt ? new Date(r.claimedAt).toISOString().slice(0, 19) : "" },
          ]);

          const label = scope === "matching" ? "redemptions-filtered" : `redemptions-all`;
          downloadCsv(csv, `${label}-${new Date().toISOString().slice(0, 10)}`, format);

          toast.success("Export ready", {
            description: `${rows.length} redemption${rows.length !== 1 ? "s" : ""} exported successfully.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
}
