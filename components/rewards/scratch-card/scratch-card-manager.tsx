"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  RectangleHorizontal, Plus, Trash2, Edit, Shield, TrendingUp, AlertTriangle,
  Clock, Save, Coins, Crown, Ticket, XCircle, Loader2, Info, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetScratchCardConfig, useGetScratchCardPrizes, useUpdateScratchCardConfig,
  useCreateScratchCardPrize, useUpdateScratchCardPrize, useDeleteScratchCardPrize,
  useGetScratchActivity,
} from "@/graphql/actions/rewards";
import moment from "moment";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

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

const REWARD_LABELS: Record<RewardType, string> = {
  tc: "TC Coins", voucher: "Voucher", premium: "Premium", none: "No Reward",
};

const REWARD_BADGE: Record<RewardType, string> = {
  tc: "bg-amber-50 text-amber-700 border border-amber-100",
  voucher: "bg-blue-50 text-blue-700 border border-blue-100",
  premium: "bg-violet-50 text-violet-700 border border-violet-100",
  none: "bg-muted text-muted-foreground border border-border",
};

const REWARD_ICON: Record<RewardType, React.ReactNode> = {
  tc: <Coins className="h-3 w-3" />,
  voucher: <Ticket className="h-3 w-3" />,
  premium: <Crown className="h-3 w-3" />,
  none: <XCircle className="h-3 w-3" />,
};

