"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RectangleHorizontal, Plus, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
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

import { ScratchRewardTier, RewardType } from "./types";
import { ScratchCardPreview } from "./scratch-card-preview";
import { EconomyMonitor } from "./economy-monitor";
import { TiersTable } from "./tiers-table";
import { TierDialog } from "./tier-dialog";

const SectionCard = ({
  title,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  children,
  action,
}: {
  title: string;
  description?: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
      <div className="flex items-center gap-3">
        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
        >
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

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
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Tokens";
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!config) {
    return (
      <EcosystemContainer className="p-6">
        <div className="max-w-md mx-auto text-center space-y-6 py-12">
          <div className="h-20 w-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm ring-1 ring-indigo-100">
            <RectangleHorizontal className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Initialize Scratch Card
            </h2>
            <p className="text-muted-foreground text-sm">
              It looks like the scratch card module hasn't been set up yet.
              Initialize it now to start adding reward tiers and configuring
              gameplay.
            </p>
          </div>
          <Button
            onClick={() => handleSaveConfig()}
            disabled={savingConfig}
            className="w-full h-12 text-base font-semibold shadow-lg shadow-indigo-200"
          >
            {savingConfig && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Initialize Module
          </Button>
        </div>
      </EcosystemContainer>
    );
  }

  return (
    <>
      <EcosystemHeader
        title="Scratch Card"
        badgeText="Engagement"
        description={`Configure scratch card reward tiers, ${currencyName} costs, probability weights, and campaign windows.`}
        icon={RectangleHorizontal}
        breadcrumbs={[{ label: "Gamification", href: "/gamification" }, { label: "Engagement Games", href: "/gamification/engagement-games" }, { label: "Scratch Card" }]}
        actions={
          <EcosystemActionBar shadow="none" className="p-0 border-none bg-transparent">
            <EcosystemActionBar.Group>
              <div
                className={cn(
                  "h-2 w-2 rounded-full animate-pulse",
                  isEnabled ? "bg-emerald-500" : "bg-amber-500",
                )}
              />
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                {isEnabled ? "Active" : "Paused"}
              </span>
              <EcosystemActionBar.Separator />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {tiers.length} reward tiers
              </span>
            </EcosystemActionBar.Group>

          </EcosystemActionBar>
        }
      />

      <EcosystemContainer className="p-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: 2/3 */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-1 gap-4">
              <SectionCard
                icon={RectangleHorizontal}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
                title="System Status"
              >
                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {isEnabled ? "Active" : "Paused"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Scratch card availability
                    </p>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={setIsEnabled}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
              </SectionCard>
            </div>

            {/* Tiers Table */}
            <SectionCard
              icon={RectangleHorizontal}
              iconBg="bg-violet-50"
              iconColor="text-violet-600"
              title="Reward Tiers"
              description={`${tiers.length} tiers configured`}
              action={
                <Button
                  size="sm"
                  onClick={handleAddTier}
                  disabled={tiers.length >= 12}
                  className="gap-1.5 h-7 text-xs"
                >
                  <Plus className="h-3 w-3" />
                  Add Tier
                </Button>
              }
            >
              <TiersTable
                tiers={tiers}
                onEdit={(tier) => {
                  setEditingTier({ ...tier });
                  setIsDialogOpen(true);
                }}
                onDelete={setDeletingTierId}
                onToggleActive={handleToggleActive}
              />
            </SectionCard>
          </div>

          {/* Right: 1/3 Preview + Economy Monitor */}
          <div className="space-y-5">
            <div className="sticky top-6 space-y-6">
              <ScratchCardPreview />
              <EconomyMonitor avgPayout={avgPayout} />
            </div>
          </div>
        </div>
      </EcosystemContainer>

      <FloatingSavePanel
        hasChanged={hasChanged}
        isSaving={savingConfig}
        onSave={handleSaveConfig}
        onReset={handleReset}
        saved={saved}
        title="Unsaved Changes"
        description="You have modified the scratch card settings."
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              reward tier and remove it from the scratch card game.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTier}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingTier ? "Deleting..." : "Delete Tier"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
