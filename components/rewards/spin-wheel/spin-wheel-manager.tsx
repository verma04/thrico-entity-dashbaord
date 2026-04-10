"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
} from "@/graphql/actions/rewards";
import moment from "moment";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

type RewardType = "TC" | "VOUCHER" | "PREMIUM" | "NOTHING";

interface WheelSegment {
  id: string;
  label: string;
  rewardType: RewardType;
  rewardValue: number;
  probability: number;
  color: string;
  isActive: boolean;
  sortOrder: number;
  rewardId?: string;
  reward?: { id: string; title: string; image?: string };
}

const SEGMENT_COLORS = [
  "#7c3aed",
  "#2563eb",
  "#059669",
  "#d97706",
  "#dc2626",
  "#0891b2",
  "#c026d3",
  "#4f46e5",
  "#0d9488",
  "#ea580c",
  "#e11d48",
  "#7c2d12",
];

const REWARD_LABELS: Record<RewardType, string> = {
  TC: "TC Coins",
  VOUCHER: "Voucher",
  PREMIUM: "Premium",
  NOTHING: "No Reward",
};
const REWARD_BADGE: Record<RewardType, string> = {
  TC: "bg-amber-50 text-amber-700 border border-amber-100",
  VOUCHER: "bg-blue-50 text-blue-700 border border-blue-100",
  PREMIUM: "bg-violet-50 text-violet-700 border border-violet-100",
  NOTHING: "bg-muted text-muted-foreground border border-border",
};
const REWARD_ICON: Record<RewardType, React.ReactNode> = {
  TC: <Coins className="h-3 w-3" />,
  VOUCHER: <Ticket className="h-3 w-3" />,
  PREMIUM: <Crown className="h-3 w-3" />,
  NOTHING: <XCircle className="h-3 w-3" />,
};

