"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RectangleHorizontal, Plus, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  useGetScratchCardConfig,
  useGetScratchCardPrizes,
  useUpdateScratchCardConfig,
  useCreateScratchCardPrize,
  useUpdateScratchCardPrize,
  useDeleteScratchCardPrize,
  useGetScratchActivity,
  useLazyGetVouchersByRewardMechanism,
} from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

import { ScratchRewardTier, RewardType } from "./types";
import { ScratchCardPreview } from "./scratch-card-preview";
import { EconomyMonitor } from "./economy-monitor";
import { TiersTable } from "./tiers-table";
import { TierDialog } from "./tier-dialog";
import { EcosystemHeader } from "@/components/layout/ecosystem";

export function ScratchCardManager() {
  const {
    data: configData,
    refetch: refetchConfig,
    loading: configLoading,
  } = useGetScratchCardConfig();
  const { data: prizesData, refetch: refetchPrizes } =
    useGetScratchCardPrizes();
  const { data: activityData } = useGetScratchActivity({
    pagination: { page: 1, limit: 10 },
  });
  const [updateConfig, { loading: savingConfig }] =
    useUpdateScratchCardConfig();
  const [createTier, { loading: creatingTier }] = useCreateScratchCardPrize();
  const [updateTier, { loading: updatingTier }] = useUpdateScratchCardPrize();
  const [deleteTier, { loading: deletingTier }] = useDeleteScratchCardPrize();

  const config = configData?.getScratchCardConfig;
  const [isEnabled, setIsEnabled] = useState(false);
  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";
  const [tiers, setTiers] = useState<ScratchRewardTier[]>([]);
  const [editingTier, setEditingTier] = useState<ScratchRewardTier | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deletingTierId, setDeletingTierId] = useState<string | null>(null);

  const [getVouchers, { data: vouchersData, loading: vouchersLoading }] =
    useLazyGetVouchersByRewardMechanism();

  const uniqueVoucherRewards = React.useMemo(() => {
    if (!vouchersData?.getVouchersByRewardMechanism) return [];
    const map = new Map();
    vouchersData.getVouchersByRewardMechanism.forEach((v: any) => {
      if (v.reward && !map.has(v.reward.id)) {
        map.set(v.reward.id, v.reward);
      }
    });
    return Array.from(map.values());
  }, [vouchersData]);

  const hasChanged = React.useMemo(() => {
    if (!config) return false;
    return isEnabled !== (config.isActive ?? true);
  }, [config, isEnabled]);

  useEffect(() => {
    if (config && !initialized) {
      setIsEnabled(config.isActive ?? true);
      setInitialized(true);
    }
  }, [config, initialized]);

  useEffect(() => {
    if (prizesData?.getScratchCardPrizes?.length > 0) {
      setTiers(
        prizesData.getScratchCardPrizes.map((p: any) => ({
          id: p.id,
          label: p.label,
          rewardType: (p.type || "COINS").toUpperCase() as RewardType,
          rewardValue: p.value ?? 0,
          cardColor: "#4F46E5",
          isActive: p.isActive !== false,
          rewardId: p.rewardId || null,
          minAccountAge: p.minAccountAge || 0,
          minActivity: p.minActivity || 0,
          eligibilityDescription: p.eligibilityDescription || "",
        })),
      );
    }
  }, [prizesData]);

  const avgPayout = tiers.reduce(
    (sum, t) =>
      t.rewardType === "COINS"
        ? sum + t.rewardValue / (tiers.length || 1)
        : sum,
    0,
  );

  const handleSaveConfig = async () => {
    try {
      await updateConfig({
        variables: {
          input: {
            isActive: isEnabled,
          },
        },
      });
      toast.success("Scratch card configuration saved");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save configuration");
    }
  };

  const handleReset = () => {
    if (config) {
      setIsEnabled(config.isActive ?? true);
    }
  };

  const handleAddTier = () => {
    setEditingTier({
      id: "",
      label: "",
      rewardType: "COINS",
      rewardValue: 0,
      cardColor: "#4F46E5",
      isActive: true,
      rewardId: null,
      minAccountAge: 0,
      minActivity: 0,
      eligibilityDescription: "",
    });
    setIsDialogOpen(true);
  };

  const handleSaveTier = async () => {
    if (!editingTier) return;
    const input = {
      label: editingTier.label,
      type: editingTier.rewardType.toUpperCase(),
      value: editingTier.rewardValue,
      rewardId: editingTier.rewardId,
      minAccountAge: editingTier.minAccountAge,
      minActivity: editingTier.minActivity,
      eligibilityDescription: editingTier.eligibilityDescription,
    };
    try {
      if (editingTier.id) {
        await updateTier({ variables: { id: editingTier.id, input } });
        toast.success("Tier updated");
      } else {
        await createTier({ variables: { input } });
        toast.success("Tier added");
      }
      setIsDialogOpen(false);
      setEditingTier(null);
      refetchPrizes();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save tier");
    }
  };

  const handleDeleteTier = async () => {
    if (!deletingTierId) return;
    try {
      await deleteTier({ variables: { id: deletingTierId } });
      toast.success("Tier deleted");
      refetchPrizes();
      setDeletingTierId(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete tier");
    }
  };

  const handleToggleActive = async (id: string, v: boolean) => {
    try {
      await updateTier({
        variables: { id, input: { isActive: v } },
      });
      toast.success("Updated");
      refetchPrizes();
    } catch {
      toast.error("Update failed");
    }
  };

  if (configLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-900 dark:text-zinc-100" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-20">
        <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl flex items-center justify-center mx-auto border border-zinc-200 dark:border-zinc-700">
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Initialize Scratch Card
          </h2>
          <p className="text-zinc-500 text-xs leading-relaxed">
            The scratch card engine hasn't been provisioned for this organization yet. Initialize it now to configure tiers and start rewarding members.
          </p>
        </div>
        <Button
          onClick={() => handleSaveConfig()}
          disabled={savingConfig}
          className="w-full h-11 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl shadow-xs"
        >
          {savingConfig && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Initialize Module
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-black/10 overflow-hidden relative">
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 md:px-8 py-3">
          <EcosystemHeader
            title="Scratch Card"
            badgeText="Interactive Game"
            description={`Configure scratch card prize tiers, ${currencyName} cost per play, and win probabilities.`}
            icon={Sparkles}
            breadcrumbs={[
              { label: "Gamification", href: "/gamification" },
              { label: "Engagement Games", href: "/gamification/engagement-games" },
              { label: "Scratch Card" },
            ]}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-6">
              {/* Member Live Simulator */}
              <ScratchCardPreview />

              {/* Economic Health */}
              <EconomyMonitor avgPayout={avgPayout} currencyName={currencyName} />

              {/* Strategic Tip */}
              <PolarisTipCard title="Engagement Tip">
                Daily scratch cards provide high daily check-in motivation. Require minimum account age or activity points on top tiers to eliminate multi-account farming.
              </PolarisTipCard>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Step 1: System Status & State */}
            <PolarisFormCard
              step={1}
              title="Game Status & Engine"
              description="Control availability of the scratch card experience for community members."
              badge="Game State"
            >
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="scratchActive"
                    className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block cursor-pointer"
                  >
                    Scratch Game Availability
                  </Label>
                  <p className="text-[11px] text-zinc-500">
                    {isEnabled ? "Live and claimable by qualified members" : "Game currently paused"}
                  </p>
                </div>
                <Switch
                  id="scratchActive"
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                  className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
                />
              </div>
            </PolarisFormCard>

            {/* Step 2: Reward Tiers Table */}
            <PolarisFormCard
              step={2}
              title="Scratch Reward Tiers"
              description="Manage prize tiers, points, voucher connections, and claim qualifications."
              badge={`${tiers.length} Active Tiers`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {tiers.length} total prize tiers configured
                </p>
                <Button
                  size="sm"
                  onClick={handleAddTier}
                  disabled={tiers.length >= 12}
                  className="gap-1.5 h-8 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Tier
                </Button>
              </div>

              <TiersTable
                tiers={tiers}
                currencyName={currencyName}
                onEdit={(tier) => {
                  setEditingTier({ ...tier });
                  setIsDialogOpen(true);
                }}
                onDelete={setDeletingTierId}
                onToggleActive={handleToggleActive}
              />
            </PolarisFormCard>
          </div>
        </PolarisFormLayout>
      </div>

      <FloatingSavePanel
        hasChanged={hasChanged}
        isSaving={savingConfig}
        onSave={handleSaveConfig}
        onReset={handleReset}
        saved={saved}
        title="Unsaved Configuration"
        description="You have pending changes to the scratch card settings."
        buttonText="Save Configuration"
      />

      <TierDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingTier={editingTier}
        setEditingTier={setEditingTier}
        onSave={handleSaveTier}
        isSaving={creatingTier || updatingTier}
        currencyName={currencyName}
        uniqueVoucherRewards={uniqueVoucherRewards}
        vouchersLoading={vouchersLoading}
        getVouchers={getVouchers}
      />

      <AlertDialog
        open={!!deletingTierId}
        onOpenChange={(open) => !open && setDeletingTierId(null)}
      >
        <AlertDialogContent className="rounded-2xl border-zinc-200 dark:border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold">
              Delete Reward Tier?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-zinc-500">
              This action cannot be undone. This will permanently delete the reward tier from the scratch card engine.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-lg text-xs font-semibold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTier}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg text-xs font-bold"
            >
              {deletingTier ? "Deleting..." : "Delete Tier"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
