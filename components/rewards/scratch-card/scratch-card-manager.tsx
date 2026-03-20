"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  RectangleHorizontal,
  Plus,
  Trash2,
  Edit,
  Shield,
  TrendingUp,
  AlertTriangle,
  CircleDollarSign,
  Clock,
  Save,
  Eye,
  RotateCcw,
  Coins,
  Crown,
  Ticket,
  XCircle,
  Users,
  Zap,
  Palette,
  Loader2,
  Trophy,
} from "lucide-react";
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
} from "@/graphql/actions/rewards";
import moment from "moment";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

// ─── Types ───────────────────────────────────────────
type RewardType = "tc" | "voucher" | "premium" | "none";

interface ScratchRewardTier {
  id: string;
  label: string;
  rewardType: RewardType;
  rewardValue: number;
  probability: number;
  cardColor: string;
  isActive?: boolean;
}

// ─── Constants ───────────────────────────────────────
const CARD_COLORS = [
  "#7c3aed",
  "#2563eb",
  "#059669",
  "#d97706",
  "#dc2626",
  "#0891b2",
];

// ─── Helpers ─────────────────────────────────────────
const rewardTypeLabel = (t: RewardType) => {
  switch (t) {
    case "tc":
      return "TC Coins";
    case "voucher":
      return "Voucher";
    case "premium":
      return "Premium";
    case "none":
      return "No Reward";
  }
};

const rewardTypeIcon = (t: RewardType) => {
  switch (t) {
    case "tc":
      return <Coins className="h-3.5 w-3.5" />;
    case "voucher":
      return <Ticket className="h-3.5 w-3.5" />;
    case "premium":
      return <Crown className="h-3.5 w-3.5" />;
    case "none":
      return <XCircle className="h-3.5 w-3.5" />;
  }
};

const rewardTypeBadge = (t: RewardType) => {
  const styles: Record<RewardType, string> = {
    tc: "text-amber-700 bg-amber-50 border-amber-200",
    voucher: "text-blue-700 bg-blue-50 border-blue-200",
    premium: "text-purple-700 bg-purple-50 border-purple-200",
    none: "text-gray-600 bg-gray-50 border-gray-200",
  };
  return styles[t];
};

