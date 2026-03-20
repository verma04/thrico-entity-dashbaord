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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { renderModuleIcon } from "@/components/subscription/utils";
import { BadgeStats } from "./badge-stats";
import { BadgeList } from "./badge-list";
import { BadgeDialog } from "./badge-dialog";
import { Award, Plus, Info, LayoutGrid, Sparkles, ShieldCheck, Activity, RotateCcw, Save, Zap } from "lucide-react";
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
        count: formData.condition?.count
          ? Number(formData.condition.count)
          : null,
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
    <EcosystemWrapper anonymized-1="badge-management-suite">
      <EcosystemHeader
        title="Distinction Studio"
        badgeText="Gamification Protocol"
        description="Craft digital artifacts that recognize community achievement. Configure issuance logic and visual identity for all badges."
        icon={Award}
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
                      <div className="flex items-center gap-2">
                        {renderModuleIcon(mod.icon)}
                        {mod.name.toUpperCase()}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                 <span>Security Active</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => refetchBadges()}
                className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-slate-50 transition-all"
              >
                <RotateCcw className={cn("h-4 w-4", badgesLoading && "animate-spin")} />
                Sync
              </Button>
              <Button
                onClick={() => handleOpenDialog()}
                className="h-10 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-wider gap-3 shadow-xl transition-all active:scale-95 group"
              >
                <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
                Instantiate Badge
              </Button>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8">
        <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-100/50 flex items-start gap-4">
           <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
           <div className="space-y-1">
              <h4 className="text-[11px] font-black text-amber-900 uppercase tracking-tight">System Policy: Achievement Invariance</h4>
              <p className="text-[11px] font-bold text-amber-700/80 uppercase leading-relaxed tracking-tight italic">
                 Badges are persistent once issued. Restrict future issuance by disabling the badge logic.
              </p>
           </div>
        </div>

        {/* Stats Section */}
        <BadgeStats badges={badges} />

        {/* Badge List Section */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-1">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                 <Award className="h-5 w-5" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Badge Matrix</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Definition of current distinctions</p>
              </div>
           </div>

           <div className="p-0 border-none bg-transparent">
             <BadgeList
               badges={filteredBadges}
               modules={subscriptionModules}
               refetchBadges={refetchBadges}
               onEdit={handleOpenDialog}
               isLoading={badgesLoading}
             />
           </div>
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
