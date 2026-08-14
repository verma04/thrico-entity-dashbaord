"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Trophy,
  Loader2,
  Plus,
  Coins,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useGetRewards,
  useGetMatchWinData,
  useUpdateMatchWinConfig,
  useUpdateMatchWinSymbol,
  useUpsertMatchWinCombination,
  useDeleteMatchWinCombination,
  useInitializeMatchWinConfig,
} from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";

import { MatchWinCombination, MatchWinSymbol } from "./types";
import { SymbolsTable, CombinationsTable } from "./config-tables";
import { EconomySidebar } from "./economy-sidebar";
import { SymbolDialog } from "./symbol-dialog";
import { CombinationDialog } from "./combination-dialog";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { EcosystemHeader } from "@/components/layout/ecosystem";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisPresetChips,
} from "@/components/gamification/shared/polaris-form-ui";

const COST_PRESETS = [5, 10, 25, 50, 100];

export function MatchWinManager() {
  const {
    data: gameData,
    refetch: refetchData,
    loading: dataLoading,
  } = useGetMatchWinData();
  const { data: rewardsData } = useGetRewards({
    status: "ACTIVE",
    pagination: { page: 1, limit: 100 },
  });
  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";

  const [updateConfig, { loading: savingConfig }] = useUpdateMatchWinConfig();
  const [updateSymbol, { loading: updatingSymbol }] = useUpdateMatchWinSymbol();
  const [upsertCombination, { loading: upsertingCombination }] =
    useUpsertMatchWinCombination();
  const [deleteCombination, { loading: deletingCombination }] =
    useDeleteMatchWinCombination();
  const [initializeConfig, { loading: initializingConfig }] =
    useInitializeMatchWinConfig();

  // ── Local state ──
  const config = gameData?.getMatchWinConfig;
  const dbSymbols = config?.symbols || [];
  const dbCombinations = config?.combinations || [];

  const [isActive, setIsActive] = useState(false);
  const [costPerPlay, setCostPerPlay] = useState(25);
  const [maxPlaysPerDay, setMaxPlaysPerDay] = useState(3);

  const [editingSymbol, setEditingSymbol] = useState<MatchWinSymbol | null>(
    null,
  );
  const [editingCombination, setEditingCombination] =
    useState<MatchWinCombination | null>(null);
  const [isEditingExistingSymbol, setIsEditingExistingSymbol] = useState(false);

  const [isSymbolDialogOpen, setIsSymbolDialogOpen] = useState(false);
  const [isCombinationDialogOpen, setIsCombinationDialogOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deletingCombinationId, setDeletingCombinationId] = useState<
    string | null
  >(null);

  const hasChanged = React.useMemo(() => {
    if (!config) return false;
    return (
      isActive !== (config.isActive ?? false) ||
      costPerPlay !== (config.costPerPlay ?? 25) ||
      maxPlaysPerDay !== (config.maxPlaysPerDay ?? 3)
    );
  }, [config, isActive, costPerPlay, maxPlaysPerDay]);

  // Sync from API
  useEffect(() => {
    if (config && !initialized) {
      setIsActive(config.isActive ?? false);
      setCostPerPlay(config.costPerPlay ?? 25);
      setMaxPlaysPerDay(config.maxPlaysPerDay ?? 3);
      setInitialized(true);
    }
  }, [config, initialized]);

  // Economy calculation
  const totalProbability = dbCombinations.reduce(
    (s: number, comb: any) => s + (Number(comb.probability) || 0),
    0,
  );

  const avgPayout = dbCombinations.reduce((sum: number, comb: any) => {
    if (comb.type === "COINS" || comb.type === "TC") {
      return sum + comb.value * ((Number(comb.probability) || 0) / 100);
    }
    return sum;
  }, 0);

  const profitMargin =
    costPerPlay > 0 ? ((costPerPlay - avgPayout) / costPerPlay) * 100 : 0;

  const handleSaveConfig = async () => {
    if (costPerPlay < 1) {
      toast.error("Play cost must be at least 1");
      return;
    }
    if (maxPlaysPerDay < 1) {
      toast.error("Max plays per day must be at least 1");
      return;
    }
    if (totalProbability > 100) {
      toast.error("Total probability cannot exceed 100%");
      return;
    }

    try {
      await updateConfig({
        variables: {
          input: {
            costPerPlay,
            maxPlaysPerDay,
            isActive,
          },
        },
      });
      toast.success("Match & Win configuration saved!");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save configuration");
    }
  };

  const handleReset = () => {
    if (config) {
      setIsActive(config.isActive ?? false);
      setCostPerPlay(config.costPerPlay ?? 25);
      setMaxPlaysPerDay(config.maxPlaysPerDay ?? 3);
    }
  };

  const handleInitializeConfig = async () => {
    try {
      await initializeConfig();
      toast.success("Match & Win initialized successfully!");
      refetchData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to initialize configuration");
    }
  };

  const handleEditSymbol = (s: MatchWinSymbol) => {
    setEditingSymbol({ ...s });
    setIsEditingExistingSymbol(true);
    setIsSymbolDialogOpen(true);
  };

  const handleSaveSymbol = async () => {
    if (!editingSymbol || !editingSymbol.key) {
      toast.error("Key is required");
      return;
    }
    try {
      await updateSymbol({
        variables: {
          configId: config?.id,
          input: {
            key: editingSymbol.key,
            label: editingSymbol.label,
            icon: editingSymbol.icon,
            color: editingSymbol.color,
          },
        },
      });
      toast.success("Symbol saved");
      setIsSymbolDialogOpen(false);
      refetchData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save symbol");
    }
  };

  const handleSaveCombination = async () => {
    if (!editingCombination || !editingCombination.key || !config?.id) {
      toast.error("Required data missing");
      return;
    }
    const isNoRewards = editingCombination.type === "NO_REWARDS";

    if (!isNoRewards) {
      const s1 = editingCombination.symbol1Id || editingCombination.symbol1?.id;
      const s2 = editingCombination.symbol2Id || editingCombination.symbol2?.id;
      const s3 = editingCombination.symbol3Id || editingCombination.symbol3?.id;
      if (!s1 || !s2 || !s3) {
        toast.error(
          "All 3 symbol slots are required for a winning combination.",
        );
        return;
      }
    }

    try {
      await upsertCombination({
        variables: {
          configId: config.id,
          input: {
            key: editingCombination.key,
            type: editingCombination.type,
            value: isNoRewards ? 0 : Number(editingCombination.value),
            probability: Number(editingCombination.probability),
            maxWins: Number(editingCombination.maxWins),
            rewardId: isNoRewards ? null : editingCombination.rewardId || null,
            symbol1Id: isNoRewards
              ? null
              : editingCombination.symbol1Id ||
                editingCombination.symbol1?.id ||
                null,
            symbol2Id: isNoRewards
              ? null
              : editingCombination.symbol2Id ||
                editingCombination.symbol2?.id ||
                null,
            symbol3Id: isNoRewards
              ? null
              : editingCombination.symbol3Id ||
                editingCombination.symbol3?.id ||
                null,
          },
        },
      });
      toast.success("Combination saved");
      setIsCombinationDialogOpen(false);
      refetchData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save combination");
    }
  };

  const handleDeleteCombination = async (id: string) => {
    try {
      await deleteCombination({
        variables: { deleteMatchWinCombinationId: id },
      });
      toast.success("Combination deleted");
      refetchData();
    } catch {
      toast.error("Failed to delete combination");
    }
  };

  if (dataLoading) {
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
          <Trophy className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Initialize Match & Win
          </h2>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Match & Win hasn&apos;t been set up yet. Initialize the engine to configure symbols and winning combinations.
          </p>
        </div>
        <Button
          onClick={handleInitializeConfig}
          disabled={initializingConfig}
          className="w-full h-11 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl shadow-xs"
        >
          {initializingConfig && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Initialize Game Engine
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-black/10 overflow-hidden relative">
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 md:px-8 py-3">
          <EcosystemHeader
            title="Match & Win"
            badgeText="Interactive Game"
            description={`Configure the 3-column slot matching game — set ${currencyName} cost per play, winning combinations, and odds.`}
            icon={Trophy}
            breadcrumbs={[
              { label: "Gamification", href: "/gamification" },
              { label: "Engagement Games", href: "/gamification/engagement-games" },
              { label: "Match & Win" },
            ]}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PolarisFormLayout
          sidebar={
            <EconomySidebar
              costPerPlay={costPerPlay}
              maxPlaysPerDay={maxPlaysPerDay}
              avgPayout={avgPayout}
              profitMargin={profitMargin}
              currencyName={currencyName}
            />
          }
        >
          <div className="space-y-6">
            {/* Step 1: Game Economics & State */}
            <PolarisFormCard
              step={1}
              title="Game Economics & State"
              description="Control availability, participation cost in points, and daily play velocity."
              badge="Game Rules"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Status Switch Card */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="matchWinActive"
                      className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block cursor-pointer"
                    >
                      Game Status
                    </Label>
                    <p className="text-[11px] text-zinc-500">
                      {isActive ? "Live and playable by members" : "Game currently paused"}
                    </p>
                  </div>
                  <Switch
                    id="matchWinActive"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                    className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
                  />
                </div>

                {/* Daily Cap */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="dailyCap"
                      className="text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                    >
                      Daily Limit / Member
                    </Label>
                    <span className="text-[10px] text-zinc-400">
                      Velocity Control
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      id="dailyCap"
                      type="number"
                      min={1}
                      value={maxPlaysPerDay}
                      onChange={(e) => setMaxPlaysPerDay(Number(e.target.value))}
                      className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-semibold shadow-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-medium">
                      plays / day
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost Per Play Input with Presets */}
              <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Label
                  htmlFor="costPerPlay"
                  className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Cost per Play ({currencyName})
                </Label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-900 dark:text-zinc-100">
                      <Coins className="h-4 w-4" />
                    </div>
                    <Input
                      id="costPerPlay"
                      type="number"
                      min={1}
                      value={costPerPlay}
                      onChange={(e) => setCostPerPlay(Number(e.target.value))}
                      className="h-11 pl-10 pr-16 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-base font-bold text-zinc-900 dark:text-zinc-100 shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      {currencyName.substring(0, 3).toUpperCase()}
                    </div>
                  </div>

                  <PolarisPresetChips
                    presets={COST_PRESETS}
                    currentValue={Number(costPerPlay)}
                    onSelect={(v) => setCostPerPlay(v)}
                    prefix=""
                  />
                </div>
              </div>
            </PolarisFormCard>

            {/* Step 2: Symbol Matrix */}
            <PolarisFormCard
              step={2}
              title="Game Reel Icons"
              description="Customize the 3 icon assets used across the slot reels."
              badge={`${dbSymbols.length} Symbols`}
            >
              <SymbolsTable symbols={dbSymbols} onEdit={handleEditSymbol} />
            </PolarisFormCard>

            {/* Step 3: Win Logic Combinations */}
            <PolarisFormCard
              step={3}
              title="Reward Combinations"
              description="Winning symbol patterns, jackpot multiplier values, and probability odds."
              badge={`${dbCombinations.length} Combinations`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Total Allocated Win Rate:{" "}
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    {totalProbability.toFixed(1)}%
                  </strong>
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingCombination({
                      key: "",
                      type: "COINS",
                      value: 0,
                      probability: 10,
                      maxWins: 0,
                    });
                    setIsCombinationDialogOpen(true);
                  }}
                  className="gap-1.5 h-8 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Combination
                </Button>
              </div>

              <CombinationsTable
                combinations={dbCombinations}
                totalProbability={totalProbability}
                onEdit={(c) => {
                  setEditingCombination(c);
                  setIsCombinationDialogOpen(true);
                }}
                onDelete={setDeletingCombinationId}
                onAdd={() => {
                  setEditingCombination({
                    key: "",
                    type: "COINS",
                    value: 0,
                    probability: 10,
                    maxWins: 0,
                  });
                  setIsCombinationDialogOpen(true);
                }}
                currencyName={currencyName}
              />
            </PolarisFormCard>
          </div>
        </PolarisFormLayout>
      </div>

      {/* Dialogs */}
      <SymbolDialog
        open={isSymbolDialogOpen}
        onOpenChange={setIsSymbolDialogOpen}
        editingSymbol={editingSymbol}
        setEditingSymbol={(s) => setEditingSymbol(s)}
        isEditingExisting={isEditingExistingSymbol}
        onSave={handleSaveSymbol}
        saving={updatingSymbol}
      />

      <CombinationDialog
        open={isCombinationDialogOpen}
        onOpenChange={setIsCombinationDialogOpen}
        editingCombination={editingCombination}
        setEditingCombination={(c) => setEditingCombination(c)}
        onSave={handleSaveCombination}
        saving={upsertingCombination}
        rewardsData={rewardsData}
        symbols={dbSymbols}
        currencyName={currencyName}
      />

      <FloatingSavePanel
        hasChanged={hasChanged}
        isSaving={savingConfig}
        onSave={handleSaveConfig}
        onReset={handleReset}
        saved={saved}
        title="Unsaved Configuration"
        description="You have pending changes to the Match & Win configuration."
        buttonText="Save Configuration"
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingCombinationId}
        onOpenChange={(open) => !open && setDeletingCombinationId(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this combination? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingCombinationId(null)}
              className="rounded-lg text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                if (deletingCombinationId) {
                  await handleDeleteCombination(deletingCombinationId);
                  setDeletingCombinationId(null);
                }
              }}
              disabled={deletingCombination}
              className="rounded-lg text-xs font-bold"
            >
              {deletingCombination ? "Deleting..." : "Delete Combination"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
