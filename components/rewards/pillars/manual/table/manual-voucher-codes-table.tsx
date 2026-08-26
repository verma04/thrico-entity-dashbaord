"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Ticket,
  Copy,
  Check,
  Search,
  Filter,
  MoreVertical,
  Shield,
  Trash2,
  Eye,
  Layers,
  Users,
  RefreshCw,
  Clock,
  Sparkles,
  ChevronDown,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableItem,
  AdminTableTag,
  Pagination,
} from "@/components/shared/admin-table/admin-table";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
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
  ManualCouponType,
} from "@/graphql/actions/rewards/manual";
import { useGetRewards } from "@/graphql/actions/rewards";
import { ManualVoucherDetailModal } from "../drawer/manual-voucher-detail-modal";

export const VOUCHER_STATUS_FILTERS = [
  { value: "ALL", label: "All Records", dot: "" },
  { value: "UNASSIGNED", label: "Unassigned / Available", dot: "bg-blue-500" },
  { value: "ASSIGNED", label: "Assigned to Member", dot: "bg-amber-500" },
  { value: "REDEEMED", label: "Redeemed", dot: "bg-emerald-500" },
  { value: "EXPIRED", label: "Expired", dot: "bg-zinc-500" },
  { value: "VOID", label: "Voided", dot: "bg-rose-500" },
] as const;

