"use client";

import React, { useState, useMemo } from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { Badge as BadgeType } from "../ts-types";
import {
  useGetEntityGamificationModules,
  useGetBadges,
  useCreateBadge,
  useUpdateBadge,
} from "@/graphql/actions";
import { Button } from "@/components/ui/button";
import { Plus, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { renderModuleIcon } from "@/components/subscription/utils";
import { BadgeStats } from "./badge-stats";
import { BadgeList } from "./badge-list";
import { BadgeDialog } from "./badge-dialog";

export function BadgesManager() {
  const { selectedModule, setSelectedModule } = useGamificationStore();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  // Get modules from entity subscription
  const { data: gamificationModulesData } = useGetEntityGamificationModules({});

  // ---------------------------------------------------------------------------
  // API INTEGRATION
  // ---------------------------------------------------------------------------
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

  const badges = (badgesData?.getBadges || []) as BadgeType[];

  const subscriptionModules = useMemo(() => {
    const modules =
      gamificationModulesData?.getEntityGamificationModules?.modules || [];
    return modules.map((m: any) => ({
      id: m.id,
      name: m.name,
      icon: m.icon,
    }));
  }, [gamificationModulesData]);

  console.log("subscriptionModules", subscriptionModules);

  const triggers =
    gamificationModulesData?.getEntityGamificationModules?.triggers || [];

  const [editingBadge, setEditingBadge] = useState<BadgeType | null>(null);

  const filteredBadges = useMemo(() => {
    if (selectedModule === "ALL") return badges;
    return badges.filter((b) => b.module === selectedModule || !b.module);
  }, [badges, selectedModule]);

  const handleOpenDialog = (badge?: BadgeType) => {
    if (badge) {
      setEditingBadge(badge);
    } else {
      setEditingBadge(null);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async (formData: Partial<BadgeType>) => {
    try {
      // Flatten the input to match the backend BadgeInput schema
      const input = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        type: formData.type,
        module: formData.module,
        // Map criteria fields to top-level
        action: formData.criteria?.action || null,
        count: formData.criteria?.count
          ? Number(formData.criteria.count)
          : null,
        // Map pointsRequired to points
        points: formData.criteria?.pointsRequired
          ? Number(formData.criteria.pointsRequired)
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
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">
          Badge Management Policy
        </AlertTitle>
        <AlertDescription className="text-blue-700">
          Badges cannot be deleted once created to maintain historical data
          integrity. You can enable or disable them to control their visibility
          to users.
        </AlertDescription>
      </Alert>

      {/* Stats */}
      <BadgeStats badges={badges} />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedModule === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedModule("ALL")}
          >
            All
          </Button>
          {subscriptionModules.map((mod) => (
            <Button
              key={mod.id}
              variant={selectedModule === mod.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedModule(mod.id as any)}
              className="flex items-center gap-1"
            >
              {renderModuleIcon(mod.icon)}
              {console.log(mod.name)}
            </Button>
          ))}
        </div>

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" /> Add Badge
        </Button>
      </div>

      <BadgeDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingBadge={editingBadge}
        subscriptionModules={subscriptionModules}
        triggers={triggers}
        isLoading={isSaving}
        onSave={handleSave}
      />

      <BadgeList
        badges={filteredBadges}
        modules={subscriptionModules}
        refetchBadges={refetchBadges}
        onEdit={handleOpenDialog}
        isLoading={badgesLoading}
      />
    </div>
  );
}
