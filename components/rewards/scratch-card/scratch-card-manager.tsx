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
  Clock, Save, Coins, Crown, Ticket, XCircle, Loader2, Info,
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

          {/* Right: 1/3 Economy Monitor */}
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-card overflow-hidden sticky top-6">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/20">
                <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Economy Monitor</p>
                  <p className="text-xs text-muted-foreground">Payout health check</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-xs text-muted-foreground">Avg. Payout</span>
                  <span className="text-sm font-bold font-mono text-foreground">{avgPayout.toFixed(1)} TC</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-xs text-muted-foreground">Scratch Cost</span>
                  <span className="text-sm font-bold font-mono text-foreground">{scratchCost} TC</span>
                </div>

                <div className={cn("p-4 rounded-xl border", isHealthy ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200")}>
                  <div className="flex items-center justify-between">
                    <p className={cn("text-xs font-semibold", isHealthy ? "text-emerald-700" : "text-rose-700")}>Margin</p>
                    {isHealthy ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <AlertTriangle className="h-4 w-4 text-rose-500" />}
                  </div>
                  <p className={cn("text-2xl font-bold font-mono mt-1", isHealthy ? "text-emerald-700" : "text-rose-700")}>
                    {profitMargin.toFixed(1)}%
                  </p>
                  <p className={cn("text-xs mt-1", isHealthy ? "text-emerald-600/70" : "text-rose-600/70")}>
                    Target: 20%–40%
                  </p>
                </div>

                {!isHealthy && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-100">
                    <Info className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-700 leading-relaxed">
                      Margin is outside the healthy range. Adjust scratch cost or tier probabilities.
                    </p>
                  </div>
                )}
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
