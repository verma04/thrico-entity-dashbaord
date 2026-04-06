"use client";

import React, { useState, useMemo } from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import {
  useGetEntityGamificationModules,
  useGetBadges,
  useCreateBadge,
  useUpdateBadge,
  Badge,
} from "@/graphql/actions";
import { Button } from "@/components/ui/button";
import { renderModuleIcon } from "@/components/subscription/utils";
import { BadgeStats } from "./badge-stats";
import { BadgeList } from "./badge-list";
import { BadgeDialog } from "./badge-dialog";
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
  const { selectedModule, setSelectedModule } = useGamificationStore();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { data: gamificationModulesData } = useGetEntityGamificationModules({});

  const {
    data: badgesData,
    refetch: refetchBadges,
    loading: badgesLoading,
  } = useGetBadges();
  const [createBadge, { loading: isCreating }] = useCreateBadge({
    onCompleted: () => {
      setIsDialogOpen(false);
      refetchBadges();
    },
  });
  const [updateBadge, { loading: isUpdating }] = useUpdateBadge({
    onCompleted: () => refetchBadges(),
  });

  const isSaving = isCreating || isUpdating;

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

  const triggers =
    gamificationModulesData?.getEntityGamificationModules?.triggers || [];

  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);

  const filteredBadges = useMemo(() => {
    if (selectedModule === "ALL") return badges;
    return badges.filter((b) => b.module === selectedModule || !b.module);
  }, [badges, selectedModule]);

  const handleOpenDialog = (badge?: Badge) => {
    if (badge) {
      setEditingBadge(badge);
    } else {
      setEditingBadge(null);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async (formData: Partial<Badge>) => {
    try {
      const input = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        type: formData.type,
        module: formData.module,
        action: formData.condition?.action || null,
        count: formData.condition?.count ? Number(formData.condition.count) : null,
        points: formData.condition?.pointsRequired
          ? Number(formData.condition.pointsRequired)
          : null,
      };

      if (editingBadge) {
        await updateBadge({ variables: { id: editingBadge.id, input } });
      } else {
        await createBadge({ variables: { input } });
      }
    } catch (error) {
      console.error("Failed to save badge:", error);
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Badges"
        badgeText="Gamification"
        description="Create and manage badges to recognize member achievements across your community."
        icon={Award}
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
                  <div className="flex items-center gap-2">
                    {renderModuleIcon(mod.icon)}
                    {mod.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchBadges()}
            className="gap-2"
          >
            <RotateCcw className={cn("h-3.5 w-3.5", badgesLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => handleOpenDialog()}
            className="gap-2"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Badge
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 space-y-6">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Badges are permanent once issued. To prevent further issuance, disable the badge rather than deleting it.
          </p>
        </div>

        {/* Stats */}
        <BadgeStats badges={badges} />

        {/* Badge List */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">All Badges</h2>
          <BadgeList
            badges={filteredBadges}
            modules={subscriptionModules}
            refetchBadges={refetchBadges}
            onEdit={handleOpenDialog}
            isLoading={badgesLoading}
          />
        </div>
      </EcosystemContainer>

      <BadgeDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingBadge={editingBadge}
        subscriptionModules={subscriptionModules}
        triggers={triggers}
        isLoading={isSaving}
        onSave={handleSave}
      />
    </EcosystemWrapper>
  );
}
