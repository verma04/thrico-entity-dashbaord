"use client";

import React, { useState, useRef } from "react";
import {
  Search,
  Plus,
  Ticket,
  ExternalLink,
  Zap,
  RotateCw,
  Gamepad2,
  Clock,
  LayoutGrid,
  LayoutList,
  Pencil,
  Download,
  CheckCircle2,
  AlertTriangle,
  History,
  Activity,
  Upload,
  FileDown,
  FileText,
  X,
  AlertCircle,
  Loader2,
  Info,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  useGetRewards,
  useGetAllVouchers,
  useMarkVoucherAsUsed,
  useDeleteVoucher,
  useUploadVouchers,
} from "@/graphql/actions/rewards";
import { GET_VOUCHERS } from "@/graphql/quries/rewards/rewards-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { VoucherManagementTable } from "@/components/rewards/inventory/voucher-management-table";
import { VoucherDetailsDialog } from "@/components/rewards/inventory/voucher-details-dialog";
import { InventoryTable } from "@/components/rewards/inventory/inventory-table";
import { useToast } from "@/hooks/use-toast";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────
interface Voucher {
  id: string;
  code: string;
  offerId: string;
  rewardTitle?: string;
  isUsed: boolean;
  assignedTo?: string;
  assignedAt?: string;
  expiryDate?: string;
  createdAt: string;
}

interface ParsedVoucher {
  code: string;
  amount?: string;
  expiryDate?: string;
  isValid: boolean;
  error?: string;
}

type ActiveTab = "rewards" | "codes" | "inventory";

const FILTER_OPTIONS = ["All", "Standard", "Scratch", "Spin", "Match"];
type FilterOption = (typeof FILTER_OPTIONS)[number];

// ── Helpers ──────────────────────────────────────────────────────────
function getInteractionType(category: string) {
  if (["cat-005", "Scratch Card"].includes(category)) return "Scratch";
  if (["cat-006", "Spin Wheel"].includes(category)) return "Spin";
  if (["cat-007", "Match & Win"].includes(category)) return "Match";
  return "Standard";
}

function getInteractiveBadge(type: string) {
  if (type === "Scratch")
    return {
      label: "Scratch",
      icon: Zap,
      color: "bg-amber-500 text-white",
      chip: "bg-amber-50 text-amber-700 border-amber-100",
    };
  if (type === "Spin")
    return {
      label: "Spin Wheel",
      icon: RotateCw,
      color: "bg-indigo-500 text-white",
      chip: "bg-indigo-50 text-indigo-700 border-indigo-100",
    };
  if (type === "Match")
    return {
      label: "Match & Win",
      icon: Gamepad2,
      color: "bg-rose-500 text-white",
      chip: "bg-rose-50 text-rose-700 border-rose-100",
    };
  return {
    label: "Standard",
    icon: Ticket,
    color: "bg-slate-500 text-white",
    chip: "bg-slate-50 text-slate-600 border-slate-200",
  };
}

