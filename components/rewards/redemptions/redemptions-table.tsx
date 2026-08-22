"use client";

import React, { useState } from "react";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import {
  Copy,
  Coins,
  Ticket,
  ShoppingBag,
  Gift,
  MoreVertical,
  Receipt,
  KeyRound,
  ShieldCheck,
  Check,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  UserProfileHoverCard,
  UserProfileHoverData,
} from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { safeFormat } from "@/lib/date-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface Redemption {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  reward: {
    id: string;
    title: string;
    image?: string;
    rewardType?: "INTERNAL" | "STORE" | "GIFT_CARD";
    brand?: string;
  };
  pillar?: "PILLAR_1" | "PILLAR_2" | "PILLAR_3";
  ecUsed?: number;
  tcUsed?: number;
  faceValue?: number;
  serviceFee?: number;
  totalCost?: number;
  claimedAt?: string;
  createdAt: string;
  status: string;
  metadata?: {
    voucherCode?: string;
    pin?: string;
    idempotencyKey?: string;
    provider?: "INTERNAL" | "SHOPIFY" | "GIFT_CARD";
    gameSource?: string;
  };
}

interface RedemptionsTableProps {
  redemptions: Redemption[];
  isLoading: boolean;
}

export function RedemptionsTable({
  redemptions,
  isLoading,
}: RedemptionsTableProps) {
  const currencyModuleName = useModuleStore(
    (state) => state.currencyModuleName,
  );
  const { data } = useGetEntityCurrencyConfig();
  const currencyName = data?.getEntityCurrencyConfig?.currencyName || currencyModuleName || "TC";

  const [selectedRedemption, setSelectedRedemption] = useState<Redemption | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string = "Code") => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusType = (status: string) => {
    const s = status?.toUpperCase();
    if (s === "SUCCESS" || s === "COMPLETED" || s === "FULFILLED" || s === "DELIVERED" || s === "REDEEMED")
      return "APPROVED";
    if (s === "PENDING" || s === "RESERVED") return "PENDING";
    if (s === "FAILED" || s === "REJECTED" || s === "FAILED_RELEASED") return "REJECTED";
    return "DISABLED";
  };

  const getPillarInfo = (row: Redemption) => {
    const provider = row.metadata?.provider || row.reward?.rewardType;
    if (provider === "GIFT_CARD" || row.pillar === "PILLAR_3") {
      return {
        label: "Digital Gift Card",
        tag: "purple" as const,
        icon: Gift,
      };
    }
    if (provider === "SHOPIFY" || provider === "STORE" || row.pillar === "PILLAR_2") {
      return {
        label: "Shopify Store",
        tag: "indigo" as const,
        icon: ShoppingBag,
      };
    }
    return {
      label: "Internal Voucher",
      tag: "emerald" as const,
      icon: Ticket,
    };
  };

  const columns = [
    {
      key: "user",
      header: "Member",
      cell: (row: Redemption) => {
        const user = row.user || { firstName: "Member", lastName: "", email: "" };
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous Member";
        const hoverUser: UserProfileHoverData = {
          id: user.id || "u-1",
          firstName: user.firstName || "Member",
          lastName: user.lastName || "",
          avatar: user.avatar || "",
        };
        return (
          <UserProfileHoverCard user={hoverUser}>
            <div>
              <AdminTableItem
                avatar={user.avatar}
                title={fullName}
                subtitle={user.email}
                fallbackText={user.firstName?.[0] || "U"}
              />
            </div>
          </UserProfileHoverCard>
        );
      },
    },
    {
      key: "reward",
      header: "Reward Offer & Pillar",
      cell: (row: Redemption) => {
        const pillarInfo = getPillarInfo(row);
        const Icon = pillarInfo.icon;

        return (
          <div className="space-y-1">
            <span className="text-xs font-bold text-foreground block truncate max-w-[200px]">
              {row.reward?.title || "Special Reward"}
            </span>
            <div className="flex items-center gap-1.5">
              <AdminTableTag variant={pillarInfo.tag}>
                <span className="flex items-center gap-1">
                  <Icon className="h-3 w-3" />
                  {pillarInfo.label}
                </span>
              </AdminTableTag>
              {row.metadata?.gameSource && (
                <span className="text-[10px] text-muted-foreground font-mono">
                  via {row.metadata.gameSource}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "value",
      header: "Value / Cost",
      cell: (row: Redemption) => {
        if (row.faceValue || row.totalCost) {
          return (
            <div className="text-xs font-mono">
              <span className="font-bold text-foreground">
                ₹{row.totalCost || row.faceValue}
              </span>
              {row.serviceFee ? (
                <span className="text-[10px] text-muted-foreground block">
                  (₹{row.faceValue} + ₹{row.serviceFee} fee)
                </span>
              ) : null}
            </div>
          );
        }

        return (
          <AdminTableMetric
            icon={Coins}
            value={row.ecUsed || row.tcUsed || 0}
            unit={currencyName}
            variant="amber"
          />
        );
      },
    },
    {
      key: "voucherCode",
      header: "Voucher Code",
      cell: (row: Redemption) => {
        const code = row.metadata?.voucherCode;
        if (!code) {
          return (
            <span className="text-muted-foreground text-[11px] italic">
              Auto-Applied / In Wallet
            </span>
          );
        }

        return (
          <div className="flex items-center gap-1.5 group">
            <span className="font-mono text-[11px] bg-muted/60 px-2 py-0.5 rounded border border-border/60 font-bold">
              {code}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground cursor-pointer rounded"
              onClick={() => copyToClipboard(code, "Voucher Code")}
            >
              {copiedCode === code ? (
                <Check className="h-3 w-3 text-emerald-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        );
      },
    },
    {
      key: "createdAt",
      header: "Date & Time",
      cell: (row: Redemption) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {safeFormat(row.createdAt || row.claimedAt, "dd MMM yyyy, HH:mm", "Recently")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: Redemption) => (
        <AdminStatusBadge status={getStatusType(row.status)}>
          {row.status || "Completed"}
        </AdminStatusBadge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "w-12 text-center",
      className: "text-center",
      isFixedRight: true,
      cell: (row: Redemption) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md cursor-pointer">
              <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 text-xs">
            <DropdownMenuItem
              onClick={() => setSelectedRedemption(row)}
              className="gap-2 cursor-pointer text-indigo-600 font-semibold"
            >
              <Receipt className="h-3.5 w-3.5" />
              Inspect Receipt & Audit
            </DropdownMenuItem>
            {row.metadata?.voucherCode && (
              <DropdownMenuItem
                onClick={() => copyToClipboard(row.metadata!.voucherCode!, "Voucher Code")}
                className="gap-2 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Code
              </DropdownMenuItem>
            )}
            {row.metadata?.idempotencyKey && (
              <DropdownMenuItem
                onClick={() => copyToClipboard(row.metadata!.idempotencyKey!, "Idempotency Key")}
                className="gap-2 cursor-pointer font-mono text-[11px]"
              >
                <KeyRound className="h-3.5 w-3.5 text-violet-500" />
                Copy Idempotency Key
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
        <AdminTable
          columns={columns}
          data={redemptions || []}
          loading={isLoading}
          keyExtractor={(node) => node.id}
          emptyTitle="No Redemptions Found"
          emptyDescription="When members claim internal vouchers, Shopify coupons, or digital gift cards, entries will appear here."
          emptyIcon={Ticket}
          size="sm"
        />
      </div>

      {/* ── Detailed Receipt & Audit Modal ─────────────────────────────── */}
      {selectedRedemption && (
        <Dialog open={!!selectedRedemption} onOpenChange={() => setSelectedRedemption(null)}>
          <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border/80 shadow-lg">
            <DialogHeader className="p-5 pb-3 bg-muted/20 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <DialogTitle className="text-sm font-bold text-foreground">
                    Redemption Receipt & Audit Log
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Transaction ID: <span className="font-mono text-foreground font-semibold">{selectedRedemption.id}</span>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="p-5 space-y-4 text-xs">
              {/* Member & Offer Header */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
                    Member Details
                  </span>
                  <AdminStatusBadge status={getStatusType(selectedRedemption.status)}>
                    {selectedRedemption.status || "Completed"}
                  </AdminStatusBadge>
                </div>
                <div className="font-bold text-foreground text-sm">
                  {selectedRedemption.user?.firstName} {selectedRedemption.user?.lastName}
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  {selectedRedemption.user?.email}
                </div>
              </div>

              {/* Financial & Pillar Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground block">
                  Reward & Fulfillment Parameters
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-border/60 bg-card space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                      Reward Title
                    </span>
                    <strong className="text-foreground text-xs block truncate">
                      {selectedRedemption.reward?.title}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-lg border border-border/60 bg-card space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                      Reward Pillar
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {getPillarInfo(selectedRedemption).label}
                    </span>
                  </div>
                </div>

                {selectedRedemption.metadata?.voucherCode && (
                  <div className="p-3 rounded-lg border border-border/70 bg-card flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                        Issued Voucher Code
                      </span>
                      <span className="font-mono text-sm font-bold text-foreground">
                        {selectedRedemption.metadata.voucherCode}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(selectedRedemption.metadata!.voucherCode!, "Voucher Code")}
                      className="h-7 text-xs font-semibold cursor-pointer gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      Copy Code
                    </Button>
                  </div>
                )}

                {selectedRedemption.metadata?.idempotencyKey && (
                  <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block uppercase font-semibold flex items-center gap-1">
                      <KeyRound className="h-3 w-3 text-violet-500" />
                      Idempotency Reference Key
                    </span>
                    <span className="font-mono text-[11px] text-foreground block truncate">
                      {selectedRedemption.metadata.idempotencyKey}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="p-4 bg-muted/20 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRedemption(null)}
                className="text-xs font-semibold w-full"
              >
                Close Audit Log
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
