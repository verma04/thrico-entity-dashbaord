"use client";

import React from "react";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import { Copy, Coins, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  UserProfileHoverCard,
  UserProfileHoverData,
} from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";

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
  createdAt: string;
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
  const currencyModuleName = useModuleStore(
    (state) => state.currencyModuleName,
  );
  const { data } = useGetEntityCurrencyConfig();
  const currencyName = data?.getEntityCurrencyConfig?.currencyName || currencyModuleName;

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
      key: "user",
      header: "Member",
      cell: (row: Redemption) => {
        const user = row.user;
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
        const hoverUser: UserProfileHoverData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar || "",
        };
        return (
          <UserProfileHoverCard user={hoverUser}>
            <div>
              <AdminTableItem
                avatar={user.avatar}
                title={fullName}
                subtitle={user.email}
                fallbackText={user.firstName?.[0]}
                onClick={() => {}}
              />
            </div>
          </UserProfileHoverCard>
        );
      },
    },
    {
      key: "reward",
      header: "Reward",
      cell: (row: Redemption) => (
        <span className="text-[12px] font-medium text-foreground">
          {row.reward?.title || "—"}
        </span>
      ),
    },
    {
      key: "tcUsed",
      header: "Coins Spent",
      cell: (row: Redemption) => (
        <AdminTableMetric
          icon={Coins}
          value={row.ecUsed || 0}
          unit={currencyName || "EC"}
          variant="amber"
        />
      ),
    },
    {
      key: "createdAt",
      header: "Date & Time",
      cell: (row: Redemption) => (
        <AdminTableDate date={row.createdAt || row.claimedAt} />
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
            <span className="text-muted-foreground text-[11px] italic">
              Internal Reward
            </span>
          );

        return (
          <div className="flex items-center gap-1.5 group">
            <span className="font-mono text-[11px] bg-muted/60 px-1.5 py-0.5 rounded border border-border/60">
              {code}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded"
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
      emptyIcon={Ticket}
      size="sm"
    />
  );
}
