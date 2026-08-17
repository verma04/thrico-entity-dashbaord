"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetRanks,
  useUpdateRankOrder,
  Rank,
} from "@/graphql/actions";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { StatsCards } from "./stats-cards";
import { RankList } from "./rank-list";
import { Crown, Plus, Upload } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { InlineAlert } from "@/components/ui/inline-alert";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";

export function RanksManager() {
  const router = useRouter();
  const { data: ranksData, refetch, loading: ranksLoading } = useGetRanks();
  const ranks = ranksData?.getRanks || [];

  const [updateRankOrder] = useUpdateRankOrder({
    onCompleted: () => refetch(),
  });

  const [search, setSearch] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

  const filteredRanks = React.useMemo(() => {
    if (!search) return ranks;
    return ranks.filter((r: Rank) =>
      r.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [ranks, search]);

  const handleCreate = () => {
    router.push("/gamification/points-and-badges/ranks/create");
  };

  const handleEdit = (rank: Rank) => {
    router.push(`/gamification/points-and-badges/ranks/edit/${rank.id}`);
  };

  const handleMoveRank = async (index: number, direction: "up" | "down") => {
    const sortedRanks = [...filteredRanks].sort((a, b) => a.order - b.order);
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= sortedRanks.length) return;

    const rankOrders = [
      { id: sortedRanks[index].id, order: sortedRanks[targetIndex].order },
      { id: sortedRanks[targetIndex].id, order: sortedRanks[index].order },
    ];

    try {
      await updateRankOrder({ variables: { rankOrders } });
    } catch (error) {
      console.error("Error updating rank order:", error);
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Ranks"
        badgeText="Hierarchy"
        description="Set point thresholds for each rank level."
        icon={Crown}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Points & Badges", href: "/gamification/points-and-badges" },
          { label: "Ranks" },
        ]}
        actions={
          <EcosystemActionBar
            shadow="none"
            className="p-0 border-none bg-transparent gap-2"
          >
            <EcosystemActionBar.Group align="right">
              <EcosystemActionBar.Item>
                <CtaButton onClick={handleCreate}>
                  <Plus className="h-3 w-3" />
                  Add Rank
                </CtaButton>
              </EcosystemActionBar.Item>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>
        }
      />

      <div className="px-6 pt-2 pb-0">
        <InlineAlert
          variant="alert"
          message="Reordering ranks will automatically adjust the order property of each level. Member eligibility is calculated in real-time based on these thresholds."
          className="rounded-xl"
        />
      </div>

      <EcosystemActionBar shadow="sm" className="">
        <EcosystemActionBar.Item grow className="max-w-sm">
          <EcosystemActionBar.Search
            value={search}
            onChange={setSearch}
            placeholder="Search ranks..."
          />
        </EcosystemActionBar.Item>
        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-4">
          <StatsCards ranks={ranks} />
        </div>

        <div className="px-6">
          <RankList
            ranks={filteredRanks}
            onMoveUp={(index) => handleMoveRank(index, "up")}
            onMoveDown={(index) => handleMoveRank(index, "down")}
            onEdit={handleEdit}
            refetch={refetch}
            isLoading={ranksLoading}
          />
        </div>
      </EcosystemContainer>

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="ranks"
        description="Export rank definitions as a CSV file. Includes name, point thresholds, order, and status."
        totalCount={ranks.length}
        matchingCount={search.trim() ? filteredRanks.length : undefined}
        onExport={(scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = scope === "matching" ? filteredRanks : ranks as Rank[];

          if (rows.length === 0) {
            toast.error("Nothing to export", {
              description: "No ranks found to export.",
            });
            return;
          }

          const csv = buildCsv(rows, [
            { header: "Name",               getValue: (r) => r.name || "" },
            { header: "Min Points",         getValue: (r) => r.minPoints ?? 0 },
            { header: "Max Points",         getValue: (r) => r.maxPoints ?? 0 },
            { header: "Order",              getValue: (r) => r.order ?? "" },
            { header: "Color",              getValue: (r) => r.color || "" },
            { header: "Icon",               getValue: (r) => r.icon || "" },
            { header: "Push Notification",  getValue: (r) => r.allowPushNotification !== false ? "Enabled" : "Disabled" },
            { header: "Email Notification", getValue: (r) => r.allowEmailNotification !== false ? "Enabled" : "Disabled" },
            { header: "Status",             getValue: (r) => r.isActive ? "Active" : "Inactive" },
            { header: "Created At",         getValue: (r) => r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : "" },
            { header: "Updated At",         getValue: (r) => r.updatedAt ? new Date(r.updatedAt).toISOString().slice(0, 10) : "" },
          ]);

          const label = scope === "matching" ? "ranks-search" : "ranks";
          downloadCsv(csv, `${label}-${new Date().toISOString().slice(0, 10)}`, format);

          toast.success("Export ready", {
            description: `${rows.length} rank${rows.length !== 1 ? "s" : ""} exported successfully.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
}
