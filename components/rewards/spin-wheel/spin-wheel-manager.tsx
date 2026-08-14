"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Dices,
  Plus,
  Trash2,
  Edit,
  Coins,
  Ticket,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetSpinWheelConfig,
  useGetSpinWheelPrizes,
  useUpdateSpinWheelConfig,
  useCreateSpinWheelPrize,
  useUpdateSpinWheelPrize,
  useDeleteSpinWheelPrize,
  useGetSpinActivity,
  useLazyGetVouchersByRewardMechanism,
} from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisPresetChips,
  PolarisTipCard,
  PolarisInfoBanner,
} from "@/components/gamification/shared/polaris-form-ui";

import { WheelSegment } from "./types";
import {
  SEGMENT_COLORS,
  REWARD_LABELS,
  REWARD_BADGE,
  REWARD_ICON,
} from "./constants";
import { EconomyMonitor } from "./economy-monitor";
import { GamePreviewMockup } from "./game-preview-mockup";
import { SegmentDialog } from "./segment-dialog";
import { EcosystemHeader } from "@/components/layout/ecosystem";

const COST_PRESETS = [5, 10, 20, 50, 100];

export function SpinWheelManager() {
  const {
    data: configData,
    loading: configLoading,
  } = useGetSpinWheelConfig();
  const { data: prizesData, refetch: refetchPrizes } = useGetSpinWheelPrizes();
  const { data: activityData } = useGetSpinActivity({
    pagination: { page: 1, limit: 10 },
  });
  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";

  const config = configData?.getSpinWheelConfig;
  const [isActive, setIsActive] = useState(false);
  const [costPerSpin, setCostPerSpin] = useState(20);
  const [maxSpinsPerDay, setMaxSpinsPerDay] = useState(3);
  const [campaignStartDate, setCampaignStartDate] = useState<string | null>(
    null,
  );
  const [campaignEndDate, setCampaignEndDate] = useState<string | null>(null);
  const [segments, setSegments] = useState<WheelSegment[]>([]);
  const [editingSegment, setEditingSegment] = useState<WheelSegment | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deletingSegmentId, setDeletingSegmentId] = useState<string | null>(
    null,
  );

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

  const [updateConfig, { loading: savingConfig }] = useUpdateSpinWheelConfig();
  const [createPrize, { loading: creatingSegment }] = useCreateSpinWheelPrize();
  const [updatePrize, { loading: updatingSegment }] = useUpdateSpinWheelPrize();
  const [deletePrize, { loading: deletingSegment }] = useDeleteSpinWheelPrize();

  const hasChanged = React.useMemo(() => {
    if (!config) return false;
    return (
      isActive !== (config.isActive ?? true) ||
      costPerSpin !== (config.costPerSpin ?? 20) ||
      maxSpinsPerDay !== (config.maxSpinsPerDay ?? 3) ||
      campaignStartDate !== (config.campaignStartDate || null) ||
      campaignEndDate !== (config.campaignEndDate || null)
    );
  }, [
    config,
    isActive,
    costPerSpin,
    maxSpinsPerDay,
    campaignStartDate,
    campaignEndDate,
  ]);

  useEffect(() => {
    if (config && !initialized) {
      setIsActive(config.isActive ?? true);
      setCostPerSpin(config.costPerSpin ?? 20);
      setMaxSpinsPerDay(config.maxSpinsPerDay ?? 3);
      setCampaignStartDate(config.campaignStartDate || null);
      setCampaignEndDate(config.campaignEndDate || null);
      setInitialized(true);
    }
  }, [config, initialized]);

  useEffect(() => {
    if (prizesData?.getSpinWheelPrizes) {
      setSegments(
        prizesData.getSpinWheelPrizes.map((p: any) => ({
          ...p,
          rewardType: p.type,
          rewardValue: p.value,
        })),
      );
    }
  }, [prizesData]);

  const activities = activityData?.getSpinWheelPlays || [];
  const totalProbability = segments.reduce((s, seg) => s + seg.probability, 0);
  const avgPayout = segments.reduce(
    (sum, seg) =>
      seg.rewardType === "COINS"
        ? sum + (seg.rewardValue * seg.probability) / (totalProbability || 1)
        : sum,
    0,
  );
  const profitMargin =
    costPerSpin > 0 ? ((costPerSpin - avgPayout) / costPerSpin) * 100 : 0;
  const isHealthy = profitMargin >= 20 && profitMargin <= 40;

  const handleSaveConfig = async () => {
    if (costPerSpin < 1) {
      toast.error("Cost per spin must be at least 1");
      return;
    }
    if (maxSpinsPerDay < 1) {
      toast.error("Daily cap must be at least 1");
      return;
    }
    try {
      await updateConfig({
        variables: {
          input: {
            isActive,
            costPerSpin,
            maxSpinsPerDay,
            campaignStartDate,
            campaignEndDate,
          },
        },
      });
      toast.success("Spin wheel configuration saved");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save");
    }
  };

  const handleReset = () => {
    if (config) {
      setIsActive(config.isActive ?? true);
      setCostPerSpin(config.costPerSpin ?? 20);
      setMaxSpinsPerDay(config.maxSpinsPerDay ?? 3);
      setCampaignStartDate(config.campaignStartDate || null);
      setCampaignEndDate(config.campaignEndDate || null);
    }
  };

  const handleAddSegment = () => {
    const nextSortOrder =
      segments.length > 0
        ? Math.max(...segments.map((s) => s.sortOrder)) + 1
        : 0;
    setEditingSegment({
      id: "",
      label: "",
      rewardType: "COINS",
      rewardValue: 0,
      probability: 10,
      color: SEGMENT_COLORS[segments.length % SEGMENT_COLORS.length],
      isActive: true,
      sortOrder: nextSortOrder,
      rewardId: "",
    });
    setIsDialogOpen(true);
  };

  const handleSaveSegment = async () => {
    if (!editingSegment) return;
    const input = {
      label: editingSegment.label,
      type: editingSegment.rewardType,
      value: editingSegment.rewardValue,
      probability: editingSegment.probability,
      rewardId: editingSegment.rewardId || null,
      color: editingSegment.color,
      isActive: editingSegment.isActive,
      sortOrder: editingSegment.sortOrder,
    };
    try {
      if (editingSegment.id) {
        await updatePrize({ variables: { id: editingSegment.id, input } });
        setSegments((prev) =>
          prev.map((s) => (s.id === editingSegment.id ? editingSegment : s)),
        );
        toast.success("Segment updated");
      } else {
        const { data } = await createPrize({ variables: { input } });
        const newSeg = data?.createSpinWheelPrize;
        if (newSeg)
          setSegments((prev) => [
            ...prev,
            { ...newSeg, rewardType: newSeg.type, rewardValue: newSeg.value },
          ]);
        toast.success("Segment added");
      }
      setIsDialogOpen(false);
      setEditingSegment(null);
      refetchPrizes();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save segment");
    }
  };

  const handleDeleteSegment = async (id: string) => {
    try {
      await deletePrize({ variables: { id } });
      setSegments((prev) => prev.filter((s) => s.id !== id));
      toast.success("Segment deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete segment");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-black/10 overflow-hidden relative">
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 md:px-8 py-3">
          <EcosystemHeader
            title="Spin Wheel"
            badgeText="Interactive Game"
            description={`Configure spin wheel segments, ${currencyName} cost per spin, and win probabilities.`}
            icon={Dices}
            breadcrumbs={[
              { label: "Gamification", href: "/gamification" },
              { label: "Engagement Games", href: "/gamification/engagement-games" },
              { label: "Spin Wheel" },
            ]}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-6">
              {/* Phone Live Simulator */}
              <GamePreviewMockup
                segments={segments}
                costPerSpin={costPerSpin}
                maxSpinsPerDay={maxSpinsPerDay}
                currencyName={currencyName}
              />

              {/* Economic Health Monitor */}
              <EconomyMonitor
                avgPayout={avgPayout}
                profitMargin={profitMargin}
                isHealthy={isHealthy}
                currencyName={currencyName}
              />

              {/* Strategic Tip */}
              <PolarisTipCard title="Engagement Tip">
                Include a mix of small frequent wins (e.g. 5–10 points) and rare grand prizes (exclusive vouchers) to maximize daily retention without inflating your point economy.
              </PolarisTipCard>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Step 1: Game Control & Economics */}
            <PolarisFormCard
              step={1}
              title="Game Economics & State"
              description="Control availability, participation cost in points, and daily spin velocity."
              badge="Game Rules"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Status Switch Card */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="spinActive"
                      className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block cursor-pointer"
                    >
                      Game Status
                    </Label>
                    <p className="text-[11px] text-zinc-500">
                      {isActive ? "Currently live for members" : "Game paused"}
                    </p>
                  </div>
                  <Switch
                    id="spinActive"
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
                      value={maxSpinsPerDay}
                      onChange={(e) => setMaxSpinsPerDay(Number(e.target.value))}
                      className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-semibold shadow-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-medium">
                      spins / day
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost Per Spin Input with Presets */}
              <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Label
                  htmlFor="costPerSpin"
                  className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Cost per Spin ({currencyName})
                </Label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-900 dark:text-zinc-100">
                      <Coins className="h-4 w-4" />
                    </div>
                    <Input
                      id="costPerSpin"
                      type="number"
                      min={1}
                      value={costPerSpin}
                      onChange={(e) => setCostPerSpin(Number(e.target.value))}
                      className="h-11 pl-10 pr-16 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-base font-bold text-zinc-900 dark:text-zinc-100 shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      {currencyName.substring(0, 3).toUpperCase()}
                    </div>
                  </div>

                  <PolarisPresetChips
                    presets={COST_PRESETS}
                    currentValue={Number(costPerSpin)}
                    onSelect={(v) => setCostPerSpin(v)}
                    prefix=""
                  />
                </div>
              </div>
            </PolarisFormCard>

            {/* Step 2: Wheel Segments Configuration */}
            <PolarisFormCard
              step={2}
              title="Wheel Segments & Probability"
              description={`Configure up to 12 reward segments and their respective winning odds.`}
              badge={`${segments.length} / 12 Segments`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Total Relative Weight:{" "}
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    {totalProbability}
                  </strong>
                </p>
                <Button
                  size="sm"
                  onClick={handleAddSegment}
                  disabled={segments.length >= 12}
                  className="gap-1.5 h-8 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Segment
                </Button>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50/70 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800">
                      <TableHead className="h-10 text-xs font-semibold w-[40px]">
                        #
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold">
                        Label
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold">
                        Type
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold">
                        Value
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold">
                        Odds %
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold text-center">
                        Active
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {segments.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-24 text-center text-xs text-zinc-400"
                        >
                          No segments defined. Click "Add Segment" to begin.
                        </TableCell>
                      </TableRow>
                    ) : (
                      segments.map((seg, i) => (
                        <TableRow
                          key={seg.id}
                          className="group h-12 border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                        >
                          <TableCell className="font-mono text-xs text-zinc-400">
                            {i + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span
                                className="h-3 w-3 rounded-full shrink-0 shadow-xs"
                                style={{ background: seg.color }}
                              />
                              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                {seg.label}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 w-fit border",
                                REWARD_BADGE[seg.rewardType],
                              )}
                            >
                              {REWARD_ICON[seg.rewardType]}
                              {REWARD_LABELS[seg.rewardType]}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                            {seg.rewardType === "COINS" &&
                              `${seg.rewardValue} ${currencyName}`}
                            {seg.rewardType === "VOUCHER" && (
                              <div className="flex items-center gap-1.5">
                                {seg.reward?.image ? (
                                  <img
                                    src={seg.reward.image}
                                    alt=""
                                    className="h-5 w-5 rounded object-cover border border-zinc-200 shrink-0"
                                  />
                                ) : (
                                  <div className="h-5 w-5 rounded bg-zinc-100 flex items-center justify-center border shrink-0">
                                    <Ticket className="h-3 w-3 text-zinc-500" />
                                  </div>
                                )}
                                <span
                                  className="text-xs font-medium truncate max-w-[120px]"
                                  title={seg.reward?.title}
                                >
                                  {seg.reward?.title || `₹${seg.rewardValue}`}
                                </span>
                              </div>
                            )}
                            {seg.rewardType === "NO_REWARDS" && (
                              <span className="text-zinc-400">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-14 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full"
                                  style={{
                                    width: `${(seg.probability / (totalProbability || 1)) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-[11px] text-zinc-500 font-mono font-semibold">
                                {(
                                  (seg.probability / (totalProbability || 1)) *
                                  100
                                ).toFixed(1)}
                                %
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={seg.isActive}
                              onCheckedChange={async (v) => {
                                try {
                                  await updatePrize({
                                    variables: {
                                      id: seg.id,
                                      input: { isActive: v },
                                    },
                                  });
                                  toast.success("Updated segment status");
                                  refetchPrizes();
                                } catch {
                                  toast.error("Update failed");
                                }
                              }}
                              className="scale-75 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                onClick={() => {
                                  setEditingSegment({ ...seg });
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Edit className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600"
                                onClick={() => setDeletingSegmentId(seg.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-zinc-400 hover:text-rose-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
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
        description="You have pending changes to the spin wheel settings."
        buttonText="Save Configuration"
      />

      {/* Segment Dialog */}
      <SegmentDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingSegment={editingSegment}
        setEditingSegment={setEditingSegment}
        handleSaveSegment={handleSaveSegment}
        creatingSegment={creatingSegment}
        updatingSegment={updatingSegment}
        uniqueVoucherRewards={uniqueVoucherRewards}
        vouchersLoading={vouchersLoading}
        getVouchers={getVouchers}
        currencyName={currencyName}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingSegmentId}
        onOpenChange={(open) => !open && setDeletingSegmentId(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this segment from the spin wheel?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingSegmentId(null)}
              className="rounded-lg text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                if (deletingSegmentId) {
                  await handleDeleteSegment(deletingSegmentId);
                  setDeletingSegmentId(null);
                }
              }}
              disabled={deletingSegment}
              className="rounded-lg text-xs font-bold"
            >
              {deletingSegment ? "Deleting..." : "Delete Segment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
