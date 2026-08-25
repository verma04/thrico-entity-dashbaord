"use client";

import React, { useState } from "react";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
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
  Check,
  ExternalLink,
  CreditCard,
  Sparkles,
  User,
  Calendar,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    rewardType?: "INTERNAL" | "STORE" | "GIFT_CARD" | string;
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
    couponCode?: string;
    pin?: string;
    cardPin?: string;
    cardUrl?: string;
    orderId?: string;
    externalId?: string;
    idempotencyKey?: string;
    provider?: "INTERNAL" | "SHOPIFY" | "GIFT_CARD" | "THRICO" | "XOXODAY" | string;
    gameSource?: string;
    faceValue?: number;
    serviceFee?: number;
    [key: string]: any;
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
  const currencyName =
    data?.getEntityCurrencyConfig?.currencyName ||
    currencyModuleName ||
    "TC";

  const [selectedRedemption, setSelectedRedemption] = useState<Redemption | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string = "Code") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getStatusType = (status: string) => {
    const s = status?.toUpperCase() || "";
    if (
      s === "SUCCESS" ||
      s === "COMPLETED" ||
      s === "FULFILLED" ||
      s === "DELIVERED" ||
      s === "REDEEMED" ||
      s === "APPROVED"
    ) {
      return "APPROVED";
    }
    if (s === "PENDING" || s === "RESERVED") {
      return "PENDING";
    }
    if (s === "FAILED" || s === "REJECTED" || s === "FAILED_RELEASED") {
      return "REJECTED";
    }
    return "DISABLED";
  };

  const getPillarInfo = (row: Redemption) => {
    const provider = (row.metadata?.provider || "").toUpperCase();
    const rewardType = (row.reward?.rewardType || "").toUpperCase();
    const pillar = row.pillar;

    // Pillar 3: Digital Gift Card (GIFT_CARD or provider = THRICO / XOXODAY)
    if (
      pillar === "PILLAR_3" ||
      rewardType === "GIFT_CARD" ||
      provider === "GIFT_CARD" ||
      provider === "THRICO" ||
      provider === "XOXODAY"
    ) {
      return {
        label: "Digital Gift Card",
        tag: "purple" as const,
        icon: Gift,
      };
    }

    // Pillar 2: Shopify Store (STORE or provider = SHOPIFY)
    if (
      pillar === "PILLAR_2" ||
      rewardType === "STORE" ||
      provider === "SHOPIFY" ||
      provider === "STORE"
    ) {
      return {
        label: "Shopify Store",
        tag: "indigo" as const,
        icon: ShoppingBag,
      };
    }

    return null;
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
      header: "Reward Offer",
      cell: (row: Redemption) => {
        const pillarInfo = getPillarInfo(row);
        const Icon = pillarInfo?.icon;

        return (
          <div className="space-y-1">
            <span className="text-xs font-bold text-foreground block truncate max-w-[200px]">
              {row.reward?.title || "Special Reward"}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {pillarInfo && Icon && (
                <AdminTableTag variant={pillarInfo.tag}>
                  <span className="flex items-center gap-1">
                    <Icon className="h-3 w-3" />
                    {pillarInfo.label}
                  </span>
                </AdminTableTag>
              )}
              {row.metadata?.gameSource && (
                <span className="text-[10px] text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded border border-border/50">
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

        // Fallback if totalCost is 0 or empty: shows Coins / Currency spent
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
      key: "createdAt",
      header: "Date & Time",
      cell: (row: Redemption) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {safeFormat(row.claimedAt || row.createdAt, "dd MMM yyyy, HH:mm", "Recently")}
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
      cell: (row: Redemption) => {
        const code = row.metadata?.voucherCode || row.metadata?.couponCode;
        const pin = row.metadata?.pin || row.metadata?.cardPin;
        const cardUrl = row.metadata?.cardUrl;
        const idempotencyKey = row.metadata?.idempotencyKey;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md cursor-pointer"
              >
                <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 text-xs">
              <DropdownMenuItem
                onClick={() => setSelectedRedemption(row)}
                className="gap-2 cursor-pointer text-indigo-600 font-semibold focus:text-indigo-600"
              >
                <Receipt className="h-3.5 w-3.5" />
                Inspect Receipt & Audit
              </DropdownMenuItem>

              {code && (
                <DropdownMenuItem
                  onClick={() => copyToClipboard(code, "Voucher / Coupon Code")}
                  className="gap-2 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Code ({code.slice(0, 8)}...)
                </DropdownMenuItem>
              )}

              {pin && (
                <DropdownMenuItem
                  onClick={() => copyToClipboard(pin, "Card PIN")}
                  className="gap-2 cursor-pointer font-mono text-[11px]"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Copy Card PIN
                </DropdownMenuItem>
              )}

              {cardUrl && (
                <DropdownMenuItem
                  onClick={() => window.open(cardUrl, "_blank", "noopener,noreferrer")}
                  className="gap-2 cursor-pointer text-sky-600 focus:text-sky-600"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open Gift Card Link
                </DropdownMenuItem>
              )}

              {idempotencyKey && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => copyToClipboard(idempotencyKey, "Idempotency Key")}
                    className="gap-2 cursor-pointer font-mono text-[11px]"
                  >
                    <KeyRound className="h-3.5 w-3.5 text-violet-500" />
                    Copy Idempotency Key
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
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
        <Dialog
          open={!!selectedRedemption}
          onOpenChange={(open) => {
            if (!open) setSelectedRedemption(null);
          }}
        >
          <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden border-border/80 shadow-2xl">
            {/* Modal Header */}
            <DialogHeader className="p-5 pb-3 bg-muted/20 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-xs">
                    <Receipt className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <DialogTitle className="text-sm font-bold text-foreground">
                      Redemption Receipt & Audit Log
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                      Transaction ID:{" "}
                      <span className="font-mono text-foreground font-semibold">
                        {selectedRedemption.id}
                      </span>
                    </DialogDescription>
                  </div>
                </div>

                <AdminStatusBadge status={getStatusType(selectedRedemption.status)}>
                  {selectedRedemption.status || "Completed"}
                </AdminStatusBadge>
              </div>
            </DialogHeader>

            <div className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              {/* 1. Member Details */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  <User className="h-3 w-3" />
                  <span>1. Member Details</span>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border/70 shadow-xs">
                    <AvatarImage
                      src={
                        selectedRedemption.user?.avatar?.startsWith("http")
                          ? selectedRedemption.user.avatar
                          : selectedRedemption.user?.avatar
                          ? `https://cdn.thrico.network/${selectedRedemption.user.avatar}`
                          : ""
                      }
                      alt={selectedRedemption.user?.firstName || "Member"}
                    />
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                      {selectedRedemption.user?.firstName?.[0] || "U"}
                      {selectedRedemption.user?.lastName?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-foreground text-sm truncate">
                      {selectedRedemption.user?.firstName} {selectedRedemption.user?.lastName}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono truncate">
                      {selectedRedemption.user?.email || "No email available"}
                    </div>
                    {selectedRedemption.user?.id && (
                      <div className="text-[10px] text-muted-foreground/80 font-mono mt-0.5">
                        User ID: {selectedRedemption.user.id}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Breakdown: EC / TC / Total Cost */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-2.5">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  <Coins className="h-3 w-3 text-amber-500" />
                  <span>2. Currency & Cost Breakdown</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                      Total Cost (Fiat)
                    </span>
                    <span className="font-mono text-sm font-bold text-foreground block">
                      {selectedRedemption.totalCost !== undefined || selectedRedemption.faceValue !== undefined
                        ? `₹${selectedRedemption.totalCost ?? selectedRedemption.faceValue}`
                        : "₹0"}
                    </span>
                    {selectedRedemption.serviceFee ? (
                      <span className="text-[10px] text-muted-foreground font-mono block">
                        ₹{selectedRedemption.faceValue} + ₹{selectedRedemption.serviceFee} fee
                      </span>
                    ) : null}
                  </div>

                  <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                      EC Used
                    </span>
                    <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400 block">
                      {selectedRedemption.ecUsed || 0} EC
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                      {currencyName} Used
                    </span>
                    <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 block">
                      {selectedRedemption.tcUsed || 0} {currencyName}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Reward & Pillar Parameters */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-2.5">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  <Layers className="h-3 w-3" />
                  <span>3. Reward & Fulfillment Source</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                      Reward Item
                    </span>
                    <strong className="text-foreground text-xs block truncate" title={selectedRedemption.reward?.title}>
                      {selectedRedemption.reward?.title || "Custom Reward"}
                    </strong>
                    {selectedRedemption.reward?.brand && (
                      <span className="text-[10px] text-muted-foreground block">
                        Brand: {selectedRedemption.reward.brand}
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                      Pillar Category
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      {getPillarInfo(selectedRedemption) ? (
                        <AdminTableTag variant={getPillarInfo(selectedRedemption)!.tag}>
                          {getPillarInfo(selectedRedemption)!.label}
                        </AdminTableTag>
                      ) : (
                        <span className="text-xs text-muted-foreground">Standard Reward</span>
                      )}
                    </div>
                    {selectedRedemption.metadata?.gameSource && (
                      <span className="text-[10px] text-muted-foreground font-mono block mt-0.5">
                        Trigger: {selectedRedemption.metadata.gameSource}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Fulfillment Details: Code, PIN, URL, External IDs */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  <CreditCard className="h-3 w-3" />
                  <span>4. Fulfillment Credentials & Audit Keys</span>
                </div>

                <div className="space-y-2">
                  {/* Voucher / Coupon Code */}
                  {(selectedRedemption.metadata?.voucherCode || selectedRedemption.metadata?.couponCode) && (
                    <div className="p-2.5 rounded-lg border border-border/70 bg-card flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                          Voucher / Coupon Code
                        </span>
                        <span className="font-mono text-xs font-bold text-foreground">
                          {selectedRedemption.metadata?.voucherCode || selectedRedemption.metadata?.couponCode}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(
                            selectedRedemption.metadata?.voucherCode || selectedRedemption.metadata?.couponCode || "",
                            "Voucher Code"
                          )
                        }
                        className="h-6.5 text-[11px] font-semibold cursor-pointer gap-1 px-2"
                      >
                        {copiedKey === (selectedRedemption.metadata?.voucherCode || selectedRedemption.metadata?.couponCode) ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        Copy
                      </Button>
                    </div>
                  )}

                  {/* Card PIN */}
                  {(selectedRedemption.metadata?.pin || selectedRedemption.metadata?.cardPin) && (
                    <div className="p-2.5 rounded-lg border border-border/70 bg-card flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                          Security / Card PIN
                        </span>
                        <span className="font-mono text-xs font-bold text-foreground">
                          {selectedRedemption.metadata?.pin || selectedRedemption.metadata?.cardPin}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(
                            selectedRedemption.metadata?.pin || selectedRedemption.metadata?.cardPin || "",
                            "Card PIN"
                          )
                        }
                        className="h-6.5 text-[11px] font-semibold cursor-pointer gap-1 px-2"
                      >
                        {copiedKey === (selectedRedemption.metadata?.pin || selectedRedemption.metadata?.cardPin) ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        Copy PIN
                      </Button>
                    </div>
                  )}

                  {/* Card Claim URL */}
                  {selectedRedemption.metadata?.cardUrl && (
                    <div className="p-2.5 rounded-lg border border-border/70 bg-card flex items-center justify-between">
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                          Gift Card Claim URL
                        </span>
                        <span className="font-mono text-[11px] text-sky-600 dark:text-sky-400 block truncate">
                          {selectedRedemption.metadata.cardUrl}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(selectedRedemption.metadata!.cardUrl!, "Claim URL")}
                          className="h-6.5 text-[11px] font-semibold cursor-pointer gap-1 px-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => window.open(selectedRedemption.metadata!.cardUrl, "_blank", "noopener,noreferrer")}
                          className="h-6.5 text-[11px] font-semibold cursor-pointer gap-1 px-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* External Provider IDs */}
                  {(selectedRedemption.metadata?.externalId || selectedRedemption.metadata?.orderId) && (
                    <div className="p-2.5 rounded-lg border border-border/70 bg-card flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                          Provider Order / Ref ID ({selectedRedemption.metadata?.provider || "External"})
                        </span>
                        <span className="font-mono text-xs font-bold text-foreground">
                          {selectedRedemption.metadata?.externalId || selectedRedemption.metadata?.orderId}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(
                            selectedRedemption.metadata?.externalId || selectedRedemption.metadata?.orderId || "",
                            "External ID"
                          )
                        }
                        className="h-6.5 text-[11px] font-semibold cursor-pointer gap-1 px-2"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                    </div>
                  )}

                  {/* Idempotency Key */}
                  {selectedRedemption.metadata?.idempotencyKey && (
                    <div className="p-2.5 rounded-lg border border-border/70 bg-card flex items-center justify-between">
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="text-[10px] text-muted-foreground block uppercase font-semibold flex items-center gap-1">
                          <KeyRound className="h-3 w-3 text-violet-500" />
                          Idempotency Reference Key
                        </span>
                        <span className="font-mono text-[11px] text-foreground block truncate">
                          {selectedRedemption.metadata.idempotencyKey}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(selectedRedemption.metadata!.idempotencyKey!, "Idempotency Key")}
                        className="h-6.5 text-[11px] font-semibold cursor-pointer gap-1 px-2"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Timestamps: Claimed & Created */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  <Calendar className="h-3 w-3" />
                  <span>5. Audit Timestamps</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg border border-border/50 bg-muted/10 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                      Claimed At
                    </span>
                    <span className="text-foreground font-medium block">
                      {safeFormat(
                        selectedRedemption.claimedAt || selectedRedemption.createdAt,
                        "dd MMM yyyy, HH:mm:ss",
                        "N/A"
                      )}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg border border-border/50 bg-muted/10 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                      Created / Logged At
                    </span>
                    <span className="text-foreground font-medium block">
                      {safeFormat(selectedRedemption.createdAt, "dd MMM yyyy, HH:mm:ss", "N/A")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-4 bg-muted/20 border-t border-border/60 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const summary = JSON.stringify(selectedRedemption, null, 2);
                  copyToClipboard(summary, "Full Audit Payload");
                }}
                className="text-xs font-medium cursor-pointer gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Full JSON Payload
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => setSelectedRedemption(null)}
                className="text-xs font-semibold px-4 cursor-pointer"
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
