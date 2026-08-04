"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Ticket, Activity, Download, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetRewards,
  useGetAllVouchers,
  useMarkVoucherAsUsed,
  useDeleteVoucher,
} from "@/graphql/actions/rewards";
import { VoucherDetailsDialog } from "@/components/rewards/inventory/voucher-details-dialog";
import { useToast } from "@/hooks/use-toast";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { VouchersTab } from "@/components/rewards/coupons/vouchers-tab";
import { Voucher } from "@/components/rewards/coupons/types";
import { cn } from "@/lib/utils";

function VouchersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRewardId = searchParams.get("rewardId") || "all";

  const [voucherSearch, setVoucherSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rewardFilter, setRewardFilter] = useState(initialRewardId);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (initialRewardId !== rewardFilter) {
      setRewardFilter(initialRewardId);
    }
  }, [initialRewardId]);

  const { data: rewardsData } = useGetRewards({
    pagination: { page: 1, limit: 100 },
  });

  const {
    data: vouchersData,
    loading: vouchersLoading,
    refetch: refetchVouchers,
  } = useGetAllVouchers({
    status: statusFilter === "all" ? undefined : statusFilter.toUpperCase(),
    rewardId: rewardFilter === "all" ? undefined : rewardFilter,
    pagination: { page: 1, limit: 1000 },
  });

  const [markAsUsed] = useMarkVoucherAsUsed();
  const [deleteVoucher] = useDeleteVoucher();

  const rewards = rewardsData?.getRewards || [];
  const rawVouchers = vouchersData?.getAllVouchers || [];

  const filteredVouchers = useMemo(() => {
    return rawVouchers.filter(
      (v: any) =>
        v.code.toLowerCase().includes(voucherSearch.toLowerCase()) ||
        v.reward?.title?.toLowerCase().includes(voucherSearch.toLowerCase()),
    );
  }, [rawVouchers, voucherSearch]);

  const vouchers: Voucher[] = useMemo(() => {
    return filteredVouchers.map((v: any) => ({
      id: v.id,
      code: v.code,
      rewardId: v.rewardId,
      rewardTitle: v.reward?.title,
      isUsed: v.isUsed,
      assignedTo: v.assignedTo,
      assignedAt: v.assignedAt,
      expiryDate: v.expiryDate,
      createdAt: v.createdAt,
    }));
  }, [filteredVouchers]);

  const totalVouchers = rawVouchers.length;
  const usedVouchers = rawVouchers.filter((v: any) => v.isUsed).length;
  const availableVouchers = totalVouchers - usedVouchers;
  const expiringSoon = rawVouchers.filter((v: any) => {
    if (!v.expiryDate) return false;
    const days = Math.ceil(
      (new Date(v.expiryDate).getTime() - Date.now()) / 86400000,
    );
    return days <= 7 && days > 0;
  }).length;
  const utilRate =
    totalVouchers > 0 ? Math.round((usedVouchers / totalVouchers) * 100) : 0;

  const handleMarkAsUsed = async (voucherId: string) => {
    try {
      await markAsUsed({ variables: { voucherId } });
      toast({ title: "Voucher marked as used" });
      refetchVouchers();
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
      refetchVouchers();
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
      ...vouchers.map((v) => [
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

  const handleRewardChange = (val: string) => {
    setRewardFilter(val);
    const params = new URLSearchParams(window.location.search);
    if (val === "all") {
      params.delete("rewardId");
    } else {
      params.set("rewardId", val);
    }
    router.replace(`/rewards/coupons/vouchers?${params.toString()}`);
  };

  return (
    <>
      <EcosystemActionBar
        shadow="none"
        className="bg-background/80 backdrop-blur-xl border-b border-border/40 py-2"
      >
        <EcosystemActionBar.Group className="flex-1">
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-3 w-full">
              <div className="relative flex-1 max-w-sm">
                <EcosystemActionBar.Search
                  value={voucherSearch}
                  onChange={setVoucherSearch}
                  placeholder="Find specific voucher..."
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-9 rounded-xl border-border bg-card text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="All Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl p-1 shadow-xl border-border">
                    <SelectItem
                      value="all"
                      className="rounded-lg text-xs font-semibold py-2"
                    >
                      All Status
                    </SelectItem>
                    <SelectItem
                      value="available"
                      className="rounded-lg text-xs font-semibold py-2"
                    >
                      Available
                    </SelectItem>
                    <SelectItem
                      value="used"
                      className="rounded-lg text-xs font-semibold py-2"
                    >
                      Redeemed
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={rewardFilter} onValueChange={handleRewardChange}>
                  <SelectTrigger className=" h-9 rounded-xl border-border bg-card text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="All Rewards" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl p-1 shadow-xl border-border">
                    <SelectItem
                      value="all"
                      className="rounded-lg text-xs font-semibold py-2"
                    >
                      All Master Rewards
                    </SelectItem>
                    {rewards.map((reward: any) => (
                      <SelectItem
                        key={reward.id}
                        value={reward.id}
                        className="rounded-lg text-xs font-semibold py-2"
                      >
                        {reward.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
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
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchVouchers()}
              className="h-9 w-9 rounded-xl border-border bg-card text-muted-foreground hover:text-foreground"
            >
              <RotateCw
                size={14}
                className={cn(vouchersLoading ? "animate-spin" : "")}
              />
            </Button>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 pb-20 overflow-visible mt-6">
        <VouchersTab
          totalVouchers={totalVouchers}
          usedVouchers={usedVouchers}
          availableVouchers={availableVouchers}
          expiringSoon={expiringSoon}
          utilRate={utilRate}
          vouchers={vouchers}
          vouchersLoading={vouchersLoading}
          onViewDetails={(v) => {
            setSelectedVoucher(v);
            setIsDetailsOpen(true);
          }}
          onMarkAsUsed={handleMarkAsUsed}
          onDelete={handleDelete}
        />
      </EcosystemContainer>

      <VoucherDetailsDialog
        voucher={selectedVoucher}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onMarkAsUsed={handleMarkAsUsed}
        onDelete={handleDelete}
      />
    </>
  );
}

export default function VouchersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <RotateCw className="h-8 w-8 animate-spin text-primary opacity-20" />
        </div>
      }
    >
      <VouchersContent />
    </Suspense>
  );
}
