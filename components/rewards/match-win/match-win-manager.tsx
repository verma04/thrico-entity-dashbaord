"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  RefreshCw,
  Trophy,
  Settings,
  History,
  Loader2,
  Plus,
  Users,
  Activity,
  LayoutGrid,
  Coins,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
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
import { SectionCard } from "../spin-wheel/section-card";
import {
  useGetRewards,
  useGetMatchWinData,
  useGetMatchWinPlays,
  useUpdateMatchWinConfig,
  useUpdateMatchWinSymbol,
  useUpsertMatchWinCombination,
  useDeleteMatchWinCombination,
  useGetSpinScratchStats,
  useGetInitialMatchWinConfig,
  useInitializeMatchWinConfig,
} from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { uniqueId } from "lodash";

import { MatchWinCombination, MatchWinSymbol } from "./types";
import { MatchWinStats } from "./match-win-stats";
import { MatchWinActivityLog } from "./match-win-activity-log";
import { SymbolsTable, CombinationsTable } from "./config-tables";
import { EconomySidebar } from "./economy-sidebar";
import { SymbolDialog } from "./symbol-dialog";
import { CombinationDialog } from "./combination-dialog";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { EcosystemHeader } from "@/components/layout/ecosystem";

export function MatchWinManager() {
  const {
    data: gameData,
    refetch: refetchData,
    loading: dataLoading,
  } = useGetMatchWinData();
  const {
    data: playsData,
    refetch: refetchPlays,
    loading: playsLoading,
  } = useGetMatchWinPlays({
    pagination: { page: 1, limit: 10 },
  });
  const { data: statsData, refetch: refetchStats } = useGetSpinScratchStats();
  const { data: rewardsData } = useGetRewards({
    status: "ACTIVE",
    pagination: { page: 1, limit: 100 },
  });
  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Tokens";

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
      setFestivalMode(config.festivalMode ?? false);
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

    // Client-side validation: if it is a winning combination, make sure all 3 symbols are selected!
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
    } catch (err) {
      toast.error("Failed to delete combination");
    }
  };

  const isMutating =
    savingConfig ||
    updatingSymbol ||
    upsertingCombination ||
    deletingCombination ||
    initializingConfig;

  if (dataLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-24 bg-muted rounded-xl" />
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 h-64 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center space-y-5">
        <div className="h-16 w-16 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <Trophy className="h-7 w-7 text-indigo-500" />
        </div>
        <div className="max-w-sm space-y-1.5">
          <h3 className="text-base font-semibold text-foreground">
            Initialize Match & Win
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Match & Win hasn&apos;t been set up yet. Initialize the system to
            configure symbols and reward combinations.
          </p>
        </div>
        <Button
          onClick={handleInitializeConfig}
          disabled={initializingConfig}
          className="gap-2"
        >
          {initializingConfig ? "Initializing..." : "Initialize System"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <EcosystemHeader
        title="Match & Win"
        badgeText="Engagement"
        description={`Configure the 3-column symbol matching game — set ${currencyName || "tokens"} costs, probabilities, rewards, and campaign windows.`}
        icon={Trophy}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Engagement Games", href: "/gamification/engagement-games" },
          { label: "Match & Win" },
        ]}
        actions={
          <EcosystemActionBar
            shadow="none"
            className="p-0 border-none bg-transparent"
          >
            <EcosystemActionBar.Group>
              <div
                className={cn(
                  "h-2 w-2 rounded-full animate-pulse",
                  isActive ? "bg-emerald-500" : "bg-amber-500",
                )}
              />
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                {isActive ? "Live" : "Paused"}
              </span>
              <EcosystemActionBar.Separator />
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {playsData?.getMatchWinPlays?.length ?? 0} recent plays
              </span>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>
        }
      />

      <EcosystemContainer className="p-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left col: 2/3 */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <SectionCard
                icon={Trophy}
                iconBg="bg-indigo-50"
                iconColor="text-indigo-600"
                title="System Status"
              >
                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {isActive ? "Active" : "Paused"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Match & Win availability
                    </p>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
              </SectionCard>

              <SectionCard
                icon={Coins}
                iconBg="bg-amber-50"
                iconColor="text-amber-600"
                title="Cost per Play (Coins)"
              >
                <Input
                  type="number"
                  min={1}
                  value={costPerPlay}
                  onChange={(e) => setCostPerPlay(Number(e.target.value))}
                  className="font-mono h-9"
                />
              </SectionCard>
            </div>

            <SectionCard
              icon={Clock}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
              title="Campaign Schedule"
              description="Daily limits and campaign window"
            >
              <div className="space-y-1.5 max-w-xs">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Daily Cap
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={maxPlaysPerDay}
                  onChange={(e) => setMaxPlaysPerDay(Number(e.target.value))}
                />
              </div>
            </SectionCard>

            <SectionCard
              icon={LayoutGrid}
              iconBg="bg-slate-50"
              iconColor="text-slate-600"
              title="Symbol Matrix"
              description="The 3 symbols used in the matching game"
            >
              <div className="p-1">
                <SymbolsTable symbols={dbSymbols} onEdit={handleEditSymbol} />
              </div>
            </SectionCard>

            <SectionCard
              icon={Trophy}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
              title="Reward Combinations"
              description="Winning symbol combinations and their rewards"
              action={
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
                  className="gap-1.5 h-7 text-xs"
                >
                  <Plus className="h-3 w-3" /> Add
                </Button>
              }
            >
              <div className="p-1">
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
              </div>
            </SectionCard>
          </div>

          {/* Right col: Preview + Economy */}
          <div className="space-y-5">
            <div className="sticky top-6 space-y-6">
              <EconomySidebar
                costPerPlay={costPerPlay}
                maxPlaysPerDay={maxPlaysPerDay}
                avgPayout={avgPayout}
                profitMargin={profitMargin}
                currencyName={currencyName}
              />
            </div>
          </div>
        </div>
      </EcosystemContainer>

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
        title="Unsaved Changes"
        description="You have modified the match win game configuration."
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingCombinationId}
        onOpenChange={(open) => !open && setDeletingCombinationId(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this combination? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingCombinationId(null)}
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
            >
              {deletingCombination ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
