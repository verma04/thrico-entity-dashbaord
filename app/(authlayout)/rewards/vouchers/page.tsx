"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Ticket,
  CheckCircle2,
  Clock,
  AlertTriangle,
  History,
  Activity,
  Zap,
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
import { Card, CardContent } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

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

  const { data: rewardsData, loading: rewardsLoading } = useGetRewards();
  const { data: vouchersData, loading: vouchersLoading } = useGetAllVouchers({
    status: statusFilter === "all" ? undefined : statusFilter,
    rewardId: rewardFilter === "all" ? undefined : rewardFilter,
  });
  const [markAsUsed] = useMarkVoucherAsUsed();
  const [deleteVoucher] = useDeleteVoucher();

  const rewards = rewardsData?.getRewards || [];
  const allVouchers = vouchersData?.getAllVouchers || [];

  // Filter vouchers by search query
  const filteredVouchers = allVouchers.filter((voucher: any) => {
    const matchesSearch =
      voucher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.reward?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Map to component format
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

  // Calculate stats
  const totalVouchers = allVouchers.length;
  const usedVouchers = allVouchers.filter((v: any) => v.isUsed).length;
  const availableVouchers = totalVouchers - usedVouchers;
  const expiringSoon = allVouchers.filter((v: any) => {
    if (!v.expiryDate) return false;
    const expiry = new Date(v.expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  }).length;

  const handleViewDetails = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsDetailsOpen(true);
  };

  const handleMarkAsUsed = async (voucherId: string) => {
    try {
      await markAsUsed({
        variables: { voucherId },
      });
      toast({
        title: "Voucher Marked as Used",
        description: "The voucher has been marked as used.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark voucher as used.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (voucherId: string) => {
    try {
      await deleteVoucher({
        variables: { voucherId },
      });
      toast({
        title: "Voucher Deleted",
        description: "The voucher has been removed from inventory.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete voucher.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["Code", "Reward", "Status", "Assigned To", "Expiry Date", "Created At"],
      ...mappedVouchers.map((v: Voucher) => [
        v.code,
        v.rewardTitle || "",
        v.isUsed ? "Used" : "Available",
        v.assignedTo || "",
        v.expiryDate || "",
        v.createdAt,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vouchers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isLoading = rewardsLoading || vouchersLoading;

  return (
    <EcosystemWrapper anonymized-1="voucher-inventory">
      <EcosystemHeader
        title="Voucher Repository"
        badgeText="Core Inventory"
        description="Comprehensive management of all unique reward artifacts. Monitor usage and expiration across the ecosystem."
        icon={Ticket}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
           <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="relative group min-w-[300px]">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                 <Input
                   placeholder="Search code signature..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-12 h-11 rounded-xl border-slate-200 bg-white font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                 />
              </div>

              <div className="h-6 w-px bg-slate-200 hidden md:block" />

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-11 rounded-xl border-slate-200 bg-white font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-500" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-1">
                  <SelectItem value="all" className="font-bold rounded-lg py-2.5">ALL STATUS</SelectItem>
                  <SelectItem value="available" className="font-bold rounded-lg py-2.5">AVAILABLE</SelectItem>
                  <SelectItem value="used" className="font-bold rounded-lg py-2.5">USED</SelectItem>
                </SelectContent>
              </Select>

              <Select value={rewardFilter} onValueChange={setRewardFilter}>
                <SelectTrigger className="w-[200px] h-11 rounded-xl border-slate-200 bg-white font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <SelectValue placeholder="Reward" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-1">
                  <SelectItem value="all" className="font-bold rounded-lg py-2.5">ALL REWARDS</SelectItem>
                  {rewards.map((reward: any) => (
                    <SelectItem key={reward.id} value={reward.id} className="font-bold rounded-lg py-2.5">
                      {reward.title.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
           </div>

           <Button 
              onClick={handleExport} 
              variant="outline"
              className="h-11 px-6 rounded-xl border-slate-200 font-black text-[11px] uppercase tracking-wider gap-3 hover:bg-slate-50 transition-all active:scale-95"
           >
              <Download className="h-4 w-4" />
              Manifest CSV
           </Button>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                 <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Ticket className="h-6 w-6" />
                 </div>
                 <div className="flex flex-col items-end">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{totalVouchers}</p>
                 </div>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }} />
              </div>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                 <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                 </div>
                 <div className="flex flex-col items-end">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{availableVouchers}</p>
                 </div>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(availableVouchers / totalVouchers) * 100}%` }} />
              </div>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                 <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <History className="h-6 w-6" />
                 </div>
                 <div className="flex flex-col items-end">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Redeemed</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{usedVouchers}</p>
                 </div>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-slate-900 rounded-full" style={{ width: `${(usedVouchers / totalVouchers) * 100}%` }} />
              </div>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-rose-50 border border-rose-100 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                 <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                    <AlertTriangle className="h-6 w-6" />
                 </div>
                 <div className="flex flex-col items-end">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Fragile</p>
                    <p className="text-3xl font-black text-rose-900 tracking-tighter">{expiringSoon}</p>
                 </div>
              </div>
              <p className="text-[10px] font-black text-rose-700 uppercase tracking-tighter italic">
                 Expiring in &lt; 7 cycles
              </p>
           </div>
        </div>

        {/* Inventory Matrix */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-1">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                 <Activity className="h-5 w-5" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Inventory Matrix</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Foundational reward data</p>
              </div>
           </div>

           <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
              <VoucherManagementTable
                vouchers={mappedVouchers}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
                onMarkAsUsed={handleMarkAsUsed}
                onDelete={handleDelete}
              />
           </div>
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
