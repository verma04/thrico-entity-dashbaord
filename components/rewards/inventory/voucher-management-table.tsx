"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, Eye, Trash2, CheckCircle2 } from "lucide-react";
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

  const columns: ColumnDef<Voucher>[] = [
    {
      accessorKey: "code",
      header: "Voucher Code",
      cell: ({ row }) => {
        const voucher = row.original;
        return (
          <div className="flex items-center gap-2">
            <code className="px-2 py-1 rounded bg-muted font-mono text-sm font-bold">
              {voucher.code}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
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
        <span className="font-medium text-foreground">
          {row.original.rewardTitle || "Unknown"}
        </span>
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
              "text-xs uppercase font-bold px-2 py-0 h-5",
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
          <span className="text-sm text-muted-foreground">{assignedTo}</span>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            Not assigned
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
                "text-sm",
                expiringSoon && "text-amber-600 font-medium",
              )}
            >
              {new Date(expiryDate).toLocaleDateString()}
            </span>
            {expiringSoon && (
              <Badge
                variant="outline"
                className="text-xs bg-amber-50 text-amber-600 border-amber-200"
              >
                Soon
              </Badge>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            No expiry
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
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => onViewDetails(voucher)}
                >
                  <Eye className="h-4 w-4" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => copyToClipboard(voucher.code)}
                >
                  <Copy className="h-4 w-4" /> Copy Code
                </DropdownMenuItem>
                {!voucher.isUsed && (
                  <DropdownMenuItem
                    className="gap-2 text-emerald-600"
                    onClick={() => onMarkAsUsed(voucher.id)}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark as Used
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="gap-2 text-destructive"
                  onClick={() => onDelete(voucher.id)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={vouchers} isLoading={isLoading} />;
}