// ── Main component ───────────────────────────────────────────────────
export default function CouponsPage() {
  // ── Shared state ──
  const [activeTab, setActiveTab] = useState<ActiveTab>("rewards");

  // ── Rewards tab state ──
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // ── Codes tab state ──
  const [codeSearch, setCodeSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rewardFilter, setRewardFilter] = useState("all");
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // ── Inventory tab state ──
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadRewardId, setUploadRewardId] = useState("");
  const [uploadStep, setUploadStep] = useState<
    "idle" | "validating" | "summary"
  >("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedVouchers, setParsedVouchers] = useState<ParsedVoucher[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  // ── Data ──
  const { data: rewardsData, loading: rewardsLoading } = useGetRewards({
    pagination: { page: 1, limit: 100 },
  });
  const { data: vouchersData, loading: vouchersLoading } = useGetAllVouchers({
    status: statusFilter === "all" ? undefined : statusFilter,
    rewardId: rewardFilter === "all" ? undefined : rewardFilter,
  });
  const [markAsUsed] = useMarkVoucherAsUsed();
  const [deleteVoucher] = useDeleteVoucher();
  const [uploadVouchers, { loading: uploading }] = useUploadVouchers();

  const rewards = rewardsData?.getRewards || [];
  const allVouchers = vouchersData?.getAllVouchers || [];

  // ── Rewards computed ──
  const filteredRewards = rewards.filter((r: any) => {
    const matchesSearch = r.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === "All") return true;
    return getInteractionType(r.category) === activeFilter;
  });

  const categoryCounts: Record<string, number> = { All: rewards.length };
  rewards.forEach((r: any) => {
    const t = getInteractionType(r.category);
    categoryCounts[t] = (categoryCounts[t] || 0) + 1;
  });

  // ── Vouchers computed ──
  const filteredVouchers = allVouchers.filter(
    (v: any) =>
      v.code.toLowerCase().includes(codeSearch.toLowerCase()) ||
      v.reward?.title?.toLowerCase().includes(codeSearch.toLowerCase()),
  );

  const mappedVouchers: Voucher[] = filteredVouchers.map((v: any) => ({
    id: v.id,
    code: v.code,
    offerId: v.offerId,
    rewardTitle: v.reward?.title,
    isUsed: v.isUsed,
    assignedTo: v.assignedTo,
    assignedAt: v.assignedAt,
    expiryDate: v.expiryDate,
    createdAt: v.createdAt,
  }));

  const totalVouchers = allVouchers.length;
  const usedVouchers = allVouchers.filter((v: any) => v.isUsed).length;
  const availableVouchers = totalVouchers - usedVouchers;
  const expiringSoon = allVouchers.filter((v: any) => {
    if (!v.expiryDate) return false;
    const days = Math.ceil(
      (new Date(v.expiryDate).getTime() - Date.now()) / 86400000,
    );
    return days <= 7 && days > 0;
  }).length;
  const utilRate =
    totalVouchers > 0 ? Math.round((usedVouchers / totalVouchers) * 100) : 0;

  // ── Inventory computed ──
  const inventoryItems = rewards.filter((r: any) => r.inventoryRequired) || [];
  const totalTracked = inventoryItems.length;
  const lowStockCount = inventoryItems.filter(
    (r: any) => r.remainingStock !== undefined && r.remainingStock <= 10,
  ).length;
  const healthyCount = totalTracked - lowStockCount;

  // ── Voucher handlers ──
  const handleMarkAsUsed = async (voucherId: string) => {
    try {
      await markAsUsed({ variables: { voucherId } });
      toast({ title: "Voucher marked as used" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to mark voucher as used.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (voucherId: string) => {
    try {
      await deleteVoucher({ variables: { voucherId } });
      toast({ title: "Voucher deleted" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete voucher.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csv = [
      ["Code", "Reward", "Status", "Assigned To", "Expiry Date", "Created At"],
      ...mappedVouchers.map((v) => [
        v.code,
        v.rewardTitle || "",
        v.isUsed ? "Used" : "Available",
        v.assignedTo || "",
        v.expiryDate || "",
        v.createdAt,
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vouchers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Inventory handlers ──
  const parseCSV = (text: string): ParsedVoucher[] => {
    const lines = text.split("\n").filter((l) => l.trim());
    const start = lines[0]?.toLowerCase().includes("code") ? 1 : 0;
    return lines
      .slice(start)
      .map((line) => {
        const [code, amount, expiryDate] = line.split(",").map((c) => c.trim());
        const v: ParsedVoucher = { code, amount, expiryDate, isValid: true };
        if (!code || code.length < 4) {
          v.isValid = false;
          v.error = "Code too short (min 4 chars)";
        }
        if (expiryDate) {
          const d = new Date(expiryDate);
          if (isNaN(d.getTime())) {
            v.isValid = false;
            v.error = "Invalid date";
          } else if (d < new Date()) {
            v.isValid = false;
            v.error = "Already expired";
          }
        }
        return v;
      })
      .filter((v) => v.code);
  };

  const handleFileSelect = (file: File) => {
    if (!uploadRewardId) {
      toast({
        title: "Select a reward first",
        description: "Choose which reward these codes belong to.",
        variant: "destructive",
      });
      return;
    }
    if (!file.name.endsWith(".csv")) {
      toast({
        title: "CSV files only",
        description: "Please upload a .csv file.",
        variant: "destructive",
      });
      return;
    }
    setUploadedFile(file);
    setUploadStep("validating");
    const reader = new FileReader();
    reader.onload = (e) => {
      setParsedVouchers(parseCSV(e.target?.result as string));
      setTimeout(() => setUploadStep("summary"), 800);
    };
    reader.readAsText(file);
  };

  const confirmUpload = async () => {
    try {
      const validCodes = parsedVouchers
        .filter((v) => v.isValid)
        .map((v) => v.code);
      await uploadVouchers({
        variables: {
          input: { rewardId: uploadRewardId, vouchers: validCodes },
        },
        refetchQueries: [
          {
            query: GET_VOUCHERS,
            variables: { rewardId: uploadRewardId },
          },
        ],
      });
      toast({
        title: `${validCodes.length} vouchers uploaded`,
        description: "Codes are now available for redemption.",
      });
      resetUpload();
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const resetUpload = () => {
    setIsUploadOpen(false);
    setUploadStep("idle");
    setUploadedFile(null);
    setParsedVouchers([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openUploadForReward = (rewardId: string) => {
    setUploadRewardId(rewardId);
    setIsUploadOpen(true);
  };

  const downloadTemplate = () => {
    const csv =
      "voucherCode,amount,expiryDate\nSAMPLE-001,100,2026-12-31\nSAMPLE-002,200,2026-12-31";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: "voucher-template.csv",
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = parsedVouchers.filter((v) => v.isValid).length;
  const invalidCount = parsedVouchers.length - validCount;

  // ── Tab definitions ──
  const tabs = [
    { key: "rewards" as const, label: "Rewards", count: rewards.length },
    {
      key: "codes" as const,
      label: "Voucher Codes",
      count: totalVouchers,
    },
    {
      key: "inventory" as const,
      label: "Inventory",
      count: totalTracked,
    },
  ];

  // ── Render ──
  return (
    <EcosystemWrapper className="min-h-screen">
      <EcosystemHeader
        title="Rewards & Codes"
        description="Manage reward offers, voucher codes, and stock levels — all in one place."
        badgeText="Reward Collection"
        icon={Ticket}
      />

      {/* ── Tab bar ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border/50 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === tab.key
                ? "bg-card text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "inline-flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full text-[10px] font-bold tabular-nums",
                activeTab === tab.key
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          REWARDS TAB
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === "rewards" && (
        <>
          <EcosystemActionBar
            shadow="none"
            className="bg-transparent border-none p-0"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rewards..."
                  className="pl-10 h-9 bg-card border-border/60 rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-muted rounded-lg p-0.5 border border-border/50">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "h-7 w-7 rounded-md flex items-center justify-center transition-all",
                      viewMode === "grid"
                        ? "bg-card shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "h-7 w-7 rounded-md flex items-center justify-center transition-all",
                      viewMode === "list"
                        ? "bg-card shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <LayoutList className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Link href="/rewards/coupons/create">
                  <Button size="sm" className="h-9 px-4 gap-2 font-semibold">
                    <Plus className="h-3.5 w-3.5" />
                    New Reward
                  </Button>
                </Link>
              </div>
            </div>
            {/* Filter chips */}
            <div className="flex items-center gap-2 mt-1 overflow-x-auto pb-0.5 flex-wrap">
              {FILTER_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap",
                    activeFilter === f
                      ? "bg-foreground text-background border-foreground shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground",
                  )}
                >
                  {f}
                  <span
                    className={cn(
                      "inline-flex h-4 min-w-4 px-1 rounded-full text-[10px] font-bold items-center justify-center",
                      activeFilter === f ? "bg-white/20" : "bg-muted",
                    )}
                  >
                    {categoryCounts[f] || 0}
                  </span>
                </button>
              ))}
            </div>
          </EcosystemActionBar>

          <EcosystemContainer className="p-5 mt-6 pb-20">
            {rewardsLoading ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-card rounded-2xl p-4 border border-border animate-pulse"
                    >
                      <div className="aspect-[4/3] bg-muted rounded-xl mb-4" />
                      <div className="space-y-2.5">
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 bg-card rounded-xl border border-border animate-pulse"
                    >
                      <Skeleton className="h-14 w-14 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-1/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                      <Skeleton className="h-8 w-20 rounded-lg" />
                    </div>
                  ))}
                </div>
              )
            ) : filteredRewards.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredRewards.map((reward: any) => {
                    const type = getInteractionType(reward.category);
                    const badge = getInteractiveBadge(type);
                    const BadgeIcon = badge.icon;
                    return (
                      <div
                        key={reward.id}
                        className="group relative bg-card rounded-2xl border border-border/60 hover:border-indigo-300/60 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900">
                          {reward.image ? (
                            <img
                              src={reward.image}
                              alt={reward.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="h-full w-full flex flex-col items-center justify-center opacity-20">
                              <Ticket className="h-10 w-10 mb-1.5" />
                              <span className="text-[9px] font-bold uppercase tracking-widest">
                                No Image
                              </span>
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <div
                              className={cn(
                                "flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm",
                                badge.color,
                              )}
                            >
                              <BadgeIcon className="h-2.5 w-2.5" />
                              {badge.label}
                            </div>
                          </div>
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wide">
                            {reward.inventory ?? "∞"} left
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-[1px]">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-9 w-9 rounded-full scale-90 group-hover:scale-100 transition-transform shadow-lg"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                            <Link href={`/rewards/coupons/edit/${reward.id}`}>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-9 w-9 rounded-full scale-90 group-hover:scale-100 transition-transform delay-75 shadow-lg"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                            {reward.inventoryRequired && (
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-9 w-9 rounded-full scale-90 group-hover:scale-100 transition-transform delay-100 shadow-lg"
                                onClick={() => openUploadForReward(reward.id)}
                              >
                                <Upload className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-indigo-600 transition-colors">
                              {reward.title}
                            </h3>
                            {reward.description && (
                              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                {reward.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-border/50">
                            <div className="flex items-center gap-1.5">
                              <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center">
                                <Zap className="h-3 w-3 text-orange-600 fill-current" />
                              </div>
                              <span className="text-xs font-black text-foreground tabular-nums">
                                {reward.tcRequired || 0} pts
                              </span>
                            </div>
                            {reward.expiryDays && (
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70 font-medium">
                                <Clock className="h-3 w-3" />
                                {reward.expiryDays}d
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredRewards.map((reward: any) => {
                    const type = getInteractionType(reward.category);
                    const badge = getInteractiveBadge(type);
                    const BadgeIcon = badge.icon;
                    return (
                      <div
                        key={reward.id}
                        className="group flex items-center gap-4 p-4 bg-card rounded-xl border border-border/60 hover:border-indigo-300/50 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 border border-border/50 overflow-hidden shrink-0">
                          {reward.image ? (
                            <img
                              src={reward.image}
                              alt={reward.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center opacity-20">
                              <Ticket className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-indigo-600 transition-colors">
                              {reward.title}
                            </h3>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wide shrink-0",
                                badge.chip,
                              )}
                            >
                              <BadgeIcon className="h-2.5 w-2.5" />
                              {badge.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-orange-500" />
                              {reward.tcRequired || 0} points
                            </span>
                            {reward.expiryDays && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {reward.expiryDays} days
                              </span>
                            )}
                            <span>
                              {reward.inventory ?? "Unlimited"} remaining
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {reward.inventoryRequired && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-3 gap-1.5 text-xs rounded-lg"
                              onClick={() => openUploadForReward(reward.id)}
                            >
                              <Upload className="h-3 w-3" />
                              Upload
                            </Button>
                          )}
                          <Link href={`/rewards/coupons/edit/${reward.id}`}>
                            <Button
                              size="sm"
                              className="h-8 px-3 gap-1.5 text-xs rounded-lg"
                            >
                              <Pencil className="h-3 w-3" />
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center space-y-5">
                <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center border border-border">
                  <Search className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-foreground">
                    {searchQuery ? "No results found" : "No rewards yet"}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                    {searchQuery
                      ? `No rewards match "${searchQuery}". Try a different search.`
                      : "Create your first reward to start engaging your community."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {searchQuery && (
                    <Button
                      onClick={() => setSearchQuery("")}
                      variant="outline"
                      className="rounded-xl px-5 h-9 text-sm"
                    >
                      Clear search
                    </Button>
                  )}
                  <Link href="/rewards/coupons/create">
                    <Button className="rounded-xl px-5 h-9 text-sm gap-2">
                      <Plus className="h-3.5 w-3.5" />
                      Create reward
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </EcosystemContainer>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          VOUCHER CODES TAB
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === "codes" && (
        <>
          <EcosystemActionBar shadow="none">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search code or reward..."
                  value={codeSearch}
                  onChange={(e) => setCodeSearch(e.target.value)}
                  className="w-full pl-9 pr-3 h-9 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-9 text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
              <Select value={rewardFilter} onValueChange={setRewardFilter}>
                <SelectTrigger className="w-[160px] h-9 text-sm">
                  <SelectValue placeholder="All Rewards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rewards</SelectItem>
                  {rewards.map((reward: any) => (
                    <SelectItem key={reward.id} value={reward.id}>
                      {reward.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="sm:ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="gap-2 h-9"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </Button>
              </div>
            </div>
          </EcosystemActionBar>

          <EcosystemContainer className="p-6 space-y-6 pb-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Codes",
                  value: totalVouchers,
                  icon: Ticket,
                  color: "text-indigo-600",
                  bg: "bg-indigo-50",
                  desc: "All voucher codes",
                },
                {
                  label: "Available",
                  value: availableVouchers,
                  icon: CheckCircle2,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                  desc: "Ready to be claimed",
                },
                {
                  label: "Redeemed",
                  value: usedVouchers,
                  icon: History,
                  color: "text-slate-600",
                  bg: "bg-slate-100",
                  desc: `${utilRate}% utilization`,
                },
                {
                  label: "Expiring Soon",
                  value: expiringSoon,
                  icon: expiringSoon > 0 ? AlertTriangle : Clock,
                  color:
                    expiringSoon > 0 ? "text-rose-600" : "text-emerald-600",
                  bg: expiringSoon > 0 ? "bg-rose-50" : "bg-emerald-50",
                  desc: expiringSoon > 0 ? "Within 7 days" : "None expiring",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
                >
                  <div
                    className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center border border-border/50 shrink-0",
                      s.bg,
                    )}
                  >
                    <s.icon className={cn("h-4 w-4", s.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                      {s.label}
                    </p>
                    <p className="text-xl font-bold text-foreground tabular-nums">
                      {s.value}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 truncate">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {totalVouchers > 0 && (
              <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">
                    Voucher Utilization
                  </span>
                  <span className="text-muted-foreground">
                    {usedVouchers} / {totalVouchers} used ({utilRate}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      utilRate >= 80
                        ? "bg-rose-500"
                        : utilRate >= 50
                          ? "bg-amber-500"
                          : "bg-indigo-500",
                    )}
                    style={{ width: `${utilRate}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  Voucher Inventory
                </h2>
                {!vouchersLoading && (
                  <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted border border-border rounded-full">
                    {filteredVouchers.length} codes
                  </span>
                )}
              </div>
              <VoucherManagementTable
                vouchers={mappedVouchers}
                isLoading={vouchersLoading}
                onViewDetails={(v) => {
                  setSelectedVoucher(v);
                  setIsDetailsOpen(true);
                }}
                onMarkAsUsed={handleMarkAsUsed}
                onDelete={handleDelete}
              />
            </div>
          </EcosystemContainer>

          <VoucherDetailsDialog
            voucher={selectedVoucher}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            onMarkAsUsed={handleMarkAsUsed}
            onDelete={handleDelete}
          />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          INVENTORY TAB
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === "inventory" && (
        <>
          <EcosystemActionBar shadow="none">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5" />
              <span>{totalTracked} rewards tracked</span>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                className="gap-2"
              >
                <FileDown className="h-3.5 w-3.5" />
                Download Template
              </Button>
              <Button
                size="sm"
                onClick={() => setIsUploadOpen(true)}
                className="gap-2"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload Codes
              </Button>
            </div>
          </EcosystemActionBar>

          <EcosystemContainer className="p-6 space-y-6 pb-20">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "Tracked Rewards",
                  value: rewardsLoading ? "—" : totalTracked,
                  desc: "Have inventory control",
                  icon: Package,
                  color: "text-indigo-600",
                  bg: "bg-indigo-50",
                },
                {
                  label: "Healthy Stock",
                  value: rewardsLoading ? "—" : healthyCount,
                  desc: "Above minimum threshold",
                  icon: CheckCircle2,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  label: "Low Stock",
                  value: rewardsLoading ? "—" : lowStockCount,
                  desc:
                    lowStockCount > 0 ? "Need restocking" : "All well stocked",
                  icon: AlertTriangle,
                  color: lowStockCount > 0 ? "text-rose-600" : "text-slate-500",
                  bg: lowStockCount > 0 ? "bg-rose-50" : "bg-slate-100",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card"
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-border/50",
                      stat.bg,
                    )}
                  >
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground tabular-nums leading-tight">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70">
                      {stat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Inventory table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-foreground">
                  Inventory Items
                </h2>
                <span className="text-xs text-muted-foreground">
                  {rewards.length} total rewards
                </span>
              </div>
              <InventoryTable
                items={inventoryItems}
                isLoading={rewardsLoading}
              />
            </div>
          </EcosystemContainer>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          UPLOAD DIALOG (shared across tabs)
         ══════════════════════════════════════════════════════════════ */}
      <Dialog
        open={isUploadOpen}
        onOpenChange={(o) => {
          if (!o) resetUpload();
          else setIsUploadOpen(true);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <Upload className="h-4 w-4 text-indigo-600" />
              </div>
              Upload Voucher Codes
            </DialogTitle>
            <DialogDescription>
              Select a reward and upload a CSV. Columns:{" "}
              <code className="text-[11px] bg-muted px-1 py-0.5 rounded font-mono">
                voucherCode, amount, expiryDate
              </code>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Reward Select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Assign to Reward
              </Label>
              <Select value={uploadRewardId} onValueChange={setUploadRewardId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Choose a reward..." />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.length === 0 ? (
                    <div className="py-3 px-3 text-xs text-muted-foreground text-center">
                      No rewards with inventory tracking enabled
                    </div>
                  ) : (
                    inventoryItems.map((item: any) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Drop Zone */}
            {uploadStep === "idle" && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                  }}
                />
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all",
                    isDragging
                      ? "border-indigo-400 bg-indigo-50/50"
                      : "border-border hover:border-indigo-300 hover:bg-muted/20",
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const f = e.dataTransfer.files[0];
                    if (f) handleFileSelect(f);
                  }}
                >
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {isDragging ? "Drop file here" : "Click or drag CSV here"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Max 10MB · up to 10,000 codes
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                  <Info className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-relaxed">
                    Download the template to ensure your CSV is correctly
                    formatted before uploading.
                  </p>
                </div>
              </>
            )}

            {/* Validating */}
            {uploadStep === "validating" && (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Validating your file...
                </p>
              </div>
            )}

            {/* Summary */}
            {uploadStep === "summary" && (
              <div className="space-y-3">
                {uploadedFile && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 rounded-lg"
                      onClick={resetUpload}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xl font-bold text-emerald-900 dark:text-emerald-300 tabular-nums">
                        {validCount}
                      </p>
                      <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
                        ready to upload
                      </p>
                    </div>
                  </div>
                  {invalidCount > 0 && (
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-500/20">
                      <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                      <div>
                        <p className="text-xl font-bold text-rose-900 dark:text-rose-300 tabular-nums">
                          {invalidCount}
                        </p>
                        <p className="text-[11px] text-rose-700/80 dark:text-rose-400/80">
                          with errors (skipped)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {invalidCount > 0 && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border space-y-1.5 max-h-28 overflow-y-auto">
                    <p className="text-[10px] font-bold text-foreground uppercase tracking-wide">
                      Error details
                    </p>
                    {parsedVouchers
                      .filter((v) => !v.isValid)
                      .slice(0, 5)
                      .map((v, i) => (
                        <p
                          key={i}
                          className="text-xs text-rose-600 flex items-center gap-1.5"
                        >
                          <span className="h-1 w-1 rounded-full bg-rose-400 shrink-0" />
                          <span className="font-mono text-[10px]">
                            {v.code}
                          </span>
                          : {v.error}
                        </p>
                      ))}
                    {invalidCount > 5 && (
                      <p className="text-xs text-muted-foreground">
                        ...and {invalidCount - 5} more
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={resetUpload}
              disabled={uploading}
              className="rounded-lg"
            >
              Cancel
            </Button>
            {uploadStep === "summary" && validCount > 0 && (
              <Button
                onClick={confirmUpload}
                disabled={uploading}
                className="gap-2 rounded-lg"
              >
                {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Upload {validCount} codes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
