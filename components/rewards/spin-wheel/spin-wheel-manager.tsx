"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Settings,
  Dices,
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
  Loader2,
  Trophy,
  Activity,
  ChartBar,
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
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { DialogDescription } from "@radix-ui/react-dialog";

// ─── Types ───────────────────────────────────────────
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
  reward?: {
    id: string;
    title: string;
    image?: string;
  };
}

// ─── Constants ───────────────────────────────────────
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

// ─── Reward type helpers ─────────────────────────────
const rewardTypeLabel = (t: RewardType) => {
  switch (t) {
    case "TC":
      return "TC Coins";
    case "VOUCHER":
      return "Voucher";
    case "PREMIUM":
      return "Premium";
    case "NOTHING":
      return "No Reward";
  }
};

const rewardTypeIcon = (t: RewardType) => {
  switch (t) {
    case "TC":
      return <Coins className="h-3.5 w-3.5" />;
    case "VOUCHER":
      return <Ticket className="h-3.5 w-3.5" />;
    case "PREMIUM":
      return <Crown className="h-3.5 w-3.5" />;
    case "NOTHING":
      return <XCircle className="h-3.5 w-3.5" />;
  }
};

const rewardTypeBadge = (t: RewardType) => {
  const styles: Record<RewardType, string> = {
    TC: "text-amber-700 bg-amber-50 border-amber-200",
    VOUCHER: "text-blue-700 bg-blue-50 border-blue-200",
    PREMIUM: "text-purple-700 bg-purple-50 border-purple-200",
    NOTHING: "text-gray-600 bg-gray-50 border-gray-200",
  };
  return styles[t];
};

// ─── Mini Wheel Preview ─────────────────────────────
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

    if (segments.length === 0) {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#e5e7eb";
      ctx.fill();
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#9ca3af";
      ctx.textAlign = "center";
      ctx.fillText("No segments", center, center);
      return;
    }

    const activeSegments = segments.filter((s) => s.isActive);
    const totalProb = activeSegments.reduce((s, seg) => s + seg.probability, 0);
    let startAngle = -Math.PI / 2;

    if (activeSegments.length === 0) {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#e5e7eb";
      ctx.fill();
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#9ca3af";
      ctx.textAlign = "center";
      ctx.fillText("No active segments", center, center);
      return;
    }

    activeSegments.forEach((seg) => {
      const sliceAngle = (seg.probability / totalProb) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const midAngle = startAngle + sliceAngle / 2;
      const labelR = radius * 0.65;
      const x = center + Math.cos(midAngle) * labelR;
      const y = center + Math.sin(midAngle) * labelR;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(midAngle + Math.PI / 2);
      ctx.font = "bold 9px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const maxLen = 10;
      const txt =
        seg.label.length > maxLen
          ? seg.label.slice(0, maxLen) + "…"
          : seg.label;
      ctx.fillText(txt, 0, 0);
      ctx.restore();

      startAngle += sliceAngle;
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(center, center, 18, 0, Math.PI * 2);
    ctx.fillStyle = "#1f2937";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = "bold 8px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", center, center);

    // Pointer
    ctx.beginPath();
    ctx.moveTo(center - 8, 2);
    ctx.lineTo(center + 8, 2);
    ctx.lineTo(center, 14);
    ctx.closePath();
    ctx.fillStyle = "#fbbf24";
    ctx.fill();
  }, [segments]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className="mx-auto"
      style={{ imageRendering: "auto" }}
    />
  );
}