// Wheel Canvas Preview
function WheelPreview({ segments }: { segments: WheelSegment[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 4;

    ctx.clearRect(0, 0, size, size);

    const active = segments.filter((s) => s.isActive);
    const totalProb = active.reduce((s, seg) => s + seg.probability, 0);

    if (active.length === 0) {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#e5e7eb";
      ctx.fill();
      ctx.font = "11px sans-serif";
      ctx.fillStyle = "#9ca3af";
      ctx.textAlign = "center";
      ctx.fillText("No segments", center, center);
      return;
    }

    let startAngle = -Math.PI / 2;
    active.forEach((seg) => {
      const sliceAngle = (seg.probability / totalProb) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const midAngle = startAngle + sliceAngle / 2;
      const labelR = radius * 0.65;
      const x = center + Math.cos(midAngle) * labelR;
      const y = center + Math.sin(midAngle) * labelR;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(midAngle + Math.PI / 2);
      ctx.font = "bold 8px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        seg.label.length > 9 ? seg.label.slice(0, 9) + "…" : seg.label,
        0,
        0,
      );
      ctx.restore();
      startAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(center, center, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#1f2937";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = "bold 7px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", center, center);

    ctx.beginPath();
    ctx.moveTo(center - 7, 2);
    ctx.lineTo(center + 7, 2);
    ctx.lineTo(center, 13);
    ctx.closePath();
    ctx.fillStyle = "#fbbf24";
    ctx.fill();
  }, [segments]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  return (
    <canvas ref={canvasRef} width={180} height={180} className="mx-auto" />
  );
}

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
  const [updateConfig, { loading: savingConfig }] = useUpdateSpinWheelConfig();
  const [createPrize, { loading: creatingSegment }] = useCreateSpinWheelPrize();
  const [updatePrize, { loading: updatingSegment }] = useUpdateSpinWheelPrize();
  const [deletePrize, { loading: deletingSegment }] = useDeleteSpinWheelPrize();

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
      seg.rewardType === "TC"
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
    } catch (err: any) {
      toast.error(err?.message || "Failed to save");
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
      rewardType: "TC",
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
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleSaveConfig}
            disabled={isMutating}
            className="gap-2 min-w-[140px]"
          >
            {savingConfig ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save Configuration
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
                title="Cost per Spin (TC)"
              >
                <Input
                  type="number"
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
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Daily Cap
                  </Label>
                  <Input
                    type="number"
                    value={maxSpinsPerDay}
                    onChange={(e) => setMaxSpinsPerDay(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Start Date
                  </Label>
                  <Input
                    type="date"
                    value={
                      campaignStartDate
                        ? moment(campaignStartDate).format("YYYY-MM-DD")
                        : ""
                    }
                    onChange={(e) => setCampaignStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    End Date
                  </Label>
                  <Input
                    type="date"
                    value={
                      campaignEndDate
                        ? moment(campaignEndDate).format("YYYY-MM-DD")
                        : ""
                    }
                    onChange={(e) => setCampaignEndDate(e.target.value)}
                  />
                </div>
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
                          <TableCell className="font-mono text-sm font-medium text-foreground">
                            {seg.rewardType === "TC" && `${seg.rewardValue} TC`}
                            {seg.rewardType === "VOUCHER" &&
                              `₹${seg.rewardValue}`}
                            {seg.rewardType === "PREMIUM" &&
                              `${seg.rewardValue} Days`}
                            {seg.rewardType === "NOTHING" && "—"}
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
                                onClick={() => handleDeleteSegment(seg.id)}
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
              {/* Wheel Preview (Mobile Mockup) */}
              <div className="relative group mx-auto max-w-[340px]">
                {/* Glowing ambient background shadow */}
                <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-[36px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Mock Phone Frame */}
                <div className="relative flex flex-col w-full bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-zinc-200/50 dark:border-white/5 overflow-hidden text-zinc-900 dark:text-zinc-100 p-2">
                  <div className="flex-1 rounded-[24px] bg-indigo-950 overflow-hidden flex flex-col relative border border-indigo-900/50 shadow-inner">
                    
                    {/* Game Header */}
                    <div className="p-5 text-center relative z-10 space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-2">
                        <Dices className="h-3 w-3 text-amber-400" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-200">Daily Spin</span>
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Test Your Luck</h3>
                      <p className="text-[10px] text-indigo-300">Spin the wheel to win exclusive rewards.</p>
                    </div>

                    {/* Canvas Container */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                      {/* Subtle backglow behind the wheel */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/30 rounded-full blur-2xl" />
                      <div className="relative scale-110 drop-shadow-2xl">
                        <WheelPreview segments={segments} />
                      </div>
                    </div>

                    {/* Game Bottom Bar */}
                    <div className="p-6 relative z-10 mt-auto bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Live Preview</span>
                      </div>
                      <Button disabled className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] border-none">
                        Spin For {costPerSpin} TC
                      </Button>
                      <p className="text-center text-[9px] text-indigo-400/70 mt-3 font-medium">
                        {maxSpinsPerDay} Spins Remaining Today
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
                        {profitMargin < 20 ? "Margin too low. Increase spin cost or adjust probabilities to lower overall value." : "Margin too high. Game may feel unrewarding; consider better payouts."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </EcosystemContainer>

      {/* Segment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSegment?.id ? "Edit Segment" : "Add Segment"}
            </DialogTitle>
            <DialogDescription>
              Configure label, reward type, value, and probability weight.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Label
                </Label>
                <Input
                  placeholder="e.g. 50 TC"
                  value={editingSegment?.label || ""}
                  onChange={(e) =>
                    setEditingSegment((p) =>
                      p ? { ...p, label: e.target.value } : null,
                    )
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Reward Type
                </Label>
                <Select
                  value={editingSegment?.rewardType}
                  onValueChange={(v) =>
                    setEditingSegment((p) =>
                      p ? { ...p, rewardType: v as RewardType } : null,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TC">TC Coins</SelectItem>
                    <SelectItem value="VOUCHER">Voucher</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                    <SelectItem value="NOTHING">No Reward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Reward Value
                </Label>
                <Input
                  type="number"
                  value={editingSegment?.rewardValue || 0}
                  onChange={(e) =>
                    setEditingSegment((p) =>
                      p
                        ? { ...p, rewardValue: parseInt(e.target.value) || 0 }
                        : null,
                    )
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Probability Weight
                </Label>
                <Input
                  type="number"
                  value={editingSegment?.probability || 0}
                  onChange={(e) =>
                    setEditingSegment((p) =>
                      p
                        ? { ...p, probability: parseInt(e.target.value) || 0 }
                        : null,
                    )
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveSegment}
              disabled={creatingSegment || updatingSegment}
              className="gap-2"
            >
              {(creatingSegment || updatingSegment) && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {editingSegment?.id ? "Save Changes" : "Add Segment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
