"use client";

import React, { useState, useMemo } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileSpreadsheet,
  Search,
  Copy,
  Check,
  Shield,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { safeFormat } from "@/lib/date-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetManualVouchers,
  useVoidManualVoucher,
  useDeleteManualVoucher,
  ManualVoucher,
  ManualVoucherStatus,
} from "@/graphql/actions/rewards/manual";
import { ManualRewardItem } from "../table/manual-reward-card";
import { ManualVoucherDetailModal } from "./manual-voucher-detail-modal";

interface ManualPoolDrawerProps {
  reward: ManualRewardItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddCodes?: () => void;
}

export function ManualPoolDrawer({
  reward,
  isOpen,
  onClose,
  onAddCodes,
}: ManualPoolDrawerProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const limit = 25;

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<ManualVoucher | null>(
    null
  );

  const [voidMutation, { loading: voiding }] = useVoidManualVoucher();
  const [deleteMutation, { loading: deleting }] = useDeleteManualVoucher();

  // Query vouchers for this specific reward
  const filterInput = useMemo(() => {
    const f: any = {
      rewardId: reward?.id,
      page,
      limit,
    };
    if (search.trim()) f.search = search.trim();
    if (statusFilter !== "ALL") f.status = statusFilter as ManualVoucherStatus;
    return f;
  }, [reward?.id, search, statusFilter, page, limit]);

  const { data, loading, refetch } = useGetManualVouchers(
    { filter: filterInput },
    { skip: !reward?.id || !isOpen }
  );

  const vouchers: ManualVoucher[] = data?.getManualVouchers?.items || [];
  const total = data?.getManualVouchers?.total || 0;
  const totalPages = data?.getManualVouchers?.totalPages || 1;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied "${code}"`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleVoid = async (id: string) => {
    try {
      await voidMutation({ variables: { id } });
      toast.success("Voucher marked as VOID");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to void voucher");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this voucher?"))
      return;
    try {
      await deleteMutation({ variables: { id } });
      toast.success("Voucher permanently removed");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete voucher");
    }
  };

  const getStatusPill = (status: ManualVoucherStatus) => {
    switch (status) {
      case ManualVoucherStatus.UNASSIGNED:
        return (
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-950/70 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-200/60">
            UNASSIGNED
          </span>
        );
      case ManualVoucherStatus.ASSIGNED:
        return (
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/70 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-200/60">
            ASSIGNED
          </span>
        );
      case ManualVoucherStatus.REDEEMED:
        return (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/70 dark:text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-200/60">
            REDEEMED
          </span>
        );
      case ManualVoucherStatus.EXPIRED:
        return (
          <span className="text-[10px] font-bold text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-200">
            EXPIRED
          </span>
        );
      case ManualVoucherStatus.VOID:
        return (
          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 dark:bg-rose-950/70 dark:text-rose-300 px-1.5 py-0.5 rounded border border-rose-200/60">
            VOID
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  if (!reward) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl p-0 flex flex-col justify-between"
        >
          {/* Header */}
          <SheetHeader className="p-5 pb-4 border-b border-border bg-muted/20">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-600 text-white text-[9px] uppercase font-bold px-1.5 py-0">
                    Voucher Pool
                  </Badge>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {reward.couponType === "ONE_TO_ONE"
                      ? "1:1 Serial Asset Pool"
                      : "1:N Shared Promo"}
                  </span>
                </div>
                <SheetTitle className="text-base font-bold text-foreground">
                  {reward.title}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Inspect and manage live voucher inventory records for this campaign.
                </SheetDescription>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="h-8 w-8 p-0 shrink-0"
                title="Refresh"
              >
                <RefreshCw
                  className={cn("h-3.5 w-3.5", loading && "animate-spin")}
                />
              </Button>
            </div>
          </SheetHeader>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Filter / Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search code or card number..."
                  className="pl-8 h-8 text-xs bg-card"
                />
              </div>

              {/* Status pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {[
                  "ALL",
                  "UNASSIGNED",
                  "ASSIGNED",
                  "REDEEMED",
                  "EXPIRED",
                  "VOID",
                ].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setPage(1);
                    }}
                    className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer",
                      statusFilter === st
                        ? "bg-emerald-600 text-white"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Results Summary */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Found <strong className="text-foreground">{total}</strong>{" "}
                {total === 1 ? "voucher" : "vouchers"}
              </span>
              <span>
                Page {page} of {totalPages}
              </span>
            </div>

            {/* Voucher Records List */}
            {loading ? (
              <div className="space-y-2 py-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 rounded-lg bg-muted/40 animate-pulse border border-border/50"
                  />
                ))}
              </div>
            ) : vouchers.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-border bg-muted/10 space-y-2">
                <FileSpreadsheet className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="text-xs font-semibold text-foreground">
                  No vouchers found
                </p>
                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                  No voucher entries match your current search and status filters.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {vouchers.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 rounded-xl border border-border/70 bg-card hover:border-emerald-500/40 hover:shadow-2xs transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    {/* Code & Badges */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-foreground truncate text-sm select-all">
                          {v.code}
                        </span>
                        {getStatusPill(v.status)}
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
                        {v.cardNumber && (
                          <span>Card: {v.cardNumber}</span>
                        )}
                        {v.assignedToUser ? (
                          <span className="text-foreground font-medium flex items-center gap-1">
                            Assigned to: {v.assignedToUser.firstName}{" "}
                            {v.assignedToUser.lastName}
                          </span>
                        ) : (
                          <span>Unassigned</span>
                        )}
                        {v.expiryDate && (
                          <span>Exp: {safeFormat(v.expiryDate, "dd MMM yyyy")}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyCode(v.code)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Copy Code"
                      >
                        {copiedCode === v.code ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedVoucher(v)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Inspect Record"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>

                      {v.status !== ManualVoucherStatus.VOID &&
                        v.status !== ManualVoucherStatus.REDEEMED && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleVoid(v.id)}
                            className="h-7 w-7 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                            title="Void Voucher"
                          >
                            <Shield className="h-3.5 w-3.5" />
                          </Button>
                        )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(v.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Pagination */}
          <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-7 text-xs"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="h-7 text-xs"
              >
                Next
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={onClose} className="h-7 text-xs">
              Done
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Individual Voucher Detail Modal */}
      <ManualVoucherDetailModal
        voucher={selectedVoucher}
        isOpen={Boolean(selectedVoucher)}
        onClose={() => setSelectedVoucher(null)}
        onVoid={handleVoid}
      />
    </>
  );
}
