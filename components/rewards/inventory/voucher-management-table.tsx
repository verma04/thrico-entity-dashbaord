"use client";

import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AppDataTable } from "@/components/ui/app-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, Eye, Trash2, CheckCircle2, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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

  const getStatusColor = (isUsed: boolean) => {
    return isUsed
      ? "text-muted-foreground bg-muted border-transparent"
      : "text-emerald-600 bg-emerald-50 border-emerald-200";
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const columns = useMemo<ColumnDef<Voucher>[]>(() => [
    {
      accessorKey: "code",
      header: "Voucher Code",
      cell: ({ row }) => {
        const voucher = row.original;
        return (
          <div className="flex items-center gap-2 group">
            <code className="px-2 py-1 rounded bg-slate-50 border border-slate-100 font-mono text-sm font-bold text-slate-900 group-hover:bg-white transition-colors shadow-sm">
              {voucher.code}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => copyToClipboard(voucher.code)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "rewardTitle",
      header: "Reward",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
           <Ticket className="h-3.5 w-3.5 text-slate-400" />
           <span className="font-semibold text-slate-900 leading-tight">
             {row.original.rewardTitle || "Unknown"}
           </span>
        </div>
      ),
    },
    {
      accessorKey: "isUsed",
      header: "Status",
      cell: ({ row }) => {
        const isUsed = row.original.isUsed;
        return (
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] uppercase font-bold px-2 py-0 h-5 tracking-tight",
              getStatusColor(isUsed),
            )}
          >
            {isUsed ? "Used" : "Available"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => {
        const assignedTo = row.original.assignedTo;
        return assignedTo ? (
          <span className="text-xs font-medium text-slate-600">{assignedTo}</span>
        ) : (
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Unassigned
          </span>
        );
      },
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) => {
        const expiryDate = row.original.expiryDate;
        const expiringSoon = isExpiringSoon(expiryDate);

        return expiryDate ? (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-xs font-medium",
                expiringSoon ? "text-amber-600 font-bold" : "text-slate-500",
              )}
            >
              {new Date(expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {expiringSoon && (
              <Badge
                variant="outline"
                className="text-[9px] bg-amber-50 text-amber-600 border-amber-200 px-1 py-0 h-4 uppercase font-black"
              >
                Soon
              </Badge>
            )}
          </div>
        ) : (
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Never
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const voucher = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-50 rounded-xl transition-all">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-2xl border-slate-200 shadow-xl">
                <DropdownMenuItem
                  className="gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl cursor-pointer"
                  onClick={() => onViewDetails(voucher)}
                >
                  <Eye className="h-4 w-4 opacity-70" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl cursor-pointer"
                  onClick={() => copyToClipboard(voucher.code)}
                >
                  <Copy className="h-4 w-4 opacity-70" /> Copy Code
                </DropdownMenuItem>
                {!voucher.isUsed && (
                  <DropdownMenuItem
                    className="gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl cursor-pointer text-emerald-600 focus:text-emerald-700"
                    onClick={() => onMarkAsUsed(voucher.id)}
                  >
                    <CheckCircle2 className="h-4 w-4 opacity-70" /> Mark as Used
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl cursor-pointer text-rose-600 focus:text-rose-700"
                  onClick={() => onDelete(voucher.id)}
                >
                  <Trash2 className="h-4 w-4 opacity-70" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ], [onViewDetails, onMarkAsUsed, onDelete]);

  return (
    <AppDataTable 
      columns={columns} 
      data={vouchers} 
      isLoading={isLoading} 
      isShowExportButtons={true}
      searchableColumns={[{ id: "code", placeholder: "Search vouchers..." }]}
    />
  );
}
