"use client";

import React, { useState, useMemo } from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import {
  useGetEntityGamificationModules,
  useGetPointRules,
  useGetGamificationStats,
  useCreatePointRule,
  useUpdatePointRule,
  useDeletePointRule,
  PointRule,
} from "@/graphql/actions";
import { Button } from "@/components/ui/button";
import { Plus, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatsCards } from "./stats-cards";
import { ModuleFilter } from "./module-filter";
import { PointRuleDialog } from "./point-rule-dialog";
import { RulesTable } from "./rules-table";

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
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Point Rules Policy</AlertTitle>
        <AlertDescription className="text-blue-700">
          Point rules cannot be deleted once created to maintain historical data
          integrity. You can enable or disable them to control their visibility
          to users.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <StatsCards pointRules={pointRules} stats={gamificationStats} />

      {/* Controls */}

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <ModuleFilter
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule as (m: string | "ALL") => void}
          modules={subscriptionModules}
        />

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" /> Add Point Rule
        </Button>

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
      </div>

      {/* Rules Table */}
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
  );
}
