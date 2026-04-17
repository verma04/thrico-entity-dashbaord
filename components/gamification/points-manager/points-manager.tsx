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
import { Button } from "@/components/ui/button";
import { Plus, Info, Coins, LayoutGrid, RotateCcw } from "lucide-react";
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
import { StatsCards } from "./stats-cards";
import { RulesTable } from "./rules-table";
import { cn } from "@/lib/utils";
import { renderModuleIcon } from "@/components/subscription/utils";

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
    useGetGamificationStats({
      notifyOnNetworkStatusChange: true,
    });

  const pointRules = pointRulesData?.getPointRules || [];
  const gamificationStats = gamificationStatsData?.getGamificationStats;

  const subscriptionModules = useMemo(() => {
    const modules =
      gamificationModulesData?.getEntityGamificationModules?.modules || [];
    return modules.map((m) => ({
      id: m.id,
      name: m.name,
      icon: m.icon || "Settings",
    }));
  }, [gamificationModulesData]);

  const filteredRules = useMemo(() => {
    let list = pointRules;
    if (selectedModule !== "ALL") {
      list = list.filter((rule) => rule.module === selectedModule);
    }
    if (search) {
      list = list.filter(r => 
        r.action.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return list;
  }, [selectedModule, pointRules, search]);

  const handleCreate = () => {
    router.push("/gamification/points/create");
  };

  const handleEdit = (rule: PointRule) => {
    router.push(`/gamification/points/edit/${rule.id}`);
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Points"
        badgeText="Gamification"
        description="Define point rules for community actions. Set caps and triggers to control point distribution."
        icon={Coins}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
             <EcosystemActionBar.Search 
               value={search}
               onChange={setSearch}
               placeholder="Search rules..."
             />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Select
              value={selectedModule}
              onValueChange={(val) => setSelectedModule(val as any)}
            >
              <SelectTrigger className="w-[180px] h-9 text-sm rounded-xl border-border bg-card">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="All Modules" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl p-1 shadow-lg border-border">
                <SelectItem value="ALL" className="rounded-lg py-2">All Modules</SelectItem>
                {subscriptionModules.map((mod) => (
                  <SelectItem key={mod.id} value={mod.id} className="rounded-lg py-2">
                    <div className="flex items-center gap-2">
                       {renderModuleIcon(mod.icon, "h-3.5 w-3.5")}
                       {mod.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              onClick={() => { refetchRules(); refetchStats(); }}
              className="h-9 w-9 rounded-xl border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <RotateCcw size={14} className={cn(rulesLoading && "animate-spin")} />
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Button
              size="sm"
              onClick={handleCreate}
              className="h-9 px-4 rounded-xl gap-2 shadow-sm font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Rule
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={filteredRules.length > 0}>
             {filteredRules.length} Rules Active
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-4">
           <StatsCards pointRules={pointRules} stats={gamificationStats} />
        </div>

        <div className="px-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100/50 mb-6">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-indigo-100">
               <Info className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-[13px] text-indigo-700/80 leading-relaxed font-medium">
              Point rules cannot be deleted to maintain historical consistency. Use the status toggle to disable a rule and immediately cease point distribution for that event.
            </p>
          </div>

          <RulesTable
            rules={filteredRules}
            selectedModule={selectedModule}
            modules={subscriptionModules}
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
