"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Dices,
  Plus,
  Trash2,
  Edit,
  Shield,
  TrendingUp,
  AlertTriangle,
  Clock,
  Save,
  Coins,
  Crown,
  Ticket,
  XCircle,
  Users,
  Loader2,
  Info,
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
  useGetRewards,
  useLazyGetVouchersByRewardMechanism,
} from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import moment from "moment";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";

import { RewardType, WheelSegment } from "./types";
import {
  SEGMENT_COLORS,
  REWARD_LABELS,
  REWARD_BADGE,
  REWARD_ICON,
} from "./constants";
import { WheelPreview } from "./wheel-preview";
import { SectionCard } from "./section-card";
import { EconomyMonitor } from "./economy-monitor";
import { GamePreviewMockup } from "./game-preview-mockup";
import { SegmentDialog } from "./segment-dialog";

export function SpinWheelManager() {
  const {
    data: configData,
    loading: configLoading,
    refetch: refetchConfig,
  } = useGetSpinWheelConfig();
  const { data: prizesData, refetch: refetchPrizes } = useGetSpinWheelPrizes();
  const { data: activityData } = useGetSpinActivity({
    pagination: { page: 1, limit: 10 },
  });
  const { data: rewardsData } = useGetRewards({
    status: "ACTIVE",
    pagination: { page: 1, limit: 100 },
  });
  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName = currencyConfig?.getEntityCurrencyConfig?.currencyName || "Tokens";

  const config = configData?.getSpinWheelConfig;
  const [isActive, setIsActive] = useState(false);
  const [costPerSpin, setCostPerSpin] = useState(0);
  const [maxSpinsPerDay, setMaxSpinsPerDay] = useState(0);
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
  const [deletingSegmentId, setDeletingSegmentId] = useState<string | null>(null);

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
        ? sum + (seg.rewardValue * seg.probability) / totalProbability
        : sum,
    0,
  );
  const profitMargin =
    costPerSpin > 0 ? ((costPerSpin - avgPayout) / costPerSpin) * 100 : 0;
  const isHealthy = profitMargin >= 20 && profitMargin <= 40;
  const isMutating =
    savingConfig || creatingSegment || updatingSegment || deletingSegment;

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
    <>
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div
            className={cn(
              "h-2 w-2 rounded-full animate-pulse",
              isActive ? "bg-emerald-500" : "bg-amber-500",
            )}
          />
          <span className="text-xs font-medium text-muted-foreground">
            {isActive ? "Live" : "Paused"}
          </span>
          <EcosystemActionBar.Separator />
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {activities.length} recent spins
          </span>
        </EcosystemActionBar.Group>
        <EcosystemActionBar.Group align="right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchConfig();
              refetchPrizes();
            }}
          >
            Refresh Data
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left col: 2/3 */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <SectionCard
                icon={Dices}
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
                      Spin wheel availability
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
                title="Cost per Spin (Coins)"
              >
                <Input
                  type="number"
                  min={1}
                  value={costPerSpin}
                  onChange={(e) => setCostPerSpin(Number(e.target.value))}
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
                  value={maxSpinsPerDay}
                  onChange={(e) => setMaxSpinsPerDay(Number(e.target.value))}
                />
              </div>
            </SectionCard>

            <SectionCard
              icon={Dices}
              iconBg="bg-violet-50"
              iconColor="text-violet-600"
              title="Wheel Segments"
              description={`${segments.length} segments configured`}
              action={
                <Button
                  size="sm"
                  onClick={handleAddSegment}
                  disabled={segments.length >= 12}
                  className="gap-1.5 h-7 text-xs"
                >
                  <Plus className="h-3 w-3" /> Add Segment
                </Button>
              }
            >
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
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
                        Probability
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
                          className="h-20 text-center text-sm text-muted-foreground"
                        >
                          No segments yet. Add one to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      segments.map((seg, i) => (
                        <TableRow key={seg.id} className="group h-12">
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {i + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-sm shrink-0"
                                style={{ background: seg.color }}
                              />
                              <span className="text-sm font-medium text-foreground">
                                {seg.label}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 w-fit",
                                REWARD_BADGE[seg.rewardType],
                              )}
                            >
                              {REWARD_ICON[seg.rewardType]}
                              {REWARD_LABELS[seg.rewardType]}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm font-medium text-foreground">
                            {seg.rewardType === "COINS" &&
                              `${seg.rewardValue} Coins`}
                            {seg.rewardType === "VOUCHER" && (
                              <div className="flex items-center gap-1.5">
                                {seg.reward?.image ? (
                                  <img
                                    src={seg.reward.image}
                                    alt=""
                                    className="h-5 w-5 rounded object-cover border border-border/40 shrink-0"
                                  />
                                ) : (
                                  <div className="h-5 w-5 rounded bg-muted flex items-center justify-center border border-border/40 shrink-0">
                                    <Ticket className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                )}
                                <span className="text-xs font-medium text-foreground truncate max-w-[100px]" title={seg.reward?.title}>
                                  {seg.reward?.title || `₹${seg.rewardValue}`}
                                </span>
                              </div>
                            )}
                            {seg.rewardType === "NO_REWARDS" && "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-500 rounded-full"
                                  style={{
                                    width: `${(seg.probability / totalProbability) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground font-mono">
                                {(
                                  (seg.probability / totalProbability) *
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
                                  toast.success("Updated");
                                  refetchPrizes();
                                } catch {
                                  toast.error("Update failed");
                                }
                              }}
                              className="scale-75"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg"
                                onClick={() => {
                                  setEditingSegment({ ...seg });
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg hover:text-rose-600"
                                onClick={() => setDeletingSegmentId(seg.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>
          </div>

          {/* Right col: Preview + Economy */}
          <div className="space-y-5">
            <div className="sticky top-6 space-y-6">
              <GamePreviewMockup
                segments={segments}
                costPerSpin={costPerSpin}
                maxSpinsPerDay={maxSpinsPerDay}
              />

              <EconomyMonitor
                avgPayout={avgPayout}
                profitMargin={profitMargin}
                isHealthy={isHealthy}
              />
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
        title="Unsaved Configuration"
        description="You have pending changes to the spin wheel settings."
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
      <Dialog open={!!deletingSegmentId} onOpenChange={(open) => !open && setDeletingSegmentId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this segment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingSegmentId(null)}>
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
            >
              {deletingSegment ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