const SectionCard = ({ title, description, icon: Icon, iconBg, iconColor, children, action }: {
  title: string; description?: string; icon: any; iconBg: string; iconColor: string;
  children: React.ReactNode; action?: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
      <div className="flex items-center gap-3">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

export function ScratchCardManager() {
  const { data: configData, refetch: refetchConfig, loading: configLoading } = useGetScratchCardConfig();
  const { data: prizesData, refetch: refetchPrizes } = useGetScratchCardPrizes();
  const { data: activityData } = useGetScratchActivity({ pagination: { page: 1, limit: 10 } });
  const [updateConfig, { loading: savingConfig }] = useUpdateScratchCardConfig();
  const [createTier, { loading: creatingTier }] = useCreateScratchCardPrize();
  const [updateTier, { loading: updatingTier }] = useUpdateScratchCardPrize();
  const [deleteTier, { loading: deletingTier }] = useDeleteScratchCardPrize();

  const config = configData?.getScratchCardConfig;
  const [isEnabled, setIsEnabled] = useState(false);
  const [scratchCost, setScratchCost] = useState(0);
  const [maxCardsPerDay, setMaxCardsPerDay] = useState(0);
  const [campaignStartDate, setCampaignStartDate] = useState("");
  const [campaignEndDate, setCampaignEndDate] = useState("");
  const [festivalMode, setFestivalMode] = useState(false);
  const [tiers, setTiers] = useState<ScratchRewardTier[]>([]);
  const [editingTier, setEditingTier] = useState<ScratchRewardTier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (config && !initialized) {
      setIsEnabled(config.isActive ?? true);
      setScratchCost(config.costPerScratch ?? 15);
      setMaxCardsPerDay(config.maxScratchesPerDay ?? 5);
      setCampaignStartDate(config.campaignStartDate ? moment(config.campaignStartDate).format("YYYY-MM-DD") : "");
      setCampaignEndDate(config.campaignEndDate ? moment(config.campaignEndDate).format("YYYY-MM-DD") : "");
      setInitialized(true);
    }
  }, [config, initialized]);

  useEffect(() => {
    if (prizesData?.getScratchCardPrizes?.length > 0) {
      setTiers(prizesData.getScratchCardPrizes.map((p: any) => ({
        id: p.id, label: p.label,
        rewardType: (p.type || "tc").toLowerCase() as RewardType,
        rewardValue: p.value ?? 0,
        probability: Number(p.probability) || 0,
        cardColor: "#4F46E5",
        isActive: p.isActive !== false,
      })));
    }
  }, [prizesData]);

  const totalProbability = tiers.reduce((s, t) => s + t.probability, 0);
  const avgPayout = tiers.reduce((sum, t) =>
    t.rewardType === "tc" ? sum + (t.rewardValue * t.probability) / totalProbability : sum, 0);
  const profitMargin = scratchCost > 0 ? ((scratchCost - avgPayout) / scratchCost) * 100 : 0;
  const isHealthy = profitMargin >= 20 && profitMargin <= 40;

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
      toast.success("Scratch card configuration saved");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save configuration");
    }
  };

  const handleAddTier = () => {
    setEditingTier({ id: "", label: "", rewardType: "tc", rewardValue: 0, probability: 10, cardColor: "#4F46E5", isActive: true });
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

  const handleDeleteTier = async (id: string) => {
    try {
      await deleteTier({ variables: { id } });
      toast.success("Tier deleted");
      refetchPrizes();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete tier");
    }
  };

  const isMutating = savingConfig || creatingTier || updatingTier || deletingTier;

  return (
    <>
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className={cn("h-2 w-2 rounded-full animate-pulse", isEnabled ? "bg-emerald-500" : "bg-amber-500")} />
          <span className="text-xs font-medium text-muted-foreground">
            {isEnabled ? "Active" : "Paused"}
          </span>
          <EcosystemActionBar.Separator />
          <span className="text-xs text-muted-foreground">{tiers.length} reward tiers</span>
        </EcosystemActionBar.Group>
        <EcosystemActionBar.Group align="right">
          <Button variant="outline" size="sm" onClick={() => { refetchConfig(); refetchPrizes(); }} className="gap-2">
            Refresh
          </Button>
          <Button size="sm" onClick={handleSaveConfig} disabled={isMutating} className="gap-2 min-w-[140px]">
            {savingConfig ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Configuration
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: 2/3 */}
          <div className="lg:col-span-2 space-y-5">
            {/* Status & Cost */}
            <div className="grid grid-cols-2 gap-4">
              <SectionCard icon={RectangleHorizontal} iconBg="bg-blue-50" iconColor="text-blue-600" title="System Status">
                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{isEnabled ? "Active" : "Paused"}</p>
                    <p className="text-xs text-muted-foreground">Scratch card availability</p>
                  </div>
                  <Switch checked={isEnabled} onCheckedChange={setIsEnabled} className="data-[state=checked]:bg-emerald-500" />
                </div>
              </SectionCard>

              <SectionCard icon={Coins} iconBg="bg-amber-50" iconColor="text-amber-600" title="Scratch Cost (TC)">
                <Input
                  type="number"
                  value={scratchCost}
                  onChange={(e) => setScratchCost(Number(e.target.value))}
                  className="font-mono h-9"
                />
              </SectionCard>
            </div>

            {/* Schedule */}
            <SectionCard icon={Clock} iconBg="bg-indigo-50" iconColor="text-indigo-600" title="Campaign Schedule" description="Daily limits and active dates">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Daily Cap</Label>
                  <Input type="number" value={maxCardsPerDay} onChange={(e) => setMaxCardsPerDay(Number(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Start Date</Label>
                  <Input type="date" value={campaignStartDate} onChange={(e) => setCampaignStartDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">End Date</Label>
                  <Input type="date" value={campaignEndDate} onChange={(e) => setCampaignEndDate(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 p-3 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="text-sm font-semibold text-foreground">Festival Mode</p>
                  <p className="text-xs text-muted-foreground">Boost reward chances during special events</p>
                </div>
                <Switch checked={festivalMode} onCheckedChange={setFestivalMode} className="data-[state=checked]:bg-amber-500" />
              </div>
            </SectionCard>

            {/* Tiers Table */}
            <SectionCard
              icon={RectangleHorizontal} iconBg="bg-violet-50" iconColor="text-violet-600"
              title="Reward Tiers" description={`${tiers.length} tiers configured`}
              action={
                <Button size="sm" onClick={handleAddTier} disabled={tiers.length >= 12} className="gap-1.5 h-7 text-xs">
                  <Plus className="h-3 w-3" />
                  Add Tier
                </Button>
              }
            >
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="h-10 text-xs font-semibold w-[40px]">#</TableHead>
                      <TableHead className="h-10 text-xs font-semibold">Label</TableHead>
                      <TableHead className="h-10 text-xs font-semibold">Type</TableHead>
                      <TableHead className="h-10 text-xs font-semibold">Probability</TableHead>
                      <TableHead className="h-10 text-xs font-semibold text-center">Active</TableHead>
                      <TableHead className="h-10 text-xs font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tiers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-20 text-center text-sm text-muted-foreground">
                          No reward tiers yet. Add one to get started.
                        </TableCell>
                      </TableRow>
                    ) : tiers.map((tier, i) => (
                      <TableRow key={tier.id} className="group h-12">
                        <TableCell className="font-mono text-xs text-muted-foreground">{i + 1}</TableCell>
                        <TableCell className="font-medium text-foreground text-sm">{tier.label}</TableCell>
                        <TableCell>
                          <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 w-fit", REWARD_BADGE[tier.rewardType])}>
                            {REWARD_ICON[tier.rewardType]}
                            {REWARD_LABELS[tier.rewardType]}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(tier.probability / totalProbability) * 100}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">
                              {((tier.probability / totalProbability) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={tier.isActive !== false}
                            onCheckedChange={async (v) => {
                              try { await updateTier({ variables: { id: tier.id, input: { isActive: v } } }); toast.success("Updated"); refetchPrizes(); }
                              catch { toast.error("Update failed"); }
                            }}
                            className="scale-75"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => { setEditingTier({ ...tier }); setIsDialogOpen(true); }}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:text-rose-600" onClick={() => handleDeleteTier(tier.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>
          </div>

          {/* Right: 1/3 Preview + Economy Monitor */}
          <div className="space-y-5">
            <div className="sticky top-6 space-y-6">
              {/* Scratch Card Preview (Mobile Mockup) */}
              <div className="relative group mx-auto max-w-[340px]">
                {/* Glowing ambient background shadow */}
                <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-[36px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Mock Phone Frame */}
                <div className="relative flex flex-col w-full bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-zinc-200/50 dark:border-white/5 overflow-hidden text-zinc-900 dark:text-zinc-100 p-2">
                  <div className="flex-1 rounded-[24px] bg-indigo-950 overflow-hidden flex flex-col relative border border-indigo-900/50 shadow-inner">
                    
                    {/* Game Header */}
                    <div className="p-5 text-center relative z-10 space-y-1 bg-gradient-to-b from-indigo-900 to-transparent">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-2">
                        <Sparkles className="h-3 w-3 text-amber-400" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-200">Daily Scratch</span>
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Scratch & Win</h3>
                      <p className="text-[10px] text-indigo-300">Reveal hidden symbols for a chance to win.</p>
                    </div>

                    {/* Canvas / Scratch Area */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 min-h-[220px]">
                      {/* Subtle backglow */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/30 rounded-full blur-2xl" />
                      
                      {/* The Card */}
                      <div className="relative w-full aspect-[4/3] rounded-xl bg-zinc-300 dark:bg-zinc-800 border-2 border-dashed border-zinc-400 dark:border-zinc-600 flex items-center justify-center overflow-hidden group/card cursor-crosshair">
                        {/* Silver foil texture simulation */}
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-300 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-800 opacity-90" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-30 mix-blend-overlay" />
                        
                        <div className="relative flex flex-col items-center gap-2">
                          <Sparkles className="h-8 w-8 text-zinc-500 dark:text-zinc-400 group-hover/card:animate-pulse" />
                          <span className="text-xs font-black text-zinc-600 dark:text-zinc-300 tracking-widest uppercase">Scratch Here</span>
                        </div>
                      </div>
                    </div>

                    {/* Game Bottom Bar */}
                    <div className="p-6 relative z-10 mt-auto bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Live Preview</span>
                      </div>
                      <Button disabled className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] border-none">
                        Buy Card For {scratchCost} TC
                      </Button>
                      <p className="text-center text-[9px] text-indigo-400/70 mt-3 font-medium">
                        {maxCardsPerDay} Cards Remaining Today
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Economy Monitor */}
              <div className="rounded-[24px] border border-border bg-card p-5 max-w-[340px] mx-auto shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <Shield className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-none">Economy Monitor</h4>
                    <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">Health Check</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
                    <span className="text-xs font-semibold text-muted-foreground">Avg. Payout</span>
                    <span className="text-sm font-bold font-mono text-foreground">{avgPayout.toFixed(1)} <span className="text-[10px]">TC</span></span>
                  </div>
                  
                  <div className={cn(
                    "p-4 rounded-2xl border transition-colors",
                    isHealthy ? "bg-emerald-50/50 border-emerald-200" : "bg-rose-50/50 border-rose-200"
                  )}>
                    <div className="flex items-center justify-between mb-1">
                      <p className={cn("text-xs font-bold uppercase tracking-wider", isHealthy ? "text-emerald-600" : "text-rose-600")}>Profit Margin</p>
                      {isHealthy ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <AlertTriangle className="h-4 w-4 text-rose-500" />}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className={cn("text-3xl font-black font-mono tracking-tighter", isHealthy ? "text-emerald-700" : "text-rose-700")}>
                        {profitMargin.toFixed(1)}%
                      </p>
                    </div>
                    <p className={cn("text-[10px] font-bold mt-1 uppercase tracking-wider", isHealthy ? "text-emerald-600/70" : "text-rose-600/70")}>Target: 20–40%</p>
                  </div>

                  {!isHealthy && (
                    <div className="flex gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 items-start">
                      <Info className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] font-medium text-rose-700 leading-relaxed">
                        {profitMargin < 20 ? "Margin too low. Increase card cost or adjust probabilities to lower overall value." : "Margin too high. Game may feel unrewarding; consider better payouts."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </EcosystemContainer>

      {/* Tier Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTier?.id ? "Edit Tier" : "Add Reward Tier"}</DialogTitle>
            <DialogDescription>Configure the label, reward type, value, and probability for this tier.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Label</Label>
                <Input
                  placeholder="e.g. Gold Scratch"
                  value={editingTier?.label || ""}
                  onChange={(e) => setEditingTier((p) => p ? { ...p, label: e.target.value } : null)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Reward Type</Label>
                <Select value={editingTier?.rewardType} onValueChange={(v) => setEditingTier((p) => p ? { ...p, rewardType: v as RewardType } : null)}>
                  <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tc">TC Coins</SelectItem>
                    <SelectItem value="voucher">Voucher</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="none">No Reward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Reward Value</Label>
                <Input
                  type="number"
                  value={editingTier?.rewardValue || 0}
                  onChange={(e) => setEditingTier((p) => p ? { ...p, rewardValue: parseInt(e.target.value) || 0 } : null)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Probability Weight</Label>
                <Input
                  type="number"
                  value={editingTier?.probability || 0}
                  onChange={(e) => setEditingTier((p) => p ? { ...p, probability: parseInt(e.target.value) || 0 } : null)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTier} disabled={creatingTier || updatingTier} className="gap-2">
              {(creatingTier || updatingTier) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {editingTier?.id ? "Save Changes" : "Add Tier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
