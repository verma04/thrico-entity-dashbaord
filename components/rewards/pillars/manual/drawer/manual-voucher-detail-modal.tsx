"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Ticket,
  Copy,
  Check,
  Calendar,
  User,
  Shield,
  Layers,
  Link as LinkIcon,
  Clock,
  Package,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { safeFormat } from "@/lib/date-utils";
import { toast } from "sonner";
import {
  ManualVoucher,
  ManualVoucherStatus,
  ManualCouponType,
} from "@/graphql/actions/rewards/manual";

interface ManualVoucherDetailModalProps {
  voucher: ManualVoucher | null;
  isOpen: boolean;
  onClose: () => void;
  onVoid?: (id: string) => void;
}

export function ManualVoucherDetailModal({
  voucher,
  isOpen,
  onClose,
  onVoid,
}: ManualVoucherDetailModalProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  if (!voucher) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusBadge = (status: ManualVoucherStatus) => {
    switch (status) {
      case ManualVoucherStatus.UNASSIGNED:
        return (
          <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 font-bold text-xs">
            UNASSIGNED
          </Badge>
        );
      case ManualVoucherStatus.ASSIGNED:
        return (
          <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 font-bold text-xs">
            ASSIGNED
          </Badge>
        );
      case ManualVoucherStatus.REDEEMED:
        return (
          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 font-bold text-xs">
            REDEEMED
          </Badge>
        );
      case ManualVoucherStatus.EXPIRED:
        return (
          <Badge className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 font-bold text-xs">
            EXPIRED
          </Badge>
        );
      case ManualVoucherStatus.VOID:
        return (
          <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 font-bold text-xs">
            VOID
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">
        <DialogHeader className="p-5 pb-4 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Voucher Record Details
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  ID: <span className="font-mono">{voucher.id}</span>
                </DialogDescription>
              </div>
            </div>
            {getStatusBadge(voucher.status)}
          </div>
        </DialogHeader>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Main Voucher Code Card */}
          <div className="p-4 rounded-xl border border-border bg-card shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Voucher Code
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(voucher.code, "Voucher Code")}
                className="h-7 text-xs font-semibold gap-1.5 cursor-pointer"
              >
                {copiedField === "Voucher Code" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Copy Code
              </Button>
            </div>
            <div className="font-mono text-xl font-black text-foreground bg-muted/40 p-3 rounded-lg border border-border/60 text-center tracking-wider select-all">
              {voucher.code}
            </div>

            {/* Optional Card Number, PIN, Claim URL */}
            {(voucher.cardNumber || voucher.pin || voucher.claimUrl) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
                {voucher.cardNumber && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground font-medium">Card No:</span>
                    <span className="font-mono font-bold">{voucher.cardNumber}</span>
                  </div>
                )}
                {voucher.pin && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground font-medium">PIN:</span>
                    <span className="font-mono font-bold">{voucher.pin}</span>
                  </div>
                )}
                {voucher.claimUrl && (
                  <div className="col-span-full flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                      <LinkIcon className="h-3.5 w-3.5" /> Claim URL:
                    </span>
                    <a
                      href={voucher.claimUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-600 hover:underline truncate max-w-[260px]"
                    >
                      {voucher.claimUrl}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Associated Reward & Architecture */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-border bg-card space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Associated Reward
              </span>
              <p className="font-semibold text-foreground truncate">
                {voucher.reward?.title || "Direct Voucher"}
              </p>
              {voucher.reward?.tcCost !== undefined && (
                <p className="text-[11px] text-muted-foreground">
                  Cost: {voucher.reward.tcCost} TC
                </p>
              )}
            </div>

            <div className="p-3 rounded-lg border border-border bg-card space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Architecture Type
              </span>
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-emerald-600" />
                {voucher.couponType === ManualCouponType.ONE_TO_ONE
                  ? "1:1 Serial Pool (Unique)"
                  : "1:N Shared Promo"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Batch: {voucher.batch?.name || "Standalone / Manual"}
              </p>
            </div>
          </div>

          {/* Assignment / Consumer Information */}
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Assignment & User Status
            </span>
            {voucher.assignedToUser ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 rounded-lg border border-border">
                  <AvatarImage src={voucher.assignedToUser.avatar || undefined} />
                  <AvatarFallback className="font-bold text-xs">
                    {(voucher.assignedToUser.firstName?.[0] || "") +
                      (voucher.assignedToUser.lastName?.[0] || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-foreground truncate">
                    {voucher.assignedToUser.firstName}{" "}
                    {voucher.assignedToUser.lastName}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {voucher.assignedToUser.email || voucher.assignedTo}
                  </p>
                </div>
                {voucher.assignedAt && (
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    Assigned: {safeFormat(voucher.assignedAt, "dd MMM yyyy")}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                <User className="h-4 w-4 opacity-50" />
                <span>Currently unassigned — waiting in active allocation pool.</span>
              </div>
            )}
          </div>

          {/* Timeline & Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
            <div className="p-2.5 rounded bg-muted/20 border border-border/50">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                Created At
              </span>
              <span className="font-medium text-foreground">
                {safeFormat(voucher.createdAt, "dd MMM yyyy, HH:mm")}
              </span>
            </div>
            <div className="p-2.5 rounded bg-muted/20 border border-border/50">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                Redeemed At
              </span>
              <span className="font-medium text-foreground">
                {voucher.redeemedAt
                  ? safeFormat(voucher.redeemedAt, "dd MMM yyyy, HH:mm")
                  : "Not yet redeemed"}
              </span>
            </div>
            <div className="p-2.5 rounded bg-muted/20 border border-border/50">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                Expiry Date
              </span>
              <span className="font-medium text-foreground">
                {voucher.expiryDate
                  ? safeFormat(voucher.expiryDate, "dd MMM yyyy")
                  : "No Expiry"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          {voucher.status !== ManualVoucherStatus.VOID &&
            voucher.status !== ManualVoucherStatus.REDEEMED &&
            onVoid && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onVoid(voucher.id);
                  onClose();
                }}
                className="gap-1.5"
              >
                <Shield className="h-3.5 w-3.5" />
                Void Voucher
              </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
