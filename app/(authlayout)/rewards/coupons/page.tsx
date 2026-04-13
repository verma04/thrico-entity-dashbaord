"use client";

import React, { useState, useRef, useMemo } from "react";
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
  const { data: rewardsData, loading: rewardsLoading, refetch: refetchRewards } = useGetRewards({
    pagination: { page: 1, limit: 100 },
  });
  const { data: vouchersData, loading: vouchersLoading, refetch: refetchVouchers } = useGetAllVouchers({
    status: statusFilter === "all" ? undefined : statusFilter,
    rewardId: rewardFilter === "all" ? undefined : rewardFilter,
  });
  const [markAsUsed] = useMarkVoucherAsUsed();
  const [deleteVoucher] = useDeleteVoucher();
  const [uploadVouchers, { loading: uploading }] = useUploadVouchers();

  const rewards = rewardsData?.getRewards || [];
  const allVouchers = vouchersData?.getAllVouchers || [];

  // ── Rewards computed ──
  const filteredRewards = useMemo(() => {
    return rewards.filter((r: any) => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (activeFilter === "All") return true;
      return getInteractionType(r.category) === activeFilter;
    });
  }, [rewards, searchQuery, activeFilter]);

  const categoryCounts: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = { All: rewards.length };
    rewards.forEach((r: any) => {
      const t = getInteractionType(r.category);
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [rewards]);

  // ── Vouchers computed ──
  const filteredVouchers = useMemo(() => {
    return allVouchers.filter(
      (v: any) =>
        v.code.toLowerCase().includes(codeSearch.toLowerCase()) ||
        v.reward?.title?.toLowerCase().includes(codeSearch.toLowerCase()),
    );
  }, [allVouchers, codeSearch]);

  const mappedVouchers: Voucher[] = useMemo(() => {
    return filteredVouchers.map((v: any) => ({
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
  }, [filteredVouchers]);

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
  const inventoryItems = useMemo(() => {
    return rewards.filter((r: any) => r.inventoryRequired) || [];
  }, [rewards]);
  const totalTracked = inventoryItems.length;
  const lowStockCount = useMemo(() => {
    return inventoryItems.filter(
      (r: any) => r.remainingStock !== undefined && r.remainingStock <= 10,
    ).length;
  }, [inventoryItems]);
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
    { key: "rewards" as const, label: "Rewards Gallery", count: rewards.length },
    {
      key: "codes" as const,
      label: "Credential Codes",
      count: totalVouchers,
    },
    {
      key: "inventory" as const,
      label: "Stock Controller",
      count: totalTracked,
    },
  ];

  // ── Render ──
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Rewards & Vouchers"
        description="Monitor reward distribution lifecycle, manage voucher credentials and inventory stock levels from a unified interface."
        badgeText="Economic Hub"
        icon={Ticket}
      />

      <EcosystemActionBar shadow="none">
         <EcosystemActionBar.Group>
            <EcosystemActionBar.Item grow className="max-w-md">
               <div className="flex items-center gap-1 bg-zinc-100/50 p-1 rounded-xl border border-zinc-200/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200",
                      activeTab === tab.key
                        ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/50"
                        : "text-zinc-500 hover:text-zinc-800 hover:bg-white/50"
                    )}
                  >
                    {tab.label}
                    <span
                      className={cn(
                        "inline-flex h-4 min-w-[16px] px-1 items-center justify-center rounded-md text-[9px] font-black tabular-nums transition-colors",
                        activeTab === tab.key
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-200 text-zinc-600"
                      )}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </EcosystemActionBar.Item>
         </EcosystemActionBar.Group>

         <EcosystemActionBar.Group align="right">
            {activeTab === "rewards" ? (
               <EcosystemActionBar.Item>
                  <Link href="/rewards/coupons/create">
                    <Button size="sm" className="h-9 px-4 rounded-xl gap-2 font-black uppercase tracking-tighter shadow-md ring-1 ring-black/5">
                      <Plus className="h-4 w-4" />
                      Create Master Reward
                    </Button>
                  </Link>
               </EcosystemActionBar.Item>
            ) : activeTab === "inventory" ? (
               <>
                 <EcosystemActionBar.Item>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadTemplate}
                      className="h-9 rounded-xl gap-2 text-xs font-bold border-border bg-card"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                      Template
                    </Button>
                 </EcosystemActionBar.Item>
                 <EcosystemActionBar.Item>
                    <Button
                      size="sm"
                      onClick={() => setIsUploadOpen(true)}
                      className="h-9 rounded-xl gap-2 text-xs font-bold shadow-sm"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Batch Upload
                    </Button>
                 </EcosystemActionBar.Item>
               </>
            ) : (
                <EcosystemActionBar.Item>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="h-9 rounded-xl gap-2 text-xs font-bold border-border bg-card shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Data Export
                  </Button>
                </EcosystemActionBar.Item>
            )}

            <EcosystemActionBar.Item>
              <Button
                variant="outline"
                size="icon"
                onClick={() => { refetchRewards(); refetchVouchers(); }}
                className="h-9 w-9 rounded-xl border-border bg-card text-muted-foreground hover:text-foreground"
              >
                <RotateCw size={14} className={cn(rewardsLoading || vouchersLoading ? "animate-spin" : "")} />
              </Button>
            </EcosystemActionBar.Item>
         </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Sub-ActionBar for search/filters per tab ──────────────── */}
      <EcosystemActionBar shadow="none" className="bg-transparent border-none py-0 -mt-2">
         {activeTab === "rewards" && (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between w-full">
                <div className="relative flex-1 max-w-sm">
                   <EcosystemActionBar.Search 
                     value={searchQuery}
                     onChange={setSearchQuery}
                     placeholder="Filter master rewards..."
                   />
                </div>
                <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/40 gap-1 ml-4 shadow-inner">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "h-8 px-2.5 rounded-lg flex items-center justify-center transition-all duration-300",
                      viewMode === "grid"
                        ? "bg-white shadow-sm ring-1 ring-black/[0.05] text-indigo-600"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/50",
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "h-8 px-2.5 rounded-lg flex items-center justify-center transition-all duration-300",
                      viewMode === "list"
                        ? "bg-white shadow-sm ring-1 ring-black/[0.05] text-indigo-600"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/50",
                    )}
                  >
                    <LayoutList className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {FILTER_OPTIONS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={cn(
                      "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tight border transition-all duration-200",
                      activeFilter === f
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                        : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-800",
                    )}
                  >
                    {f}
                    <span className={cn(
                      "inline-flex h-4 min-w-[16px] px-1 rounded-md text-[9px] font-black items-center justify-center transition-colors",
                      activeFilter === f ? "bg-white/20" : "bg-muted"
                    )}>
                      {categoryCounts[f] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
         )}

         {activeTab === "codes" && (
            <div className="flex flex-col gap-3 w-full">
               <div className="flex items-center gap-3 w-full">
                  <div className="relative flex-1 max-w-sm">
                     <EcosystemActionBar.Search 
                       value={codeSearch}
                       onChange={setCodeSearch}
                       placeholder="Find specific code..."
                     />
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px] h-9 rounded-xl border-border bg-card text-xs font-bold">
                        <div className="flex items-center gap-2">
                          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                          <SelectValue placeholder="All Status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl p-1 shadow-xl border-border">
                        <SelectItem value="all" className="rounded-lg text-xs font-semibold py-2">All Status</SelectItem>
                        <SelectItem value="available" className="rounded-lg text-xs font-semibold py-2">Available</SelectItem>
                        <SelectItem value="used" className="rounded-lg text-xs font-semibold py-2">Redeemed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={rewardFilter} onValueChange={setRewardFilter}>
                      <SelectTrigger className="w-[180px] h-9 rounded-xl border-border bg-card text-xs font-bold">
                        <div className="flex items-center gap-2">
                           <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
                           <SelectValue placeholder="All Rewards" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl p-1 shadow-xl border-border">
                        <SelectItem value="all" className="rounded-lg text-xs font-semibold py-2">All Master Rewards</SelectItem>
                        {rewards.map((reward: any) => (
                          <SelectItem key={reward.id} value={reward.id} className="rounded-lg text-xs font-semibold py-2">
                            {reward.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
               </div>
            </div>
         )}

         {activeTab === "inventory" && (
            <div className="flex items-center gap-4 px-1 py-1 bg-indigo-50/50 border border-indigo-100/50 rounded-xl w-full">
               <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-indigo-100">
                  <Package className="h-4 w-4 text-indigo-500" />
               </div>
               <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold text-indigo-700 tracking-tighter uppercase whitespace-nowrap">Inventory Status Nexus:</span>
                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-indigo-600/70">{healthyCount} Healthy</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-[10px] font-black text-indigo-600/70">{lowStockCount} Critical</span>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 pb-20">
         {activeTab === "rewards" && (
            <div className="px-6 py-4">
               {rewardsLoading ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-card rounded-2xl p-4 border border-border animate-pulse">
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
                    <div className="space-y-3">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-card rounded-2xl border border-border animate-pulse">
                          <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-3 w-1/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-3 w-1/3" />
                          </div>
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
                          <div key={reward.id} className="group relative bg-card rounded-2xl border border-border hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/[0.03] transition-all duration-500 overflow-hidden">
                            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50 border-b border-border/50">
                              {reward.image ? (
                                <img
                                  src={reward.image}
                                  alt={reward.title}
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                              ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center opacity-10">
                                  <Ticket className="h-12 w-12 mb-2" />
                                </div>
                              )}
                              <div className="absolute top-2.5 left-2.5">
                                <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md ring-1 ring-black/5", badge.color)}>
                                  <BadgeIcon className="h-2.5 w-2.5" />
                                  {badge.label}
                                </div>
                              </div>
                              <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest border border-white/10 shadow-lg">
                                {reward.inventory ?? "∞"} Unit
                              </div>
                              <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                <Link href={`/rewards/coupons/edit/${reward.id}`}>
                                   <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl shadow-2xl ring-1 ring-black/10 hover:scale-110 transition-transform">
                                      <Pencil className="h-4 w-4" />
                                   </Button>
                                </Link>
                                {reward.inventoryRequired && (
                                  <Button onClick={() => openUploadForReward(reward.id)} size="icon" variant="secondary" className="h-10 w-10 rounded-xl shadow-2xl ring-1 ring-black/10 hover:scale-110 transition-transform">
                                     <Upload className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="p-4 space-y-3">
                              <div className="min-h-[40px]">
                                <h3 className="text-[13px] font-black text-foreground line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                  {reward.title}
                                </h3>
                                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-tight font-medium opacity-70">
                                  {reward.description || "No categorical description defined for this reward nexus."}
                                </p>
                              </div>
                              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                                <div className="flex items-center gap-1.5">
                                  <div className="h-5 w-5 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
                                    <Zap className="h-2.5 w-2.5 text-amber-500 fill-current" />
                                  </div>
                                  <span className="text-[11px] font-black text-foreground tabular-nums">
                                    {reward.tcRequired || 0} PTS
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                   <div className="h-4 w-px bg-border/50" />
                                   <Link href={`/rewards/coupons/edit/${reward.id}`} className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline underline-offset-4"> Manage Node </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredRewards.map((reward: any) => {
                        const type = getInteractionType(reward.category);
                        const badge = getInteractiveBadge(type);
                        const BadgeIcon = badge.icon;
                        return (
                          <div key={reward.id} className="group flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/[0.02] transition-all duration-300">
                            <div className="h-14 w-14 rounded-xl bg-zinc-50 border border-border/60 overflow-hidden shrink-0 shadow-sm ring-1 ring-black/[0.03]">
                              {reward.image ? (
                                <img src={reward.image} alt={reward.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center opacity-10">
                                  <Ticket className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-black text-foreground truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                  {reward.title}
                                </h3>
                                <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest shrink-0", badge.chip)}>
                                  <BadgeIcon className="h-2.5 w-2.5" />
                                  {badge.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-tighter">
                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-muted rounded">
                                  <Zap className="h-2.5 w-2.5 text-amber-500" />
                                  {reward.tcRequired || 0} Points Required
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-2.5 w-2.5 text-indigo-400" />
                                  {reward.expiryDays || "No"} Expiry Cycle
                                </span>
                                <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[8px] font-black">
                                  STOCK: {reward.inventory ?? "∞"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              {reward.inventoryRequired && (
                                <Button onClick={() => openUploadForReward(reward.id)} variant="outline" size="sm" className="h-8 px-4 gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl border-border bg-card">
                                  <Upload className="h-3.5 w-3.5" /> Upload Batch
                                </Button>
                              )}
                              <Link href={`/rewards/coupons/edit/${reward.id}`}>
                                <Button size="sm" className="h-8 px-4 gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md">
                                  <Pencil className="h-3.5 w-3.5" /> Edit Offer
                                </Button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <div className="py-32 flex flex-col items-center justify-center text-center">
                    <div className="h-24 w-24 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-2xl flex items-center justify-center mb-8 rotate-3">
                      <Ticket className="h-10 w-10 text-indigo-300" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                      <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
                        Offer Nexus Offline
                      </h3>
                      <p className="text-[13px] text-muted-foreground leading-relaxed font-medium">
                        {searchQuery ? `The filter query "${searchQuery}" yielded zero results across your reward collection.` : "Your economic engine is currently idle. Define your first master reward offer to begin the exchange lifecycle."}
                      </p>
                    </div>
                    <div className="mt-8">
                       <Link href="/rewards/coupons/create">
                          <Button className="h-11 px-8 rounded-2xl gap-3 font-black uppercase tracking-widest shadow-xl ring-1 ring-black/10">
                             <Plus className="h-5 w-5" /> Initialize Reward
                          </Button>
                       </Link>
                    </div>
                  </div>
                )}
            </div>
         )}

         {activeTab === "codes" && (
            <div className="px-6 space-y-6">
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  {[
                    { label: "Total Capacity", value: totalVouchers, icon: Ticket, color: "text-indigo-600", bg: "bg-indigo-50", desc: "Digital Assets Logged" },
                    { label: "Market Ready", value: availableVouchers, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", desc: "Available for Emission" },
                    { label: "Redemption Flow", value: usedVouchers, icon: History, color: "text-slate-600", bg: "bg-slate-50", desc: `${utilRate}% Consumption` },
                    { label: "Critical Expiry", value: expiringSoon, icon: AlertTriangle, color: expiringSoon > 0 ? "text-rose-600" : "text-zinc-400", bg: expiringSoon > 0 ? "bg-rose-50" : "bg-zinc-50", desc: expiringSoon > 0 ? "T-Minus 7 Days" : "No Impending Expiry" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/[0.02]">
                      <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center border border-border/40 shrink-0 shadow-inner", s.bg)}>
                        <s.icon className={cn("h-5 w-5", s.color)} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate">{s.label}</p>
                        <p className="text-2xl font-black text-foreground tabular-nums leading-none mt-1">{s.value}</p>
                        <p className="text-[10px] font-bold text-muted-foreground/60 truncate mt-1">{s.desc}</p>
                      </div>
                    </div>
                  ))}
               </div>

               {totalVouchers > 0 && (
                  <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <span className="text-[11px] font-black text-foreground uppercase tracking-widest">Inventory Saturation</span>
                         <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                      </div>
                      <span className="text-[11px] font-bold text-muted-foreground tabular-nums">
                        {usedVouchers} OF {totalVouchers} CONSUMED ({utilRate}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-1000", utilRate >= 85 ? "bg-rose-500" : utilRate >= 60 ? "bg-amber-500" : "bg-indigo-600")} style={{ width: `${utilRate}%` }} />
                    </div>
                  </div>
               )}

               <div className="space-y-3">
                  <VoucherManagementTable
                    vouchers={mappedVouchers}
                    isLoading={vouchersLoading}
                    onViewDetails={(v) => { setSelectedVoucher(v); setIsDetailsOpen(true); }}
                    onMarkAsUsed={handleMarkAsUsed}
                    onDelete={handleDelete}
                  />
               </div>
            </div>
         )}

         {activeTab === "inventory" && (
            <div className="px-6 space-y-6 mt-4">
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Active Tracking", value: totalTracked, desc: "Rewards with inventory logic", icon: Package, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Optimal Logic", value: healthyCount, desc: "Stock above safety margin", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Critical Stock", value: lowStockCount, desc: lowStockCount > 0 ? "Immediate restock required" : "All nodes fully saturated", icon: AlertTriangle, color: lowStockCount > 0 ? "text-rose-600" : "text-zinc-400", bg: lowStockCount > 0 ? "bg-rose-50" : "bg-zinc-50" },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/[0.02]">
                      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border border-border/40 shadow-inner", stat.bg)}>
                        <stat.icon className={cn("h-6 w-6", stat.color)} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.1em]">{stat.label}</p>
                        <p className="text-2xl font-black text-foreground tabular-nums leading-tight mt-1">{stat.value}</p>
                        <p className="text-[10px] font-bold text-muted-foreground/70">{stat.desc}</p>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="space-y-3">
                  <InventoryTable items={inventoryItems} isLoading={rewardsLoading} />
               </div>
            </div>
         )}
      </EcosystemContainer>

      {/* ── Auxiliary Components ──────── */}
      <VoucherDetailsDialog
        voucher={selectedVoucher}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onMarkAsUsed={handleMarkAsUsed}
        onDelete={handleDelete}
      />

      <Dialog open={isUploadOpen} onOpenChange={(o) => { if (!o) resetUpload(); else setIsUploadOpen(true); }}>
        <DialogContent className="sm:max-w-lg rounded-[2rem] border-border shadow-2xl p-0 overflow-hidden">
          <div className="p-8 space-y-6">
            <DialogHeader className="text-left">
               <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
                    <Upload className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-black uppercase tracking-tight">Mass Ingestion</DialogTitle>
                    <DialogDescription className="text-xs font-medium text-muted-foreground mt-1">
                       Feed unique voucher credentials into your economic engine via CSV protocol.
                    </DialogDescription>
                  </div>
               </div>
            </DialogHeader>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest px-1">Source Destination Reward</Label>
                <Select value={uploadRewardId} onValueChange={setUploadRewardId}>
                  <SelectTrigger className="h-12 rounded-2xl border-border bg-zinc-50 font-bold focus:ring-2 focus:ring-indigo-500/20">
                    <SelectValue placeholder="Targeting Reward Node..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl p-1 shadow-2xl border-border">
                    {inventoryItems.map((item: any) => (
                      <SelectItem key={item.id} value={item.id} className="rounded-xl py-2.5 font-bold text-sm">
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {uploadStep === "idle" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
                  <div className={cn("border-2 border-dashed rounded-3xl p-10 flex flex-col items-center gap-4 cursor-pointer transition-all duration-500 group", isDragging ? "border-indigo-400 bg-indigo-50/50 scale-[1.02]" : "border-border hover:border-indigo-300 hover:bg-zinc-50")} onClick={() => fileInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}>
                    <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-border group-hover:scale-110 transition-transform">
                      <FileDown className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-black text-foreground uppercase tracking-tight">{isDragging ? "Protocol Accepted: Drop Now" : "Establish Link: Click or Drop CSV"}</p>
                      <p className="text-[10px] font-bold text-muted-foreground/60 mt-1 uppercase tracking-widest">Supports up to 50,000 Unique Entries</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100/50">
                    <Info className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                       Download our <span onClick={downloadTemplate} className="text-indigo-600 font-black cursor-pointer hover:underline">Voucher Schema Template</span> to ensure seamless ingestion and prevent allocation errors during the upload cycle.
                    </p>
                  </div>
                </div>
              )}

              {uploadStep === "validating" && (
                <div className="flex flex-col items-center justify-center py-12 gap-5 animate-pulse">
                  <div className="h-16 w-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-inner">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  </div>
                  <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Validating Integrity...</p>
                </div>
              )}

              {uploadStep === "summary" && (
                <div className="space-y-4 animate-in zoom-in-95 duration-500">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-inner">
                    <div className="h-10 w-10 rounded-xl bg-white border border-border flex items-center justify-center shadow-sm">
                       <FileText className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-black text-foreground truncate uppercase tracking-tight">{uploadedFile?.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Checksum Passed · {(uploadedFile!.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors" onClick={resetUpload}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl shadow-sm">
                       <span className="text-2xl font-black text-emerald-600 tabular-nums">{validCount}</span>
                       <p className="text-[9px] font-black text-emerald-700/70 uppercase tracking-widest mt-1 leading-none">Accepted Records</p>
                    </div>
                    {invalidCount > 0 && (
                      <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl shadow-sm">
                         <span className="text-2xl font-black text-rose-600 tabular-nums">{invalidCount}</span>
                         <p className="text-[9px] font-black text-rose-700/70 uppercase tracking-widest mt-1 leading-none">Invalid Signals</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-50 p-6 flex items-center justify-end gap-3 border-t border-border/50">
            <Button variant="ghost" onClick={resetUpload} disabled={uploading} className="rounded-xl font-bold text-xs uppercase tracking-widest">Abort</Button>
            {uploadStep === "summary" && validCount > 0 && (
              <Button onClick={confirmUpload} disabled={uploading} className="h-11 px-8 rounded-xl gap-3 font-black uppercase tracking-widest shadow-xl">
                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                Ingest {validCount} Units
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
