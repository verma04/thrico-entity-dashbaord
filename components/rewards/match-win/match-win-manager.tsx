"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Dices, Gift, RefreshCw, Trophy, Shield, TrendingUp, AlertTriangle, Settings, LayoutGrid, Activity, History } from "lucide-react";
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
    } catch (err: any) {
      toast.error(err?.message || "Failed to save configuration");
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
      <div className="p-10 space-y-8 animate-pulse">
        <div className="h-40 bg-slate-100 rounded-[3rem]" />
        <div className="grid grid-cols-3 gap-8">
           <div className="col-span-2 h-96 bg-slate-100 rounded-[3rem]" />
           <div className="h-96 bg-slate-100 rounded-[3rem]" />
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-8">
        <div className="h-24 w-24 bg-indigo-50 rounded-[3rem] flex items-center justify-center border-2 border-indigo-100 border-dashed">
          <Trophy className="h-10 w-10 text-indigo-600" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-2xl font-black italic text-slate-900 tracking-tight uppercase">Initialize System</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
            The manifestation array requires initial seeding. Prepare the invariant matrix to proceed.
          </p>
        </div>
        <Button
          size="lg"
          onClick={handleInitializeConfig}
          disabled={initializingConfig}
          className="h-14 px-12 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-indigo-200 transition-all border-none"
        >
          {initializingConfig ? "Priming Matrix..." : "Seed System Matrix"}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      {/* Stats Board */}
      <MatchWinStats statsData={statsData} />

      <Tabs defaultValue="config" className="w-full space-y-10">
        <div className="flex items-center justify-between">
           <TabsList className="bg-slate-50 p-1.5 rounded-2xl border border-slate-200/50 flex items-center gap-1">
              <TabsTrigger 
                value="config" 
                className="rounded-xl px-6 py-2.5 font-black text-[10px] uppercase tracking-wider gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg shadow-slate-200 transition-all"
              >
                <Settings className="h-3.5 w-3.5" />
                Invariants
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="rounded-xl px-6 py-2.5 font-black text-[10px] uppercase tracking-wider gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg shadow-slate-200 transition-all"
              >
                <History className="h-3.5 w-3.5" />
                Ledger
              </TabsTrigger>
           </TabsList>
           
           <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => { refetchData(); refetchPlays(); refetchStats(); }}
                className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-slate-50 transition-all"
              >
                <RefreshCw className={cn("h-4 w-4", (isMutating || dataLoading || playsLoading) && "animate-spin")} />
                Refresh
              </Button>
              <Button 
                onClick={handleSaveConfig} 
                disabled={isMutating}
                className="h-10 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-wider gap-3 shadow-xl shadow-slate-200 transition-all active:scale-95 group"
              >
                {savingConfig ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="h-4 w-4 transition-transform group-hover:-translate-y-1" />}
                Commit Map
              </Button>
           </div>
        </div>

        <TabsContent value="config" className="m-0 focus-visible:outline-hidden space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             <div className="lg:col-span-8 space-y-10">
                {/* Protocol Toggle */}
                <div className="p-8 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100/50 flex items-center justify-between group hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                   <div className="flex items-center gap-6">
                      <div className={cn(
                        "h-12 w-12 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-lg",
                        isActive ? "bg-emerald-500 shadow-emerald-200" : "bg-slate-200 shadow-slate-100"
                      )}>
                         <Activity className={cn("h-6 w-6 text-white", isActive && "animate-pulse")} />
                      </div>
                      <div className="space-y-1">
                         <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Flux State</h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isActive ? "System live in production" : "System locked for maintenance"}</p>
                      </div>
                   </div>
                   <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-emerald-500 scale-125 transition-all" />
                </div>

                {/* Symbols Table Section */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 px-1">
                      <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                         <LayoutGrid className="h-5 w-5" />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Symbol Matrix</h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Foundational invariants</p>
                      </div>
                   </div>
                   <SymbolsTable symbols={dbSymbols} onEdit={handleEditSymbol} />
                </div>

                {/* Combinations Table Section */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                            <Trophy className="h-5 w-5" />
                         </div>
                         <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Yield Combinations</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Manifestation probability paths</p>
                         </div>
                      </div>
                      <Button 
                         onClick={() => { setEditingCombination({ key: "", type: "TC", value: 0, probability: 0.1, maxWins: 0 }); setIsCombinationDialogOpen(true); }}
                         className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-wider gap-3 shadow-xl transition-all active:scale-95"
                      >
                         <Plus className="h-4 w-4" />
                         Append Combination
                      </Button>
                   </div>
                   <CombinationsTable
                      combinations={dbCombinations}
                      totalProbability={totalProbability}
                      onEdit={(c) => { setEditingCombination(c); setIsCombinationDialogOpen(true); }}
                      onDelete={handleDeleteCombination}
                      onAdd={() => { setEditingCombination({ key: "", type: "TC", value: 0, probability: 0.1, maxWins: 0 }); setIsCombinationDialogOpen(true); }}
                   />
                </div>
             </div>

             {/* Right Sidebar: Economy */}
             <div className="lg:col-span-4 space-y-10">
                <div className="sticky top-10 space-y-10">
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
                   
                   {/* Security/Rule Card */}
                   <div className="p-10 rounded-[3rem] bg-slate-900 shadow-2xl shadow-indigo-900/10 border border-white/5 space-y-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-[2000ms]">
                         <Shield className="h-32 w-32" />
                      </div>
                      <div className="relative z-10 space-y-6">
                         <div className="flex items-center gap-3">
                            <Shield className="h-6 w-6 text-indigo-400" />
                            <h4 className="text-white font-black italic tracking-tight text-xl uppercase">Economy Guard</h4>
                         </div>
                         <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                               <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5" />
                               <p className="text-[11px] font-extrabold text-slate-400 uppercase leading-relaxed tracking-tight">
                                  TOTAL PROBABILITY MUST REMAIN AT 1.0 (100%) FOR STABLE MANIFESTATION.
                               </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                               <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5" />
                               <p className="text-[11px] font-extrabold text-slate-400 uppercase leading-relaxed tracking-tight">
                                  EXPECTED VALUE (EV) SHOULD NOT EXCEED ACQUISITION COST.
                                </p>
                            </div>
                         </div>
                      </div>
                   </div>
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
    </div>
  );
}
