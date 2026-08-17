"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGamificationStore } from "@/store/useGamificationStore";
import {
  useGetEntityGamificationModules,
  useGetBadges,
  Badge,
} from "@/graphql/actions";

import { CtaButton } from "@/components/ui/cta-button";
import * as LucideIcons from "lucide-react";
import { Award, Plus, Info, LayoutGrid, RotateCcw, Settings, Upload } from "lucide-react";
import { BadgeStats } from "./badge-stats";
import { BadgeList } from "./badge-list";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { InlineAlert } from "@/components/ui/inline-alert";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function BadgesManager() {
  const router = useRouter();
  const { selectedModule, setSelectedModule } = useGamificationStore();
  const [search, setSearch] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const { data: gamificationModulesData } = useGetEntityGamificationModules({});

  const {
    data: badgesData,
    refetch: refetchBadges,
    loading: badgesLoading,
  } = useGetBadges();

  const badges = (badgesData?.getBadges || []) as Badge[];

  const subscriptionSources = useMemo(() => {
    const modules =
      gamificationModulesData?.getEntityGamificationModules?.modules || [];
    const integrations =
      gamificationModulesData?.getEntityGamificationModules?.integrations || [];

    const formattedModules = modules.map((m: any) => ({
      id: m.id,
      uuid: m.uuid,
      name: m.name ? m.name.charAt(0).toUpperCase() + m.name.slice(1) : m.name,
      icon: m.icon || "Settings",
      type: "MODULE" as const,
    }));

    const formattedIntegrations = integrations.map((i: any) => ({
      id: i.id,
      uuid: i.uuid,
      slug: i.slug,
      name: i.name ? i.name.charAt(0).toUpperCase() + i.name.slice(1) : i.name,
      icon: i.icon || "Boxes",
      type: "INTEGRATION" as const,
    }));

    return [...formattedModules, ...formattedIntegrations];
  }, [gamificationModulesData]);

  const filteredBadges = useMemo(() => {
    let list = badges;
    if (selectedModule === "SOURCE_MODULE") {
      list = list.filter((b) => {
        const moduleInfo = subscriptionSources.find(
          (s) =>
            s.id?.toLowerCase() === b.module?.toLowerCase() ||
            s.uuid?.toLowerCase() === b.module?.toLowerCase() ||
            (s as any).slug?.toLowerCase() === b.module?.toLowerCase(),
        );
        const source = b.source || moduleInfo?.type || "MODULE";
        return source === "MODULE";
      });
    } else if (selectedModule === "SOURCE_INTEGRATION") {
      list = list.filter((b) => {
        const moduleInfo = subscriptionSources.find(
          (s) =>
            s.id?.toLowerCase() === b.module?.toLowerCase() ||
            s.uuid?.toLowerCase() === b.module?.toLowerCase() ||
            (s as any).slug?.toLowerCase() === b.module?.toLowerCase(),
        );
        const source = b.source || moduleInfo?.type || "MODULE";
        return source === "INTEGRATION";
      });
    } else if (selectedModule !== "ALL") {
      list = list.filter(
        (b) =>
          b.module?.toLowerCase() === selectedModule.toLowerCase() ||
          subscriptionSources.find(
            (s) => s.id?.toLowerCase() === selectedModule.toLowerCase(),
          )?.uuid?.toLowerCase() === b.module?.toLowerCase() ||
          subscriptionSources.find(
            (s) => s.uuid?.toLowerCase() === selectedModule.toLowerCase(),
          )?.id?.toLowerCase() === b.module?.toLowerCase() ||
          subscriptionSources.find(
            (s) => (s as any).slug?.toLowerCase() === selectedModule.toLowerCase(),
          )?.id?.toLowerCase() === b.module?.toLowerCase() ||
          subscriptionSources.find(
            (s) => (s as any).slug?.toLowerCase() === selectedModule.toLowerCase(),
          )?.uuid?.toLowerCase() === b.module?.toLowerCase(),
      );
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.name?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.action?.toLowerCase().includes(q) ||
          b.module?.toLowerCase().includes(q) ||
          b.source?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [badges, selectedModule, search, subscriptionSources]);

  const handleCreate = () => {
    router.push("/gamification/points-and-badges/badges/create");
  };

  const handleEdit = (badge: Badge) => {
    router.push(`/gamification/points-and-badges/badges/edit/${badge.id}`);
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Badges"
        badgeText="Recognition"
        description="Create and manage badges to recognise member achievements."
        icon={Award}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Badges" },
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
                  Add Badge
                </CtaButton>
              </EcosystemActionBar.Item>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>
        }
      />

      <div className="px-6 pt-2 pb-0">
        <InlineAlert
          variant="alert"
          message="Badges are permanent records once issued to members. To stop issuing a badge without affecting existing recipients, safely disable it via the status toggle."
          className="rounded-xl"
        />
      </div>

      <EcosystemActionBar shadow="sm" className="">
        <EcosystemActionBar.Item grow className="max-w-sm">
          <EcosystemActionBar.Search
            value={search}
            onChange={setSearch}
            placeholder="Search badges..."
          />
        </EcosystemActionBar.Item>
        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={selectedModule}
              onValueChange={(val) => setSelectedModule(val as any)}
              options={[
                { value: "ALL", label: subscriptionSources.some(s => s.type === "INTEGRATION") ? "All Modules & Integrations" : "All Modules", icon: LayoutGrid },
                { value: "SOURCE_MODULE", label: "All Modules", icon: Settings },
                ...(subscriptionSources.some(s => s.type === "INTEGRATION") ? [{
                  value: "SOURCE_INTEGRATION",
                  label: "All Integrations",
                  icon: (LucideIcons as any)["Boxes"] || LayoutGrid,
                }] : []),
                ...subscriptionSources.map((m) => ({
                  value: m.id,
                  label: `${m.name}${m.type === "INTEGRATION" ? " (Integration)" : ""}`,
                  icon:
                    (LucideIcons as any)[m.icon] ||
                    (m.type === "INTEGRATION"
                      ? (LucideIcons as any)["Boxes"]
                      : Settings),
                })),
              ]}
            />
          </EcosystemActionBar.Item>
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
          <BadgeStats badges={badges} />
        </div>

        <div className="px-6">
          <BadgeList
            badges={filteredBadges}
            modules={subscriptionSources}
            refetchBadges={refetchBadges}
            onEdit={handleEdit}
            isLoading={badgesLoading}
          />
        </div>
      </EcosystemContainer>

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="badges"
        description="Export badge definitions as a CSV file. Includes badge name, type, module, points, and status."
        totalCount={badges.length}
        matchingCount={search.trim() ? filteredBadges.length : undefined}
        onExport={(scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = scope === "matching" ? filteredBadges : filteredBadges;

          if (rows.length === 0) {
            toast.error("Nothing to export", {
              description: "No badges match the current view.",
            });
            return;
          }

          const csv = buildCsv(rows, [
            { header: "Name",         getValue: (b) => b.name || "" },
            { header: "Description",  getValue: (b) => b.description || "" },
            { header: "Type",         getValue: (b) => b.type || "" },
            { header: "Module",       getValue: (b) => b.module || "" },
            { header: "Source",       getValue: (b) => b.source || "MODULE" },
            { header: "Action",       getValue: (b) => b.action || "" },
            { header: "Target Value", getValue: (b) => b.targetValue ?? "" },
            { header: "Count",        getValue: (b) => b.count ?? "" },
            { header: "Points",       getValue: (b) => b.points ?? "" },
            { header: "Icon",               getValue: (b) => b.icon || "" },
            { header: "Push Notification",  getValue: (b) => b.allowPushNotification !== false ? "Enabled" : "Disabled" },
            { header: "Email Notification", getValue: (b) => b.allowEmailNotification !== false ? "Enabled" : "Disabled" },
            { header: "Status",             getValue: (b) => b.isActive ? "Active" : "Inactive" },
            { header: "Created At",   getValue: (b) => b.createdAt ? new Date(b.createdAt).toISOString().slice(0, 10) : "" },
            { header: "Updated At",   getValue: (b) => b.updatedAt ? new Date(b.updatedAt).toISOString().slice(0, 10) : "" },
          ]);

          const label = scope === "matching" ? "badges-search" : "badges";
          downloadCsv(csv, `${label}-${new Date().toISOString().slice(0, 10)}`, format);

          toast.success("Export ready", {
            description: `${rows.length} badge${rows.length !== 1 ? "s" : ""} exported successfully.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
}
