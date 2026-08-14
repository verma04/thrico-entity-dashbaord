"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGamificationStore } from "@/store/useGamificationStore";
import {
  useGetEntityGamificationModules,
  useGetPointRules,
  useGetGamificationStats,
  PointRule,
} from "@/graphql/actions";

import { CtaButton } from "@/components/ui/cta-button";
import * as LucideIcons from "lucide-react";
import { Plus, Info, Coins, LayoutGrid, RotateCcw, Settings } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

import { StatsCards } from "./stats-cards";
import { RulesTable } from "./rules-table";

export function PointsManager() {
  const router = useRouter();
  const { selectedModule, setSelectedModule } = useGamificationStore();
  const [search, setSearch] = useState("");

  const { data: gamificationModulesData } = useGetEntityGamificationModules({});

  const {
    data: pointRulesData,
    refetch: refetchRules,
    loading: rulesLoading,
  } = useGetPointRules({
    notifyOnNetworkStatusChange: true,
  });

  const { data: gamificationStatsData, refetch: refetchStats } =
    useGetGamificationStats(undefined, undefined, {
      notifyOnNetworkStatusChange: true,
    });

  const pointRules = pointRulesData?.getPointRules || [];
  const gamificationStats = gamificationStatsData?.getGamificationStats;

  const subscriptionSources = useMemo(() => {
    const modules =
      gamificationModulesData?.getEntityGamificationModules?.modules || [];
    const integrations =
      gamificationModulesData?.getEntityGamificationModules?.integrations || [];

    const formattedModules = modules.map((m) => ({
      id: m.id,
      uuid: m.uuid,
      name: m.name ? m.name.charAt(0).toUpperCase() + m.name.slice(1) : m.name,
      icon: m.icon || "Settings",
      type: "MODULE" as const,
    }));

    const formattedIntegrations = integrations.map((i) => ({
      id: i.id,
      uuid: i.uuid,
      name: i.name ? i.name.charAt(0).toUpperCase() + i.name.slice(1) : i.name,
      icon: i.icon || "Boxes",
      type: "INTEGRATION" as const,
    }));

    return [...formattedModules, ...formattedIntegrations];
  }, [gamificationModulesData]);

  const filteredRules = useMemo(() => {
    let list = pointRules;
    if (selectedModule === "SOURCE_MODULE") {
      list = list.filter((r) => {
        const moduleInfo = subscriptionSources.find(
          (s) =>
            s.id?.toLowerCase() === r.module?.toLowerCase() ||
            s.uuid?.toLowerCase() === r.module?.toLowerCase() ||
            (s as any).slug?.toLowerCase() === r.module?.toLowerCase(),
        );
        const source = r.source || moduleInfo?.type || "MODULE";
        return source === "MODULE";
      });
    } else if (selectedModule === "SOURCE_INTEGRATION") {
      list = list.filter((r) => {
        const moduleInfo = subscriptionSources.find(
          (s) =>
            s.id?.toLowerCase() === r.module?.toLowerCase() ||
            s.uuid?.toLowerCase() === r.module?.toLowerCase() ||
            (s as any).slug?.toLowerCase() === r.module?.toLowerCase(),
        );
        const source = r.source || moduleInfo?.type || "MODULE";
        return source === "INTEGRATION";
      });
    } else if (selectedModule !== "ALL") {
      list = list.filter(
        (rule) =>
          rule.module?.toLowerCase() === selectedModule.toLowerCase() ||
          subscriptionSources.find(
            (s) => s.id?.toLowerCase() === selectedModule.toLowerCase(),
          )?.uuid?.toLowerCase() === rule.module?.toLowerCase() ||
          subscriptionSources.find(
            (s) => s.uuid?.toLowerCase() === selectedModule.toLowerCase(),
          )?.id?.toLowerCase() === rule.module?.toLowerCase() ||
          subscriptionSources.find(
            (s) => (s as any).slug?.toLowerCase() === selectedModule.toLowerCase(),
          )?.id?.toLowerCase() === rule.module?.toLowerCase() ||
          subscriptionSources.find(
            (s) => (s as any).slug?.toLowerCase() === selectedModule.toLowerCase(),
          )?.uuid?.toLowerCase() === rule.module?.toLowerCase(),
      );
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.action?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.module?.toLowerCase().includes(q) ||
          r.source?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [selectedModule, pointRules, search, subscriptionSources]);

  const handleCreate = () => {
    router.push("/gamification/points-and-badges/points/create");
  };

  const handleEdit = (rule: PointRule) => {
    router.push(`/gamification/points-and-badges/points/edit/${rule.id}`);
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Points"
        badgeText="Gamification"
        description="Define and allocate point rules for various engagements and activities by module."
        icon={Coins}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Points" },
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
                  Add Rule
                </CtaButton>
              </EcosystemActionBar.Item>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>
        }
      />

      <EcosystemActionBar className="">
        <EcosystemActionBar.Item grow className="max-w-sm">
          <EcosystemActionBar.Search
            value={search}
            onChange={setSearch}
            placeholder="Search rules..."
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
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 ">
        <div className="px-6 py-4">
          <StatsCards pointRules={pointRules} stats={gamificationStats} />
        </div>

        <div className="px-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50/50 dark:bg-neutral-900/50 border border-zinc-200 dark:border-neutral-800 mb-6">
            <div className="h-8 w-8 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center shadow-sm shrink-0 border border-zinc-200 dark:border-neutral-800">
              <Info className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            </div>
            <p className="text-[13px] text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
              Point rules cannot be deleted to maintain historical consistency.
              Use the status toggle to disable a rule and immediately cease
              point distribution for that event.
            </p>
          </div>

          <RulesTable
            rules={filteredRules}
            selectedModule={selectedModule}
            modules={subscriptionSources}
            refetchRules={refetchRules}
            refetchStats={refetchStats}
            onEdit={handleEdit}
            isLoading={rulesLoading}
          />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
