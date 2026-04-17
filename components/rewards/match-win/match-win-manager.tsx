"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Dices, Gift, RefreshCw, Trophy, Shield, TrendingUp, AlertTriangle, Settings, LayoutGrid, Activity, History, Save, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { uniqueId } from "lodash";

import { MatchWinCombination, MatchWinSymbol } from "./types";
import { MatchWinStats } from "./match-win-stats";
import { MatchWinActivityLog } from "./match-win-activity-log";
import { SymbolsTable, CombinationsTable } from "./config-tables";
import { EconomySidebar } from "./economy-sidebar";
import { SymbolDialog } from "./symbol-dialog";
import { CombinationDialog } from "./combination-dialog";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";

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
  const [festivalMode, setFestivalMode] = useState(false);

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

  const hasChanged = React.useMemo(() => {
    if (!config) return false;
    return (
      isActive !== (config.isActive ?? false) ||
      costPerPlay !== (config.costPerPlay ?? 25) ||
      maxPlaysPerDay !== (config.maxPlaysPerDay ?? 3) ||
      festivalMode !== (config.festivalMode ?? false)
    );
  }, [config, isActive, costPerPlay, maxPlaysPerDay, festivalMode]);

  // Sync from API
  useEffect(() => {
    if (config && !initialized) {
      setIsActive(config.isActive ?? false);
      setCostPerPlay(config.costPerPlay ?? 25);
      setMaxPlaysPerDay(config.maxPlaysPerDay ?? 3);
      setFestivalMode(config.festivalMode ?? false);
      setInitialized(true);
    }
  }, [config, initialized]);

  // Economy calculation
  const totalProbability = dbCombinations.reduce(
    (s: number, comb: any) => s + (Number(comb.probability) || 0),
    0,
  );

  const avgPayout = dbCombinations.reduce((sum: number, comb: any) => {
    if (comb.type === "TC") {
      return sum + comb.value * (Number(comb.probability) || 0);
    }
    return sum;
  }, 0);

  const profitMargin =
    costPerPlay > 0 ? ((costPerPlay - avgPayout) / costPerPlay) * 100 : 0;

  const handleSaveConfig = async () => {
    if (totalProbability > 1) {
      toast.error("Total probability cannot exceed 1.0 (100%)");
      return;
    }
    const initialSymbols = {
      s1: { label: "Star", icon: "star", color: "#FBBF24", key: uniqueId() },
      s2: { label: "Coin", icon: "coins", color: "#2d1889ff", key: uniqueId() },
      s3: { label: "Gift", icon: "gift", color: "#fb24dbff", key: uniqueId() },
    };
    const symbolsToSave =
      dbSymbols.length > 0
        ? dbSymbols.map(({ __typename, ...s }: any) => s)
        : Object.values(initialSymbols);

    try {
      await updateConfig({
        variables: {
          input: {
            costPerPlay,
            maxPlaysPerDay,
            isActive,
            festivalMode,
            settings: {
              symbols: symbolsToSave,
              prizes: dbCombinations.map(({ __typename, ...c }: any) => c),
            },
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
          key: editingSymbol.key,
          input: {
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
    try {
      await upsertCombination({
        variables: {
          configId: config.id,
          input: {
            key: editingCombination.key,
            type: editingCombination.type,
            value: Number(editingCombination.value),
            probability: Number(editingCombination.probability),
            maxWins: Number(editingCombination.maxWins),
            rewardId: editingCombination.rewardId || null,
            symbol1Id: editingCombination.symbol1Id || null,
            symbol2Id: editingCombination.symbol2Id || null,
            symbol3Id: editingCombination.symbol3Id || null,
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
    if (!confirm("Are you sure?")) return;
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
          <h3 className="text-base font-semibold text-foreground">Initialize Match & Win</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Match & Win hasn&apos;t been set up yet. Initialize the system to configure symbols and reward combinations.
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
    <div className="space-y-0">
      <div className="px-6 pt-6">
        <MatchWinStats statsData={statsData} />
      </div>

      <Tabs defaultValue="config" className="w-full">
        <div className="flex items-center justify-between px-6 py-3 border-b border-border">
          <TabsList className="h-8 bg-muted/40 border border-border rounded-lg p-0.5 gap-0.5">
            <TabsTrigger
              value="config"
              className="h-7 px-4 rounded-md text-xs font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground"
            >
              <Settings className="h-3 w-3" />
              Configuration
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="h-7 px-4 rounded-md text-xs font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground"
            >
              <History className="h-3 w-3" />
              Activity Log
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { refetchData(); refetchPlays(); refetchStats(); }}
              className="gap-1.5"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", (isMutating || dataLoading || playsLoading) && "animate-spin")} />
              Refresh Data
            </Button>
          </div>
        </div>

        <TabsContent value="config" className="m-0 focus-visible:outline-hidden">
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left: 2/3 */}
              <div className="lg:col-span-2 space-y-5">
                {/* Status Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", isActive ? "bg-emerald-50" : "bg-muted")}>
                      <Activity className={cn("h-4 w-4", isActive ? "text-emerald-600" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{isActive ? "Active" : "Paused"}</p>
                      <p className="text-xs text-muted-foreground">{isActive ? "Match & Win is live" : "Match & Win is paused"}</p>
                    </div>
                  </div>
                  <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-emerald-500" />
                </div>

                {/* Symbols */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/20">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <LayoutGrid className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Symbol Matrix</p>
                      <p className="text-xs text-muted-foreground">The 3 symbols used in the matching game</p>
                    </div>
                  </div>
                  <div className="p-1">
                    <SymbolsTable symbols={dbSymbols} onEdit={handleEditSymbol} />
                  </div>
                </div>

                {/* Combinations */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Reward Combinations</p>
                        <p className="text-xs text-muted-foreground">Winning symbol combinations and their rewards</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1.5 h-7 text-xs"
                      onClick={() => { setEditingCombination({ key: "", type: "TC", value: 0, probability: 0.1, maxWins: 0 }); setIsCombinationDialogOpen(true); }}
                    >
                      <Plus className="h-3 w-3" /> Add
                    </Button>
                  </div>
                  <div className="p-1">
                    <CombinationsTable
                      combinations={dbCombinations}
                      totalProbability={totalProbability}
                      onEdit={(c) => { setEditingCombination(c); setIsCombinationDialogOpen(true); }}
                      onDelete={handleDeleteCombination}
                      onAdd={() => { setEditingCombination({ key: "", type: "TC", value: 0, probability: 0.1, maxWins: 0 }); setIsCombinationDialogOpen(true); }}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Economy Sidebar */}
              <div className="sticky top-6">
                <EconomySidebar
                  costPerPlay={costPerPlay}
                  setCostPerPlay={setCostPerPlay}
                  maxPlaysPerDay={maxPlaysPerDay}
                  setMaxPlaysPerDay={setMaxPlaysPerDay}
                  festivalMode={festivalMode}
                  setFestivalMode={setFestivalMode}
                  avgPayout={avgPayout}
                  profitMargin={profitMargin}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <MatchWinActivityLog playsData={playsData} />
        </TabsContent>
      </Tabs>

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
    </div>
  );
}
