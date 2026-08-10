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
import { renderModuleIcon } from "@/components/subscription/utils";
import { BadgeStats } from "./badge-stats";
import { BadgeList } from "./badge-list";
import { Award, Plus, Info, LayoutGrid, RotateCcw } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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

  const subscriptionModules = useMemo(() => {
    const modules =
      gamificationModulesData?.getEntityGamificationModules?.modules || [];
    return modules.map((m: any) => ({
      id: m.id,
      name: m.name,
      icon: m.icon,
    }));
  }, [gamificationModulesData]);

  const filteredBadges = useMemo(() => {
    let list = badges;
    if (selectedModule !== "ALL") {
      list = list.filter((b) => b.module === selectedModule || !b.module);
    }
    if (search) {
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.description?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return list;
  }, [badges, selectedModule, search]);

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
        description="Create and manage badges to recognize member achievements and drive sustained community engagement."
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
                { value: "ALL", label: "All Modules", icon: LayoutGrid },
                ...subscriptionModules.map((m) => ({
                  value: m.id,
                  label: m.name,
                  icon:
                    (require("lucide-react") as any)[m.icon] ||
                    require("lucide-react").Settings,
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
            modules={subscriptionModules}
            refetchBadges={refetchBadges}
            onEdit={handleEdit}
            isLoading={badgesLoading}
          />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
