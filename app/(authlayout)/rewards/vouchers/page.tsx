"use client";

import React, { useState } from "react";
import {
  Search,
  Download,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  History,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VoucherManagementTable } from "@/components/rewards/inventory/voucher-management-table";
import { VoucherDetailsDialog } from "@/components/rewards/inventory/voucher-details-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useGetRewards,
  useGetAllVouchers,
  useMarkVoucherAsUsed,
  useDeleteVoucher,
} from "@/graphql/actions/rewards";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

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

export default function VoucherManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rewardFilter, setRewardFilter] = useState("all");
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  const { data: rewardsData } = useGetRewards();
  const { data: vouchersData, loading: vouchersLoading } = useGetAllVouchers({
    status: statusFilter === "all" ? undefined : statusFilter,
    rewardId: rewardFilter === "all" ? undefined : rewardFilter,
  });

  const [markAsUsed] = useMarkVoucherAsUsed();
  const [deleteVoucher] = useDeleteVoucher();

  const rewards = rewardsData?.getRewards || [];
  const allVouchers = vouchersData?.getAllVouchers || [];

  const filteredVouchers = allVouchers.filter(
    (v: any) =>
      v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.reward?.title?.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const stats = [
    {
      label: "Total",
      value: totalVouchers,
      icon: Ticket,
      accent: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Available",
      value: availableVouchers,
      icon: CheckCircle2,
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Redeemed",
      value: usedVouchers,
      icon: History,
      accent: "text-slate-600",
      bg: "bg-slate-100",
    },
    {
      label: "Expiring soon",
      value: expiringSoon,
      icon: AlertTriangle,
      accent: "text-rose-600",
      bg: "bg-rose-50",
      alert: true,
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="All Vouchers"
        badgeText="Vouchers"
        description="Monitor usage, expiration, and availability across all voucher codes."
        icon={Ticket}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search code or reward..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 w-[220px] text-sm"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-8 text-sm">
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
            <SelectTrigger className="w-[170px] h-8 text-sm">
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
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 p-4 rounded-xl border bg-card ${s.alert && s.value > 0 ? "border-rose-200" : "border-border"}`}
            >
              <div
                className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${s.bg}`}
              >
                <s.icon className={`h-4 w-4 ${s.accent}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {s.label}
                </p>
                <p className="text-xl font-bold text-foreground tracking-tight">
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">
            Voucher Inventory
          </h2>

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
    </EcosystemWrapper>
  );
}