// ─── Card Preview ────────────────────────────────────
function ScratchCardPreview({ tiers }: { tiers: ScratchRewardTier[] }) {
  const topTiers = tiers
    .filter((t) => t.rewardType !== "none")
    .sort((a, b) => b.rewardValue - a.rewardValue)
    .slice(0, 3);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-[220px] h-[140px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group">
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic animate-pulse">
               Revealing...
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${tiers[0]?.cardColor || "#4f46e5"} 0%, ${tiers[1]?.cardColor || "#7c3aed"} 100%)`,
          }}
        >
          <div className="text-center text-white/90">
            <RectangleHorizontal className="h-8 w-8 mx-auto mb-2 opacity-80" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">
               Manifest Logic
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────
export function ScratchCardManager() {
  // ── GraphQL hooks ──
  const { data: configData, refetch: refetchConfig, loading: configLoading } = useGetScratchCardConfig();
  const { data: prizesData, refetch: refetchPrizes, loading: prizesLoading } = useGetScratchCardPrizes();
  const { data: activityData, loading: activityLoading } = useGetScratchActivity({
      pagination: { page: 1, limit: 10 },
    });
  const [updateConfig, { loading: savingConfig }] = useUpdateScratchCardConfig();
  const [createTier, { loading: creatingTier }] = useCreateScratchCardPrize();
  const [updateTier, { loading: updatingTier }] = useUpdateScratchCardPrize();
  const [deleteTier, { loading: deletingTier }] = useDeleteScratchCardPrize();

  // ── Local state ──
  const config = configData?.getScratchCardConfig;
  const [isEnabled, setIsEnabled] = useState(false);
  const [scratchCost, setScratchCost] = useState(0);
  const [maxCardsPerDay, setMaxCardsPerDay] = useState(0);
  const [campaignStartDate, setCampaignStartDate] = useState<string>("");
  const [campaignEndDate, setCampaignEndDate] = useState<string>("");
  const [festivalMode, setFestivalMode] = useState(false);
  const [tiers, setTiers] = useState<ScratchRewardTier[]>([]);
  const [editingTier, setEditingTier] = useState<ScratchRewardTier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Sync from API
  useEffect(() => {
    if (config && !initialized) {
      setIsEnabled(config.isActive ?? true);
      setScratchCost(config.costPerScratch ?? 15);
      setMaxCardsPerDay(config.maxScratchesPerDay ?? 5);
      setCampaignStartDate(
        config.campaignStartDate ? moment(config.campaignStartDate).format("YYYY-MM-DD") : "",
      );
      setCampaignEndDate(
        config.campaignEndDate ? moment(config.campaignEndDate).format("YYYY-MM-DD") : "",
      );
      setFestivalMode(false);
      setInitialized(true);
    }
  }, [config, initialized]);

  useEffect(() => {
    if (prizesData?.getScratchCardPrizes?.length > 0) {
      setTiers(
        prizesData.getScratchCardPrizes.map((p: any) => ({
          id: p.id,
          label: p.label,
          rewardType: (p.type || "tc").toLowerCase() as RewardType,
          rewardValue: p.value ?? 0,
          probability: Number(p.probability) || 0,
          cardColor: "#4F46E5",
          isActive: p.isActive !== false,
        })),
      );
    }
  }, [prizesData]);

  const activities = activityData?.getScratchCardPlays || [];

  // ── Economy calculations ──
  const totalProbability = tiers.reduce((s, t) => s + t.probability, 0);
  const avgPayout = tiers.reduce((sum, t) => {
    if (t.rewardType === "tc") {
      return sum + (t.rewardValue * t.probability) / totalProbability;
    }
    return sum;
  }, 0);
  const profitMargin =
    scratchCost > 0 ? ((scratchCost - avgPayout) / scratchCost) * 100 : 0;
  const isHealthy = profitMargin >= 20 && profitMargin <= 40;

  // ── Save config ──
  const handleSaveConfig = async () => {
    try {
      await updateConfig({
        variables: {
          input: {
            isActive: isEnabled,
            costPerScratch: scratchCost,
            maxScratchesPerDay: maxCardsPerDay,
            campaignStartDate: campaignStartDate || null,
            campaignEndDate: campaignEndDate || null,
          },
        },
      });
      toast.success("Scratch card configuration saved!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save configuration");
    }
  };

  // ── Tier CRUD ──
  const handleAddTier = () => {
    setEditingTier({
      id: "",
      label: "",
      rewardType: "tc",
      rewardValue: 0,
      probability: 10,
      cardColor: CARD_COLORS[tiers.length % CARD_COLORS.length],
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditTier = (tier: ScratchRewardTier) => {
    setEditingTier({ ...tier });
    setIsDialogOpen(true);
  };

  const handleSaveTier = async () => {
    if (!editingTier) return;
    const input = {
      label: editingTier.label,
      type: editingTier.rewardType.toUpperCase(),
      value: editingTier.rewardValue,
      probability: editingTier.probability,
    };
    try {
      if (editingTier.id) {
        await updateTier({ variables: { id: editingTier.id, input } });
        toast.success("Tier updated!");
      } else {
        await createTier({ variables: { input } });
        toast.success("Tier added!");
      }
      setIsDialogOpen(false);
      setEditingTier(null);
      refetchPrizes();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save tier");
    }
  };

  const handleDeleteTier = async (id: string) => {
    try {
      await deleteTier({ variables: { id } });
      toast.success("Tier deleted!");
      refetchPrizes();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete tier");
    }
  };

  const isMutating =
    savingConfig || creatingTier || updatingTier || deletingTier;

  return (
    <EcosystemWrapper anonymized-1="scratch-card-config">
       <EcosystemHeader
        title="Artifact Scratchers"
        badgeText="Core Engagement"
        description="Maintain treasure vault integrity by configuring scratch card probability maps and token consumption rates."
        icon={RectangleHorizontal}
      />

      <EcosystemActionBar shadow="none">
         <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                   <div className={cn(
                      "h-3 w-3 rounded-full animate-pulse",
                      isEnabled ? "bg-emerald-500" : "bg-amber-500"
                   )} />
                   <span className="text-sm font-bold text-slate-500">Flux {isEnabled ? "Active" : "Static"}</span>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                   <Zap className="h-4 w-4 text-amber-500" />
                   <span>Festival Mode: {festivalMode ? "ENERGIZED" : "STABLE"}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
               <Button
                  variant="outline"
                  onClick={() => {
                    refetchConfig();
                    refetchPrizes();
                  }}
                  className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-slate-50 transition-all"
               >
                  <RotateCcw className={cn("h-4 w-4", configLoading && "animate-spin")} />
                  Refresh
               </Button>
               <Button
                  onClick={handleSaveConfig}
                  disabled={isMutating}
                  className="h-10 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-wider gap-3 shadow-xl shadow-slate-200 transition-all active:scale-95 group"
               >
                  {savingConfig ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />}
                  Deploy Configuration
               </Button>
            </div>
         </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Left Column: Config */}
           <div className="lg:col-span-8 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Status Toggle */}
                 <div className="p-8 rounded-[2.5rem] bg-slate-900 flex items-center justify-between group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-1000">
                       <Zap className="h-24 w-24 text-white" />
                    </div>
                    <div className="space-y-1 relative z-10">
                       <h3 className="text-xl font-black text-white tracking-tight italic uppercase">System Status</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{isEnabled ? "Ingestion online" : "Ingestion offline"}</p>
                    </div>
                    <Switch checked={isEnabled} onCheckedChange={setIsEnabled} className="data-[state=checked]:bg-white scale-125 relative z-10" />
                 </div>

                 {/* Cost Structure */}
                 <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-4">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Acquisition Cost (TC)</Label>
                    <div className="relative">
                       <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
                       <Input 
                          type="number" 
                          value={scratchCost} 
                          onChange={(e) => setScratchCost(Number(e.target.value))}
                          className="pl-12 h-14 rounded-2xl border-slate-200 font-extrabold text-slate-900 text-xl focus:ring-amber-500/10 transition-all"
                       />
                    </div>
                 </div>
              </div>

              {/* Operational parameters */}
              <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-8">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                       <Clock className="h-5 w-5" />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-slate-900 tracking-tight italic">Operational Constants</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Daily limits & active windows</p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                       <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Daily Cap</Label>
                       <Input 
                          type="number" 
                          value={maxCardsPerDay} 
                          onChange={(e) => setMaxCardsPerDay(Number(e.target.value))}
                          className="h-12 rounded-xl border-slate-200 font-bold text-slate-900"
                       />
                    </div>
                    <div className="space-y-4">
                       <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Festival Shift</Label>
                       <div className="flex items-center h-12">
                          <Switch checked={festivalMode} onCheckedChange={setFestivalMode} className="data-[state=checked]:bg-amber-500" />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Start Date</Label>
                       <Input 
                          type="date" 
                          value={campaignStartDate}
                          onChange={(e) => setCampaignStartDate(e.target.value)}
                          className="h-12 rounded-xl border-slate-200 font-bold text-slate-900"
                       />
                    </div>
                    <div className="space-y-4">
                       <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">End Date</Label>
                       <Input 
                          type="date" 
                          value={campaignEndDate}
                          onChange={(e) => setCampaignEndDate(e.target.value)}
                          className="h-12 rounded-xl border-slate-200 font-bold text-slate-900"
                       />
                    </div>
                 </div>
              </div>

              {/* Reward Library */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                          <Palette className="h-5 w-5 text-slate-700" />
                       </div>
                       <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Reward Protocol</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{tiers.length} tiers in manifestation</p>
                       </div>
                    </div>
                    <Button
                      onClick={handleAddTier}
                      disabled={tiers.length >= 12}
                      className="rounded-xl h-10 px-6 bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-wider gap-2 shadow-lg shadow-slate-200"
                    >
                      <Plus className="h-4 w-4" />
                      Append Tier
                    </Button>
                 </div>

                 <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-sm overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-slate-50 bg-slate-50/50">
                          <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-14 pl-8">ID</TableHead>
                          <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-14">Identity</TableHead>
                          <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-14">Yield</TableHead>
                          <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-14">Weight</TableHead>
                          <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-14 text-center">Status</TableHead>
                          <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-14 text-right pr-8">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tiers.map((tier, i) => (
                          <TableRow key={tier.id} className="group hover:bg-slate-50/60 transition-colors border-b border-slate-50">
                            <TableCell className="font-mono text-xs text-slate-300 pl-8">{i + 1}</TableCell>
                            <TableCell className="font-bold text-slate-900">{tier.label}</TableCell>
                            <TableCell>
                               <Badge variant="outline" className={cn("rounded-lg font-black text-[10px] uppercase tracking-tighter gap-1.5", rewardTypeBadge(tier.rewardType))}>
                                  {rewardTypeIcon(tier.rewardType)}
                                  {rewardTypeLabel(tier.rewardType)}
                               </Badge>
                            </TableCell>
                            <TableCell>
                               <div className="flex items-center gap-3">
                                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[60px]">
                                     <div className="h-full bg-slate-900 rounded-full" style={{ width: `${(tier.probability / totalProbability) * 100}%` }} />
                                  </div>
                                  <span className="text-[10px] font-black text-slate-400">
                                     {((tier.probability / totalProbability) * 100).toFixed(1)}%
                                  </span>
                               </div>
                            </TableCell>
                            <TableCell className="text-center">
                               <Switch 
                                  checked={tier.isActive !== false} 
                                  onCheckedChange={async (v) => {
                                      try {
                                        await updateTier({ variables: { id: tier.id, input: { isActive: v } } });
                                        toast.success("Tier updated");
                                        refetchPrizes();
                                      } catch (e) { toast.error("Update failed"); }
                                  }}
                                  className="scale-75"
                               />
                            </TableCell>
                            <TableCell className="text-right pr-8">
                               <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                  <Button variant="ghost" size="icon" onClick={() => handleEditTier(tier)} className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-indigo-600">
                                     <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTier(tier.id)} className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-rose-600">
                                     <Trash2 className="h-4 w-4" />
                                  </Button>
                               </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </div>
              </div>
           </div>

           {/* Right Column: Invariants */}
           <div className="lg:col-span-4 space-y-10">
              <div className="sticky top-10 space-y-10">
                 {/* Visualizer */}
                 <div className="p-12 rounded-[3.5rem] bg-indigo-600 shadow-2xl shadow-indigo-200 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000">
                       <Trophy className="h-40 w-40 text-white" />
                    </div>
                    <div className="relative z-10 space-y-8 text-center">
                       <div>
                          <h4 className="text-white font-black italic tracking-tight text-xl uppercase">Manifestation Invariant</h4>
                          <p className="text-[10px] font-bold text-indigo-100/60 uppercase tracking-widest mt-1">Simulated frontend core</p>
                       </div>
                       <ScratchCardPreview tiers={tiers} />
                       <div className="p-4 rounded-2xl bg-indigo-500/30 backdrop-blur-sm border border-indigo-400/30 text-[10px] font-bold text-white uppercase tracking-tighter leading-relaxed">
                          Scratcher reflects current tier 0-1 aesthetics. Probability weights are computed server-side.
                       </div>
                    </div>
                 </div>

                 {/* Economy Monitor */}
                 <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-orange-600" />
                       </div>
                       <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Economy Node</h3>
                    </div>

                    <div className="space-y-4 pt-4">
                       <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Payout</span>
                          <span className="font-black text-slate-900">{avgPayout.toFixed(1)} TC</span>
                       </div>
                       <div className={cn(
                          "flex items-center justify-between p-8 rounded-[2rem] border transition-all duration-500",
                          isHealthy ? "bg-emerald-50 border-emerald-100 scale-100 shadow-lg shadow-emerald-500/10" : "bg-rose-50 border-rose-100 scale-[0.98]"
                       )}>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Revenue Gap</p>
                             <h4 className={cn("text-4xl font-black tracking-tighter", isHealthy ? "text-emerald-600" : "text-rose-600")}>
                                {profitMargin.toFixed(1)}%
                             </h4>
                          </div>
                          {isHealthy ? <TrendingUp className="h-10 w-10 text-emerald-500 opacity-20" /> : <AlertTriangle className="h-10 w-10 text-rose-500 opacity-20" />}
                       </div>
                    </div>

                    {!isHealthy && (
                       <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100/50 text-[10px] font-black text-rose-600 leading-relaxed uppercase tracking-widest italic text-center">
                          ⚠️ Warning: Economy state is volatile. Adjust acquisition cost immediately.
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </EcosystemContainer>

      {/* Tier Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
            <div className="bg-indigo-600 p-8 text-white relative">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Palette className="h-20 w-20" />
               </div>
               <DialogHeader>
                  <DialogTitle className="text-2xl font-black italic tracking-tight uppercase">Tier Specification</DialogTitle>
                  <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest mt-1">Definition of a scratch invariant yield</DialogDescription>
               </DialogHeader>
            </div>

            <div className="p-10 space-y-8">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Internal Alias</Label>
                     <Input 
                        value={editingTier?.label} 
                        onChange={e => setEditingTier(prev => prev ? {...prev, label: e.target.value} : null)} 
                        className="h-12 rounded-xl border-slate-200 font-bold"
                     />
                  </div>
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Reward Type</Label>
                     <Select 
                        value={editingTier?.rewardType} 
                        onValueChange={v => setEditingTier(prev => prev ? {...prev, rewardType: v as RewardType} : null)}
                     >
                        <SelectTrigger className="h-12 rounded-xl border-slate-200 font-bold">
                           <SelectValue placeholder="Inbound asset..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                           <SelectItem value="tc" className="font-bold">TC UNITS</SelectItem>
                           <SelectItem value="voucher" className="font-bold">EXTERNAL VOUCHER</SelectItem>
                           <SelectItem value="premium" className="font-bold">LEVEL ACCESS</SelectItem>
                           <SelectItem value="none" className="font-bold">EMPTY YIELD</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Yield Value</Label>
                     <Input 
                        type="number" 
                        value={editingTier?.rewardValue} 
                        onChange={e => setEditingTier(prev => prev ? {...prev, rewardValue: parseInt(e.target.value) || 0} : null)}
                        className="h-12 rounded-xl border-slate-200 font-bold"
                     />
                  </div>
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Manifest Probability</Label>
                     <Input 
                        type="number" 
                        value={editingTier?.probability} 
                        onChange={e => setEditingTier(prev => prev ? {...prev, probability: parseInt(e.target.value) || 0} : null)}
                        className="h-12 rounded-xl border-slate-200 font-black text-indigo-600"
                     />
                  </div>
               </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
               <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold h-11 px-6">Abort</Button>
               <Button 
                  onClick={handleSaveTier} 
                  disabled={creatingTier || updatingTier}
                  className="rounded-xl font-black h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-100 transition-all active:scale-95"
               >
                  Commit Specification
               </Button>
            </div>
         </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
