"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
  };
  tcUsed: number;
  claimedAt: string;
  status: "Success" | "Failed" | "Pending";
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

  const statusIcons = {
    Success: <CheckCircle2 className="h-3 w-3" />,
    Pending: <Clock className="h-3 w-3" />,
    Failed: <AlertCircle className="h-3 w-3" />,
  };

  const statusColors = {
    Success: "text-emerald-600 bg-emerald-50 border-emerald-200",
    Pending: "text-amber-600 bg-amber-50 border-amber-200",
    Failed: "text-rose-600 bg-rose-50 border-rose-200",
  };

  const columns: ColumnDef<Redemption>[] = [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original.user;
        const fullName = `${user.firstName} ${user.lastName}`;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-1 ring-border">
              <AvatarImage src={user.avatar} />
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
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <div className="h-4 w-4 rounded-full bg-amber-400 flex items-center justify-center text-[8px] text-amber-900 border border-amber-500/20">
            TC
          </div>
          {row.original.tcUsed}
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
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] uppercase font-bold px-1.5 py-0 h-5 gap-1",
            statusColors[row.original.status] ||
              "text-muted-foreground bg-muted",
          )}
        >
          {statusIcons[row.original.status]}
          {row.original.status}
        </Badge>
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
    <DataTable columns={columns} data={redemptions} isLoading={isLoading} />
  );
}
