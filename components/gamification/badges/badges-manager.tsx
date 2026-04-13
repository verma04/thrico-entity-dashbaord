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
  const [search, setSearch] = useState("");
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
    let list = badges;
    if (selectedModule !== "ALL") {
      list = list.filter((b) => b.module === selectedModule || !b.module);
    }
    if (search) {
      list = list.filter(b => 
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return list;
  }, [badges, selectedModule, search]);

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
        badgeText="Recognition"
        description="Create and manage badges to recognize member achievements and drive sustained community engagement."
        icon={Award}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search badges..."
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
              className="h-9 w-9 rounded-xl border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => refetchBadges()}
            >
              <RotateCcw className={cn(badgesLoading && "animate-spin")} size={14} />
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Button
              size="sm"
              onClick={() => handleOpenDialog()}
              className="h-9 px-4 rounded-xl gap-2 shadow-sm font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Badge
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={filteredBadges.length > 0}>
             {filteredBadges.length} Credentials Available
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-4">
          <BadgeStats badges={badges} />
        </div>

        <div className="px-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100/50 mb-6">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-indigo-100">
              <Info className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-[13px] text-indigo-700/80 leading-relaxed font-medium">
              Badges are permanent records once issued to members. To stop issuing a badge without affecting existing recipients, safely disable it via the status toggle.
            </p>
          </div>

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
