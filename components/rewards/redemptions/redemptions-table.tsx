"use client";

import React from "react";
import { AdminTable } from "@/components/shared/admin-table/admin-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import {
  UserProfileHoverCard,
  UserProfileHoverData,
} from "@/components/shared/user-profile-hover-card";

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
    if (s === "SUCCESS" || s === "COMPLETED" || s === "FULFILLED")
      return "APPROVED";
    if (s === "PENDING") return "PENDING";
    if (s === "FAILED" || s === "REJECTED") return "REJECTED";
    return "DISABLED";
  };

  const columns = [
    {
      key: "rank",
      header: "Rank",
      cell: (row: Redemption, index: number) => (
        <span className="font-mono text-xs text-muted-foreground font-semibold">
          #{index + 1}
        </span>
      ),
    },
    {
      key: "user",
      header: "User",
      cell: (row: Redemption) => {
        const user = row.user;
        const fullName = `${user.firstName} ${user.lastName}`;
        const hoverUser: UserProfileHoverData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar || "",
        };
        return (
          <UserProfileHoverCard user={hoverUser}>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="h-8 w-8 border border-border shrink-0">
                <AvatarImage src={`https://cdn.thrico.network/${user.avatar}`} />
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-foreground truncate max-w-[120px] hover:underline">
                  {fullName}
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>
            </div>
          </UserProfileHoverCard>
        );
      },
    },
    {
      key: "reward",
      header: "Coupon",
      cell: (row: Redemption) => (
        <span className="font-medium text-foreground">
          {row.reward?.title}
        </span>
      ),
    },
    {
      key: "tcUsed",
      header: "TC Spent",
      cell: (row: Redemption) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-tighter">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {row.tcUsed || 0} TC
          </div>
          {row.ecUsed > 0 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-tighter">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {row.ecUsed} EC
            </div>
          )}
        </div>
      ),
    },
    {
      key: "claimedAt",
      header: "Date",
      cell: (row: Redemption) => (
        <span className="text-sm text-muted-foreground">
          {row.claimedAt
            ? new Date(row.claimedAt).toLocaleDateString()
            : "-"}
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
      key: "voucherCode",
      header: "Voucher Code",
      cell: (row: Redemption) => {
        const code = row.metadata?.voucherCode;
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
    <AdminTable
      columns={columns}
      data={redemptions || []}
      loading={isLoading}
      keyExtractor={(node) => node.id}
      emptyTitle="No redemptions found"
      emptyDescription="No rewards have been claimed yet."
    />
  );
}
