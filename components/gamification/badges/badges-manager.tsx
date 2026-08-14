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
import { Award, Plus, Info, LayoutGrid, RotateCcw, Settings } from "lucide-react";
import { BadgeStats } from "./badge-stats";
import { BadgeList } from "./badge-list";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export function BadgesManager() {
  const router = useRouter();
  const { selectedModule, setSelectedModule } = useGamificationStore();
  const [search, setSearch] = useState("");
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
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-4">
          <BadgeStats badges={badges} />
        </div>

        <div className="px-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50/50 dark:bg-neutral-900/50 border border-zinc-200 dark:border-neutral-800 mb-6 font-medium text-zinc-700 dark:text-zinc-300">
            <div className="h-8 w-8 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center shadow-sm shrink-0 border border-zinc-200 dark:border-neutral-800">
              <Info className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            </div>
            <p className="text-[13px] leading-relaxed">
              Badges are permanent records once issued to members. To stop
              issuing a badge without affecting existing recipients, safely
              disable it via the status toggle.
            </p>
          </div>

          <BadgeList
            badges={filteredBadges}
            modules={subscriptionSources}
            refetchBadges={refetchBadges}
            onEdit={handleEdit}
            isLoading={badgesLoading}
          />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
