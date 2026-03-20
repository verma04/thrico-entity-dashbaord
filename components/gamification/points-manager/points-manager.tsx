"use client";

import React, { useState, useMemo } from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import {
  useGetEntityGamificationModules,
  useGetPointRules,
  useGetGamificationStats,
  useCreatePointRule,
  useUpdatePointRule,
  PointRule,
} from "@/graphql/actions";
import { Button } from "@/components/ui/button";
import { Plus, Info, Coins, LayoutGrid, Activity, Sparkles, ShieldCheck, Zap, RotateCcw, Save } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatsCards } from "./stats-cards";
import { PointRuleDialog } from "./point-rule-dialog";
import { RulesTable } from "./rules-table";
import { cn } from "@/lib/utils";

export function PointsManager() {
  const { selectedModule, setSelectedModule } = useGamificationStore();

  // Get modules from entity gamification modules
  const { data: gamificationModulesData } = useGetEntityGamificationModules({});

  // Get Point Rules
  const {
    data: pointRulesData,
    refetch: refetchRules,
    loading: rulesLoading,
  } = useGetPointRules({
    notifyOnNetworkStatusChange: true,
  });

  // Get Gamification Stats
  const { data: gamificationStatsData, refetch: refetchStats } =
    useGetGamificationStats({
      notifyOnNetworkStatusChange: true,
    });

  const pointRules = pointRulesData?.getPointRules || [];
  const gamificationStats = gamificationStatsData?.getGamificationStats;

  // Mutations
  const [createPointRule, { loading: createLoading }] = useCreatePointRule({
    onCompleted: () => {
      refetchRules();
      refetchStats();
      setIsDialogOpen(false);
    },
  });

  const [updatePointRule, { loading: updateLoading }] = useUpdatePointRule({
    onCompleted: () => {
      refetchRules();
      refetchStats();
    },
  });

  const isSaving = createLoading || updateLoading;

  const subscriptionModules = useMemo(() => {
    const modules =
      gamificationModulesData?.getEntityGamificationModules?.modules || [];
    return modules.map((m) => ({
      id: m.id,
      name: m.name,
      icon: m.icon || "Settings", // Lucide icon name
    }));
  }, [gamificationModulesData]);

  const triggers = useMemo(() => {
    return (
      gamificationModulesData?.getEntityGamificationModules?.triggers || []
    );
  }, [gamificationModulesData]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PointRule | null>(null);

  const filteredRules = useMemo(() => {
    if (selectedModule === "ALL") return pointRules;
    return pointRules.filter((rule) => rule.module === selectedModule);
  }, [selectedModule, pointRules]);

  const handleOpenDialog = (rule?: PointRule) => {
    if (rule) {
      setEditingRule(rule);
    } else {
      setEditingRule(null);
    }
    setIsDialogOpen(true);
  };

  const handleSaveRule = async (formData: Partial<PointRule>) => {
    try {
      if (editingRule) {
        await updatePointRule({
          variables: {
            id: editingRule.id,
            input: {
              points:
                typeof formData.points === "string"
                  ? parseInt(formData.points)
                  : formData.points,
              dailyCap:
                typeof formData.dailyCap === "string"
                  ? parseInt(formData.dailyCap)
                  : formData.dailyCap,
              weeklyCap:
                typeof formData.weeklyCap === "string"
                  ? parseInt(formData.weeklyCap)
                  : formData.weeklyCap,
              monthlyCap:
                typeof formData.monthlyCap === "string"
                  ? parseInt(formData.monthlyCap)
                  : formData.monthlyCap,
              isActive: formData.isActive,
              description: formData.description,
            },
          },
        });
      } else {
        await createPointRule({
          variables: {
            input: {
              module: formData.module,
              action: formData.action,
              trigger: formData.trigger,
              points:
                typeof formData.points === "string"
                  ? parseInt(formData.points)
                  : formData.points,
              dailyCap:
                typeof formData.dailyCap === "string"
                  ? parseInt(formData.dailyCap)
                  : formData.dailyCap,
              weeklyCap:
                typeof formData.weeklyCap === "string"
                  ? parseInt(formData.weeklyCap)
                  : formData.weeklyCap,
              monthlyCap:
                typeof formData.monthlyCap === "string"
                  ? parseInt(formData.monthlyCap)
                  : formData.monthlyCap,
              description: formData.description,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error saving point rule:", error);
    }
  };

  return (
    <EcosystemWrapper anonymized-1="points-control-panel">
      <EcosystemHeader
        title="Points Economy"
        badgeText="Gamification Protocol"
        description="Establish foundational point issuance rules. Configure caps, triggers, and yields across the community ecosystem."
        icon={Sparkles}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <Select
                value={selectedModule}
                onValueChange={(val) => setSelectedModule(val as any)}
              >
                <SelectTrigger className="w-[200px] h-10 rounded-xl border-slate-200 bg-white hover:bg-slate-50 transition-all font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-indigo-500" />
                    <SelectValue placeholder="All Modules" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-1">
                  <SelectItem value="ALL" className="font-bold rounded-lg py-2.5">ALL MODULES</SelectItem>
                  {subscriptionModules.map((mod) => (
                    <SelectItem
                      key={mod.id}
                      value={mod.id}
                      className="font-bold rounded-lg py-2.5"
                    >
                      {mod.name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                 <span>Stability Active</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => { refetchRules(); refetchStats(); }}
                className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-slate-50 transition-all"
              >
                <RotateCcw className={cn("h-4 w-4", rulesLoading && "animate-spin")} />
                Sync
              </Button>
              <Button
                onClick={() => handleOpenDialog()}
                className="h-10 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-wider gap-3 shadow-xl transition-all active:scale-95 group"
              >
                <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
                Seed New Rule
              </Button>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8">
        <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100/50 flex items-start gap-4">
           <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
           <div className="space-y-1">
              <h4 className="text-[11px] font-black text-indigo-900 uppercase tracking-tight">System Policy: Historical Integrity</h4>
              <p className="text-[11px] font-bold text-indigo-700/80 uppercase leading-relaxed tracking-tight italic">
                 Points cannot be deleted to maintain treasury consistency. Use the status toggle to restrict issuance.
              </p>
           </div>
        </div>

        {/* Stats Section */}
        <StatsCards pointRules={pointRules} stats={gamificationStats} />

        {/* Main Table */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-1">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                 <Activity className="h-5 w-5" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Rule Matrix</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Foundational issuance parameters</p>
              </div>
           </div>

           <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
             <RulesTable
               rules={filteredRules}
               selectedModule={selectedModule}
               modules={subscriptionModules}
               refetchRules={refetchRules}
               refetchStats={refetchStats}
               onEdit={handleOpenDialog}
               isLoading={rulesLoading}
             />
           </div>
        </div>
      </EcosystemContainer>

      <PointRuleDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingRule={editingRule}
        modules={subscriptionModules}
        triggers={triggers}
        pointRules={pointRules}
        onSave={handleSaveRule}
        isLoading={isSaving}
      />
    </EcosystemWrapper>
  );
}
