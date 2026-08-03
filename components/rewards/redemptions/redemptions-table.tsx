"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AppDataTable } from "@/components/ui/app-data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";

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
  };
  ecUsed: number;
  tcUsed: number;
  totalCost: number;
  claimedAt: string;
  status: string;
  metadata?: {
    voucherCode?: string;
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
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code copied to clipboard.",
    });
  };

  const getStatusType = (status: string) => {
    const s = status?.toUpperCase();
    if (s === "SUCCESS" || s === "COMPLETED" || s === "FULFILLED") return "APPROVED";
    if (s === "PENDING") return "PENDING";
    if (s === "FAILED" || s === "REJECTED") return "REJECTED";
    return "DISABLED";
  };

  const columns: ColumnDef<Redemption>[] = [
    {
      id: "user",
      accessorFn: (row) =>
        `${row.user.firstName} ${row.user.lastName} ${row.user.email}`,
      header: "User",
      cell: ({ row }) => {
        const user = row.original.user;
        const fullName = `${user.firstName} ${user.lastName}`;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-1 ring-border">
              <AvatarImage src={`${process.env.NEXT_PUBLIC_CDN_URL}/${user.avatar}`} />
              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-foreground truncate max-w-[120px]">
                {fullName}
              </span>
              <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                {user.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "reward.title",
      header: "Coupon",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.reward?.title}
        </span>
      ),
    },
    {
      accessorKey: "tcUsed",
      header: "TC Spent",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-tighter">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {row.original.tcUsed || 0} TC
          </div>
          {row.original.ecUsed > 0 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-tighter">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {row.original.ecUsed} EC
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "claimedAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.claimedAt
            ? new Date(row.original.claimedAt).toLocaleDateString()
            : "-"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <AdminStatusBadge status={getStatusType(row.original.status)}>
          {row.original.status || "Completed"}
        </AdminStatusBadge>
      ),
    },
    {
      id: "voucherCode",
      header: "Voucher Code",
      cell: ({ row }) => {
        const code = row.original.metadata?.voucherCode;
        if (!code)
          return (
            <span className="text-muted-foreground text-xs italic">
              Internal Reward
            </span>
          );

        return (
          <div className="flex items-center gap-2 group">
            <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded border border-border">
              {code}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => copyToClipboard(code)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <AppDataTable
      columns={columns}
      data={redemptions}
      isLoading={isLoading}
      searchableColumns={[{ id: "user", placeholder: "Search users..." }]}
      isShowExportButtons={true}
    />
  );
}
