"use client";

import React from "react";
import { AdminTable, AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, Eye, Trash2, CheckCircle2, Ticket, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import moment from "moment";

export interface Voucher {
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

interface VoucherManagementTableProps {
  vouchers: Voucher[];
  isLoading: boolean;
  onViewDetails: (voucher: Voucher) => void;
  onMarkAsUsed: (voucherId: string) => void;
  onDelete: (voucherId: string) => void;
}

export function VoucherManagementTable({
  vouchers,
  isLoading,
  onViewDetails,
  onMarkAsUsed,
  onDelete,
}: VoucherManagementTableProps) {
  const { toast } = useToast();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Voucher code copied to clipboard.",
    });
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const daysUntilExpiry = moment(expiryDate).diff(moment(), 'days');
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const columns = [
    {
      key: "code",
      header: "Credential Code",
      cell: (voucher: Voucher) => (
        <div className="flex items-center gap-3 group">
          <div className="h-8 w-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
             <Ticket className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
               <code className="text-sm font-black text-foreground tracking-tight py-0.5">
                 {voucher.code}
               </code>
               <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard(voucher.code)}
                >
                  <Copy className="h-2.5 w-2.5" />
                </Button>
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">
               Digital Voucher
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "reward",
      header: "Associated Reward",
      cell: (voucher: Voucher) => (
        <div className="flex flex-col">
           <span className="text-sm font-bold text-foreground leading-tight">
             {voucher.rewardTitle || "System Reward"}
           </span>
           <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">
             ID: {voucher.offerId.substring(0, 8).toUpperCase()}
           </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (voucher: Voucher) => (
        <AdminStatusBadge status={voucher.isUsed ? "PENDING" : "APPROVED"}>
           {voucher.isUsed ? "Redeemed" : "Available"}
        </AdminStatusBadge>
      ),
    },
    {
      key: "assigned",
      header: "Attribution",
      cell: (voucher: Voucher) => (
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center">
             <User className="h-3 w-3 text-slate-500" />
          </div>
          <span className="text-[11px] font-bold text-foreground">
            {voucher.assignedTo || "Unassigned"}
          </span>
        </div>
      ),
    },
    {
      key: "timeline",
      header: "Expiry Date",
      cell: (voucher: Voucher) => {
        const expiringSoon = isExpiringSoon(voucher.expiryDate);
        return (
          <div className="flex flex-col">
            <span className={cn(
              "text-[11px] font-black uppercase tracking-tight",
              expiringSoon ? "text-amber-600" : "text-muted-foreground"
            )}>
              {voucher.expiryDate ? moment(voucher.expiryDate).format("MMM D, YYYY") : "No Limit"}
            </span>
            {expiringSoon && (
               <span className="text-[9px] text-amber-500 font-bold uppercase animate-pulse">
                 Critical: Expiring Soon
               </span>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (voucher: Voucher) => (
        <div className="flex justify-end pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted rounded-lg transition-all">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl border-border shadow-lg">
              <DropdownMenuItem
                className="gap-2 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer"
                onClick={() => onViewDetails(voucher)}
              >
                <Eye className="h-4 w-4 opacity-70" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer"
                onClick={() => copyToClipboard(voucher.code)}
              >
                <Copy className="h-4 w-4 opacity-70" /> Copy Code
              </DropdownMenuItem>
              {!voucher.isUsed && (
                <DropdownMenuItem
                  className="gap-2 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer text-emerald-600 focus:text-emerald-700"
                  onClick={() => onMarkAsUsed(voucher.id)}
                >
                  <CheckCircle2 className="h-4 w-4 opacity-70" /> Mark as Used
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="gap-2 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer text-rose-600 focus:text-rose-700"
                onClick={() => onDelete(voucher.id)}
              >
                <Trash2 className="h-4 w-4 opacity-70" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={vouchers}
      loading={isLoading}
      keyExtractor={(v) => v.id}
      emptyTitle="No vouchers detected"
      emptyDescription="Upload a CSV of codes to start distributing unique rewards to your members."
    />
  );
}
