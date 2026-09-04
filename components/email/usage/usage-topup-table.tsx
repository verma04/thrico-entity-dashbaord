"use client";

import React from "react";
import {
  AdminTable,
  AdminTableItem,
  AdminTableMetric,
  AdminTableDate,
  AdminStatusBadge,
} from "@/components/shared/admin-table/admin-table";
import { CreditCard, CheckCircle2, Zap } from "lucide-react";
import { EmailTopupHistory } from "@/graphql/actions/email";
import { safeFormat } from "@/lib/date-utils";

interface UsageTopupTableProps {
  history: EmailTopupHistory[];
  isLoading?: boolean;
}

export function UsageTopupTable({ history, isLoading }: UsageTopupTableProps) {
  const columns = [
    {
      key: "item",
      header: "Top-Up Transaction",
      cell: (item: EmailTopupHistory) => (
        <AdminTableItem
          icon={CreditCard}
          title={`Credit Package Top-Up`}
          subtitle={`Ref: ${item.id ? item.id.slice(0, 12) : "Manual Order"}`}
        />
      ),
    },
    {
      key: "credits",
      header: "Credits Added",
      cell: (item: EmailTopupHistory) => (
        <AdminTableMetric
          icon={Zap}
          value={`+${item.extraEmails.toLocaleString()}`}
          unit="Credits"
          variant="emerald"
        />
      ),
    },
    {
      key: "status",
      header: "Payment Status",
      cell: () => (
        <AdminStatusBadge
          status="COMPLETED"
          variant="success"
        />
      ),
    },
    {
      key: "date",
      header: "Purchase Date",
      cell: (item: EmailTopupHistory) => (
        <AdminTableDate
          date={item.purchasedAt}
          time={item.purchasedAt ? safeFormat(item.purchasedAt, "hh:mm a", "") : null}
          icon={true}
        />
      ),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={history || []}
      loading={isLoading}
      keyExtractor={(item) => item.id || `${item.extraEmails}-${item.purchasedAt}`}
      emptyIcon={CreditCard}
      emptyTitle="No top-up transactions yet"
      emptyDescription="Instant quota additions and extra credit purchases will be logged here with invoices."
      size="sm"
      pageSize={10}
      loadingRows={5}
    />
  );
}