// ─── Main Component ─────────────────────────────────
export function SpinWheelManager() {
  // ── GraphQL hooks ──
  const {
    data: configData,
    loading: configLoading,
    refetch: refetchConfig,
  } = useGetSpinWheelConfig();
  const {
    data: prizesData,
    loading: prizesLoading,
    refetch: refetchPrizes,
  } = useGetSpinWheelPrizes();
  const { data: activityData, loading: activityLoading } = useGetSpinActivity({
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

  // ── Local state (initialized from API or defaults) ──
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

  // Sync from API data when it loads
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
      const mappedPrizes = prizesData.getSpinWheelPrizes.map((p: any) => ({
        ...p,
        rewardType: p.type,
        rewardValue: p.value,
      }));
      setSegments(mappedPrizes);
    }
  }, [prizesData]);

  const activities = activityData?.getSpinWheelPlays || [];

  // ── Economy calculations ──
  const totalProbability = segments.reduce((s, seg) => s + seg.probability, 0);
  const avgPayout = segments.reduce((sum, seg) => {
    if (seg.rewardType === "TC") {
      return sum + (seg.rewardValue * seg.probability) / totalProbability;
    }
    return sum;
  }, 0);

  const profitMargin =
    costPerSpin > 0 ? ((costPerSpin - avgPayout) / costPerSpin) * 100 : 0;
  const isHealthy = profitMargin >= 20 && profitMargin <= 40;

  // ── Save config ──
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

      toast.success("Spin wheel configuration saved!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save configuration");
    }
  };

  // ── Segment CRUD ──
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

  const handleEditSegment = (seg: WheelSegment) => {
    setEditingSegment({ ...seg });
    setIsDialogOpen(true);
  };

  const handleSaveSegment = async () => {
    if (!editingSegment) return;
    const input = {
      label: editingSegment.label,
      type: editingSegment.rewardType, // Backend expects 'type'
      value: editingSegment.rewardValue, // Backend expects 'value'
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
        toast.success("Segment updated!");
      } else {
        const { data } = await createPrize({ variables: { input } });
        const newSeg = data?.createSpinWheelPrize;
        if (newSeg) {
          setSegments((prev) => [
            ...prev,
            { ...newSeg, rewardType: newSeg.type, rewardValue: newSeg.value },
          ]);
        }
        toast.success("Segment added!");
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
      toast.success("Segment deleted!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete segment");
    }
  };

  const isMutating =
    savingConfig || creatingSegment || updatingSegment || deletingSegment;

  return (
    <EcosystemWrapper anonymized-1="spin-wheel-config">
      <EcosystemHeader
        title="Wheel of Fortune"
        badgeText="Engagement System"
        description="Configure spin rewards, token costs, and winning probabilities to drive community participation."
        icon={Dices}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-3 w-3 rounded-full animate-pulse",
                  isActive ? "bg-emerald-500" : "bg-amber-500",
                )}
              />
              <span className="text-sm font-bold text-slate-500">
                System {isActive ? "Live" : "Paused"}
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <Users className="h-4 w-4 text-indigo-500" />
              <span>{activities.length}+ Recent Spins Processed</span>
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
              <RotateCcw
                className={cn("h-4 w-4", configLoading && "animate-spin")}
              />
              Refresh
            </Button>
            <Button
              onClick={handleSaveConfig}
              disabled={isMutating}
              className="h-10 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-wider gap-3 shadow-xl shadow-slate-200 transition-all active:scale-95 group"
            >
              {savingConfig ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              )}
              Save Configuration
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Config */}
          <div className="lg:col-span-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Master Toggle Card */}
              <div className="p-8 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight italic">
                    Status
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {isActive ? "Spin flow is active" : "Flow is restricted"}
                  </p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  className="data-[state=checked]:bg-indigo-600 scale-125"
                />
              </div>

              {/* Cost Card */}
              <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-4">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Spin Value (TC)
                </Label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
                  <Input
                    type="number"
                    value={costPerSpin}
                    onChange={(e) => setCostPerSpin(Number(e.target.value))}
                    className="pl-12 h-14 rounded-2xl border-slate-200 font-extrabold text-slate-900 text-xl focus:ring-amber-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Limits & Timing */}
            <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight italic">
                    Temporal Constraints
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                    Daily limits & windows
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    Daily Cap / User
                  </Label>
                  <Input
                    type="number"
                    value={maxSpinsPerDay}
                    onChange={(e) => setMaxSpinsPerDay(Number(e.target.value))}
                    className="h-12 rounded-xl border-slate-200 font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    Activation Date
                  </Label>
                  <Input
                    type="date"
                    value={
                      campaignStartDate
                        ? moment(campaignStartDate).format("YYYY-MM-DD")
                        : ""
                    }
                    onChange={(e) => setCampaignStartDate(e.target.value)}
                    className="h-12 rounded-xl border-slate-200 font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    Termination Date
                  </Label>
                  <Input
                    type="date"
                    value={
                      campaignEndDate
                        ? moment(campaignEndDate).format("YYYY-MM-DD")
                        : ""
                    }
                    onChange={(e) => setCampaignEndDate(e.target.value)}
                    className="h-12 rounded-xl border-slate-200 font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Segments Table */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic">
                      Wheel Invariants
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                      {segments.length} segments configured
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleAddSegment}
                  disabled={segments.length >= 12}
                  className="rounded-xl h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-wider gap-2 shadow-lg shadow-indigo-200"
                >
                  <Plus className="h-4 w-4" />
                  Append Segment
                </Button>
              </div>

              <div className="rounded-[2rem] bg-white border border-slate-100 shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-50 bg-slate-50/50">
                      <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-14 pl-8">
                        ID
                      </TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-14">
                        Reward
                      </TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-14">
                        Type
                      </TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-14">
                        Yield
                      </TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-14">
                        Probability
                      </TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-14 text-center">
                        Active
                      </TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-14 text-right pr-8">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {segments.map((seg, i) => (
                      <TableRow
                        key={seg.id}
                        className="group hover:bg-slate-50/80 transition-colors border-b border-slate-50"
                      >
                        <TableCell className="font-mono text-xs text-slate-300 pl-8">
                          {i + 1}
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">
                          {seg.label}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-lg font-black text-[10px] uppercase tracking-tighter gap-1.5",
                              rewardTypeBadge(seg.rewardType),
                            )}
                          >
                            {rewardTypeIcon(seg.rewardType)}
                            {rewardTypeLabel(seg.rewardType)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-black text-slate-900">
                          {seg.rewardType === "TC" && `${seg.rewardValue} TC`}
                          {seg.rewardType === "VOUCHER" &&
                            `₹${seg.rewardValue}`}
                          {seg.rewardType === "PREMIUM" &&
                            `${seg.rewardValue} Days`}
                          {seg.rewardType === "NOTHING" && "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[60px]">
                              <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{
                                  width: `${(seg.probability / totalProbability) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-[10px] font-black text-slate-400">
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
                                toast.success("Status updated");
                                refetchPrizes();
                              } catch (e) {
                                toast.error("Update failed");
                              }
                            }}
                            className="scale-75"
                          />
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditSegment(seg)}
                              className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-indigo-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSegment(seg.id)}
                              className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-rose-600"
                            >
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

          {/* Right Column: Preview & Stats */}
          <div className="lg:col-span-4 space-y-10">
            <div className="sticky top-10 space-y-10">
              {/* Visual Preview */}
              <div className="p-10 rounded-[3rem] bg-slate-900 shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:scale-125 transition-transform duration-1000">
                  <Zap className="h-32 w-32 text-indigo-500" />
                </div>
                <div className="relative z-10 space-y-8">
                  <div className="text-center">
                    <h4 className="text-white font-black italic tracking-tight text-xl">
                      Visual Invariants
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Simulated frontend render
                    </p>
                  </div>
                  <WheelPreview segments={segments} />
                  <p className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-tighter italic">
                    * Preview reflects active segments only
                  </p>
                </div>
              </div>

              {/* Economy Protection */}
              <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight italic">
                    Vault Health
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Payout Factor
                    </span>
                    <span className="font-black text-slate-900">
                      {avgPayout.toFixed(1)} TC
                    </span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500",
                      isHealthy
                        ? "bg-emerald-50 border-emerald-100"
                        : "bg-rose-50 border-rose-100",
                    )}
                  >
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                        Profit Margin
                      </p>
                      <h4
                        className={cn(
                          "text-3xl font-black tracking-tighter",
                          isHealthy ? "text-emerald-600" : "text-rose-600",
                        )}
                      >
                        {profitMargin.toFixed(1)}%
                      </h4>
                    </div>
                    {isHealthy ? (
                      <TrendingUp className="h-8 w-8 text-emerald-500 opacity-20" />
                    ) : (
                      <AlertTriangle className="h-8 w-8 text-rose-500 opacity-20" />
                    )}
                  </div>
                </div>

                {!isHealthy && (
                  <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100/50 text-[11px] font-bold text-rose-600 leading-relaxed uppercase tracking-tight">
                    Critical: Economy is imbalanced.{" "}
                    {profitMargin < 20
                      ? "Increase cost or lower rewards."
                      : "Add higher rewards to boost engagement."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </EcosystemContainer>

      {/* Segment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-slate-900 p-8 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy className="h-20 w-20" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic tracking-tight uppercase">
                Configuring Segment
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                Definition of a single wheel invariant
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-10 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Internal Label
                </Label>
                <Input
                  value={editingSegment?.label}
                  onChange={(e) =>
                    setEditingSegment((prev) =>
                      prev ? { ...prev, label: e.target.value } : null,
                    )
                  }
                  className="h-12 rounded-xl border-slate-200 font-bold"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Yield Type
                </Label>
                <Select
                  value={editingSegment?.rewardType}
                  onValueChange={(v) =>
                    setEditingSegment((prev) =>
                      prev ? { ...prev, rewardType: v as RewardType } : null,
                    )
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 font-bold">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                    <SelectItem value="TC" className="font-bold">
                      TC COINS
                    </SelectItem>
                    <SelectItem value="VOUCHER" className="font-bold">
                      EXTERNAL VOUCHER
                    </SelectItem>
                    <SelectItem value="PREMIUM" className="font-bold">
                      PREMIUM ACCESS
                    </SelectItem>
                    <SelectItem value="NOTHING" className="font-bold">
                      EMPTY SLOT
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Asset Value
                </Label>
                <Input
                  type="number"
                  value={editingSegment?.rewardValue}
                  onChange={(e) =>
                    setEditingSegment((prev) =>
                      prev
                        ? {
                            ...prev,
                            rewardValue: parseInt(e.target.value) || 0,
                          }
                        : null,
                    )
                  }
                  className="h-12 rounded-xl border-slate-200 font-bold"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Probability Weight
                </Label>
                <Input
                  type="number"
                  value={editingSegment?.probability}
                  onChange={(e) =>
                    setEditingSegment((prev) =>
                      prev
                        ? {
                            ...prev,
                            probability: parseInt(e.target.value) || 0,
                          }
                        : null,
                    )
                  }
                  className="h-12 rounded-xl border-slate-200 font-bold text-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl font-bold h-11 px-6"
            >
              Discard
            </Button>
            <Button
              onClick={handleSaveSegment}
              disabled={creatingSegment || updatingSegment}
              className="rounded-xl font-black h-11 px-8 bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-200 transition-all active:scale-95"
            >
              Commit Segment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
