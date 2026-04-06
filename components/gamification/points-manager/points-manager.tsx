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
import { PointRuleDialog } from "./point-rule-dialog";
import { RulesTable } from "./rules-table";
import { cn } from "@/lib/utils";

export function PointsManager() {
  const { selectedModule, setSelectedModule } = useGamificationStore();

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
      icon: m.icon || "Settings",
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
    <EcosystemWrapper>
      <EcosystemHeader
        title="Points"
        badgeText="Gamification"
        description="Define point rules for community actions. Set caps and triggers to control point distribution."
        icon={Coins}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <Select
            value={selectedModule}
            onValueChange={(val) => setSelectedModule(val as any)}
          >
            <SelectTrigger className="w-[180px] h-8 text-sm">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="All Modules" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Modules</SelectItem>
              {subscriptionModules.map((mod) => (
                <SelectItem key={mod.id} value={mod.id}>
                  {mod.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { refetchRules(); refetchStats(); }}
            className="gap-2"
          >
            <RotateCcw className={cn("h-3.5 w-3.5", rulesLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => handleOpenDialog()}
            className="gap-2"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Rule
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 space-y-6">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Point rules cannot be deleted to maintain consistency. Use the status toggle to disable a rule instead.
          </p>
        </div>

        {/* Stats */}
        <StatsCards pointRules={pointRules} stats={gamificationStats} />

        {/* Table Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Rules</h2>
          <div className="rounded-lg border border-border overflow-hidden">
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