export function ManualVoucherCodesTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper: update URL query params seamlessly
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
          (key === "page" && value === "1")
        ) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const status = searchParams.get("vStatus") || "ALL";
  const couponType = searchParams.get("couponType") || "ALL";
  const rewardId = searchParams.get("rewardId") || "ALL";
  const rawPage = Number(searchParams.get("page") || "1");
  const limit = 20;

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null, page: null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<ManualVoucher | null>(
    null
  );

  // Mutations
  const [voidMutation, { loading: voiding }] = useVoidManualVoucher();
  const [deleteMutation, { loading: deleting }] = useDeleteManualVoucher();

  // Rewards list for filtering
  const { data: rewardsData } = useGetRewards();
  const rewardsList = rewardsData?.getRewards?.rewards || [];

  // Filter input object for GraphQL
  const filterInput = useMemo(() => {
    const f: any = {
      page: Math.max(1, isNaN(rawPage) ? 1 : rawPage),
      limit,
    };
    if (debouncedSearch.trim()) f.search = debouncedSearch.trim();
    if (status !== "ALL") f.status = status as ManualVoucherStatus;
    if (couponType !== "ALL") f.couponType = couponType as ManualCouponType;
    if (rewardId !== "ALL") f.rewardId = rewardId;
    return f;
  }, [debouncedSearch, status, couponType, rewardId, rawPage, limit]);

  // Execute live query
  const { data, loading, refetch } = useGetManualVouchers({
    filter: filterInput,
  });

  const vouchers: ManualVoucher[] = data?.getManualVouchers?.items || [];
  const total = data?.getManualVouchers?.total || 0;
  const totalPages = Math.max(1, data?.getManualVouchers?.totalPages || 1);
  const safePage = Math.min(Math.max(1, isNaN(rawPage) ? 1 : rawPage), totalPages);
  const offset = (safePage - 1) * limit;

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
      toast.success("Voucher permanently deleted");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete voucher");
    }
  };

  const getStatusBadge = (voucherStatus: ManualVoucherStatus) => {
    switch (voucherStatus) {
      case ManualVoucherStatus.UNASSIGNED:
        return (
          <AdminTableTag variant="sky">
            UNASSIGNED
          </AdminTableTag>
        );
      case ManualVoucherStatus.ASSIGNED:
        return (
          <AdminTableTag variant="amber">
            ASSIGNED
          </AdminTableTag>
        );
      case ManualVoucherStatus.REDEEMED:
        return (
          <AdminTableTag variant="emerald">
            REDEEMED
          </AdminTableTag>
        );
      case ManualVoucherStatus.EXPIRED:
        return (
          <AdminTableTag variant="muted">
            EXPIRED
          </AdminTableTag>
        );
      case ManualVoucherStatus.VOID:
        return (
          <AdminTableTag variant="rose">
            VOID
          </AdminTableTag>
        );
      default:
        return <AdminTableTag>{voucherStatus}</AdminTableTag>;
    }
  };

  // Define Table Columns
  const columns: AdminTableColumn<ManualVoucher>[] = [
    {
      key: "serial",
      header: "S.No",
      headerClassName: "w-12 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_, index) => index + 1,
    },
    {
      key: "code",
      header: "Voucher Code",
      cell: (v) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-foreground select-all">
            {v.code}
          </span>
          <button
            onClick={() => handleCopyCode(v.code)}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Copy Code"
          >
            {copiedCode === v.code ? (
              <Check className="h-3 w-3 text-emerald-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      ),
    },
    {
      key: "reward",
      header: "Associated Campaign",
      cell: (v) => {
        const cover = v.reward?.image
          ? v.reward.image.startsWith("http")
            ? v.reward.image
            : `https://cdn.thrico.network/${v.reward.image}`
          : "";

        return (
          <AdminTableItem
            avatar={cover}
            icon={
              !cover ? (
                <Ticket className="h-4 w-4 text-emerald-600" />
              ) : undefined
            }
            title={v.reward?.title || "Manual Voucher"}
            subtitle={
              v.batch?.name
                ? `Batch: ${v.batch.name}`
                : `Reward ID: ${(v.rewardId || "").slice(0, 8)}...`
            }
          />
        );
      },
    },
    {
      key: "type",
      header: "Architecture",
      cell: (v) => {
        const isOneToOne =
          v.couponType === ManualCouponType.ONE_TO_ONE ||
          (v.couponType as string) === "ONE_TO_ONE";
        return (
          <AdminTableTag variant={isOneToOne ? "emerald" : "sky"}>
            {isOneToOne ? "1:1 Serial" : "1:N Shared"}
          </AdminTableTag>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (v) => getStatusBadge(v.status),
    },
    {
      key: "assigned",
      header: "Assigned Member",
      cell: (v) => {
        if (!v.assignedToUser) {
          return (
            <span className="text-[11px] text-muted-foreground italic">
              Unassigned
            </span>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 rounded-md border border-border">
              <AvatarImage src={v.assignedToUser.avatar || undefined} />
              <AvatarFallback className="text-[10px] font-bold">
                {(v.assignedToUser.firstName?.[0] || "") +
                  (v.assignedToUser.lastName?.[0] || "")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {v.assignedToUser.firstName} {v.assignedToUser.lastName}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {v.assignedToUser.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "expiry",
      header: "Expiry Date",
      className: "text-[11px] text-muted-foreground",
      cell: (v) =>
        v.expiryDate ? safeFormat(v.expiryDate, "dd MMM yyyy") : "No Expiry",
    },
    {
      key: "created",
      header: "Created",
      className: "text-[11px] text-muted-foreground",
      cell: (v) => safeFormat(v.createdAt, "dd MMM yyyy"),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-10",
      className: "text-right",
      isFixedRight: true,
      cell: (v) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={() => handleCopyCode(v.code)}
              className="text-xs gap-2"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Code
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSelectedVoucher(v)}
              className="text-xs gap-2"
            >
              <Eye className="h-3.5 w-3.5" />
              Inspect Details
            </DropdownMenuItem>
            {v.status !== ManualVoucherStatus.VOID &&
              v.status !== ManualVoucherStatus.REDEEMED && (
                <DropdownMenuItem
                  onClick={() => handleVoid(v.id)}
                  className="text-xs gap-2 text-rose-600 focus:text-rose-600"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Void Voucher
                </DropdownMenuItem>
              )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(v.id)}
              className="text-xs gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Record
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {/* Action / Filter Bar */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search by voucher code, card number..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Status Filter */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <Select
              value={status}
              onValueChange={(v) => {
                updateParams({ vStatus: v, page: null });
              }}
            >
              <SelectTrigger className="w-[155px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                <div className="flex items-center gap-2">
                  {VOUCHER_STATUS_FILTERS.find((f) => f.value === status)?.dot && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        VOUCHER_STATUS_FILTERS.find((f) => f.value === status)?.dot
                      )}
                    />
                  )}
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[170px]">
                {VOUCHER_STATUS_FILTERS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {opt.dot && (
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            opt.dot
                          )}
                        />
                      )}
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Architecture Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={couponType}
              onValueChange={(v) => {
                updateParams({ couponType: v, page: null });
              }}
            >
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                <SelectValue placeholder="Architecture" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1">
                <SelectItem value="ALL" className="text-xs">All Types</SelectItem>
                <SelectItem value="ONE_TO_ONE" className="text-xs">1:1 Serial Pool</SelectItem>
                <SelectItem value="ONE_TO_MANY" className="text-xs">1:N Shared Promo</SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Reward Filter */}
          {rewardsList.length > 0 && (
            <EcosystemActionBar.Item>
              <Select
                value={rewardId}
                onValueChange={(v) => {
                  updateParams({ rewardId: v, page: null });
                }}
              >
                <SelectTrigger className="w-[160px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                  <SelectValue placeholder="Filter Reward" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 max-h-60">
                  <SelectItem value="ALL" className="text-xs">All Campaigns</SelectItem>
                  {rewardsList.map((r: any) => (
                    <SelectItem key={r.id} value={r.id} className="text-xs">
                      {r.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>
          )}
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8 px-2.5 text-xs font-semibold gap-1.5 cursor-pointer"
            title="Refresh Live Ledger"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5 text-muted-foreground", loading && "animate-spin")}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* Main Admin Table */}
      <AdminTable
        columns={columns}
        data={vouchers}
        loading={loading}
        keyExtractor={(item) => item.id}
        emptyIcon={Ticket}
        emptyTitle="No Voucher Codes Found"
        emptyDescription="No manual voucher entries match your current search or filter criteria. Create or import vouchers to populate your ledger."
        pageSize={100}
        baseIndex={offset}
      />

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={total}
            pageSize={limit}
            onPageChange={(p) => updateParams({ page: String(p) })}
          />
        </div>
      )}

      {/* Full Voucher Details Inspection Modal */}
      <ManualVoucherDetailModal
        voucher={selectedVoucher}
        isOpen={Boolean(selectedVoucher)}
        onClose={() => setSelectedVoucher(null)}
        onVoid={handleVoid}
      />
    </div>
  );
}
