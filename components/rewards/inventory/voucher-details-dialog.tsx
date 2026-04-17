"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  CheckCircle2,
  Trash2,
  Calendar,
  User,
  Package,
  Ticket,
  Clock,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import moment from "moment";

interface Voucher {
  id: string;
  code: string;
  rewardId: string;
  rewardTitle?: string;
  isUsed: boolean;
  assignedTo?: string;
  assignedAt?: string;
  expiryDate?: string;
  createdAt: string;
}

interface VoucherDetailsDialogProps {
  voucher: Voucher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkAsUsed: (voucherId: string) => void;
  onDelete: (voucherId: string) => void;
}

export function VoucherDetailsDialog({
  voucher,
  open,
  onOpenChange,
  onMarkAsUsed,
  onDelete,
}: VoucherDetailsDialogProps) {
  const { toast } = useToast();

  if (!voucher) return null;

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Voucher code copied to clipboard.",
    });
  };

  const handleMarkAsUsed = () => {
    onMarkAsUsed(voucher.id);
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDelete(voucher.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden border-border shadow-2xl">
        <div className="p-8 space-y-8">
           <DialogHeader className="text-left">
              <div className="flex items-center gap-4">
                 <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
                    <Ticket className="h-6 w-6 text-indigo-600" />
                 </div>
                 <div>
                    <DialogTitle className="text-xl font-black uppercase tracking-tight">Credential Audit</DialogTitle>
                    <DialogDescription className="text-xs font-medium text-muted-foreground mt-1">
                       Deep inspection of unique voucher code and attribution metadata.
                    </DialogDescription>
                 </div>
              </div>
           </DialogHeader>

           <div className="space-y-6">
              {/* Voucher Code Node */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                  Active Code String
                </label>
                <div className="flex items-center gap-3 p-1.5 bg-zinc-50 border border-zinc-200 rounded-2xl shadow-inner group">
                  <div className="flex-1 px-4 py-3 font-mono text-2xl font-black text-foreground tracking-tighter">
                    {voucher.code}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-xl hover:bg-white hover:shadow-md transition-all shrink-0"
                    onClick={() => copyToClipboard(voucher.code)}
                  >
                    <Copy className="h-5 w-5 text-indigo-500" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                    System Status
                  </label>
                  <div className="flex">
                    <AdminStatusBadge status={voucher.isUsed ? "PENDING" : "APPROVED"}>
                      {voucher.isUsed ? "Fully Redeemed" : "Active & Available"}
                    </AdminStatusBadge>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                    Reward Parent
                  </label>
                  <div className="flex items-center gap-3 px-3 py-2 bg-muted/40 rounded-xl border border-border/50">
                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground truncate">
                      {voucher.rewardTitle || "System Resource"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assignment Info */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                  Claim Attribution
                </label>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100/50">
                  <div className="h-10 w-10 rounded-full bg-white border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
                    <User className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-indigo-900 leading-none">
                      {voucher.assignedTo || "Autonomous Pool"}
                    </p>
                    <p className="text-[10px] text-indigo-600/70 font-bold mt-1.5 uppercase tracking-widest">
                      {voucher.assignedAt ? `Linked on ${moment(voucher.assignedAt).format("MMMM D, YYYY")}` : "Unallocated Resource"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lifecycle Dates */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                    Ingestion Date
                  </label>
                  <div className="flex items-center gap-3 text-xs font-bold text-foreground px-3 py-2 bg-zinc-50 rounded-xl border border-zinc-200/50">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {moment(voucher.createdAt).format("MMM D, YYYY")}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                    Expiration Node
                  </label>
                  <div className="flex items-center gap-3 text-xs font-bold text-foreground px-3 py-2 bg-zinc-50 rounded-xl border border-zinc-200/50">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {voucher.expiryDate ? moment(voucher.expiryDate).format("MMM D, YYYY") : "Infinite Lifecycle"}
                  </div>
                </div>
              </div>
           </div>
        </div>

        <div className="bg-zinc-50 p-6 flex items-center justify-end gap-3 border-t border-border/50">
          <Button variant="ghost" className="rounded-xl font-bold text-xs uppercase tracking-widest" onClick={() => onOpenChange(false)}>
            Dismiss
          </Button>
          {!voucher.isUsed && (
            <Button
              className="gap-2 h-11 px-6 rounded-xl font-black uppercase tracking-widest shadow-lg ring-1 ring-black/10"
              onClick={handleMarkAsUsed}
            >
              <CheckCircle2 className="h-4 w-4" /> Force Redemption
            </Button>
          )}
          <Button
            variant="ghost"
            className="h-11 w-11 rounded-xl p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-600 border border-rose-100/50 shadow-sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
