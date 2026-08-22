"use client";

import React from "react";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableItem,
  AdminTableTag,
  AdminStatusBadge,
} from "@/components/shared/admin-table/admin-table";
import {
  Gift,
  CheckCircle2,
  AlertTriangle,
  Clock,
  KeyRound,
  MoreVertical,
  Copy,
  Receipt,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GiftCardIssuanceRecord } from "../types";
import { safeFormat } from "@/lib/date-utils";
import { toast } from "sonner";

export const getGiftCardLedgerTableColumns = (): AdminTableColumn<GiftCardIssuanceRecord>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "member",
    header: "Winning Member",
    cell: (record) => (
      <AdminTableItem
        icon={<User className="h-4 w-4 text-violet-600" />}
        title={record.memberName}
        subtitle={record.memberEmail}
      />
    ),
  },
  {
    key: "reward",
    header: "Gift Card Issued",
    cell: (record) => (
      <div>
        <span className="font-bold text-xs text-foreground block">
          ₹{record.cardValue} {record.brand} Card
        </span>
        <span className="text-[10px] text-muted-foreground font-mono">
          Via {record.gameSource}
        </span>
      </div>
    ),
  },
  {
    key: "financials",
    header: "Financial Breakdown",
    cell: (record) => (
      <div className="text-xs font-mono">
        <span className="font-bold text-emerald-700 dark:text-emerald-300">
          ₹{record.totalDeducted} Deducted
        </span>
        <div className="text-[10px] text-muted-foreground">
          ₹{record.cardValue} card + ₹{record.serviceFee} fee
        </div>
      </div>
    ),
  },
  {
    key: "status",
    header: "Provider Status",
    cell: (record) => {
      if (record.status === "DELIVERED") {
        return <AdminTableTag variant="emerald">Delivered</AdminTableTag>;
      }
      if (record.status === "RESERVED") {
        return <AdminTableTag variant="sky">Reserved</AdminTableTag>;
      }
      return <AdminTableTag variant="amber">Released (Failed)</AdminTableTag>;
    },
  },
  {
    key: "idempotency",
    header: "Idempotency Reference",
    cell: (record) => (
      <div className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
        <KeyRound className="h-3 w-3 text-violet-500" />
        <span className="truncate max-w-[140px]">{record.idempotencyKey}</span>
      </div>
    ),
  },
  {
    key: "issuedAt",
    header: "Issued Date",
    cell: (record) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {safeFormat(record.issuedAt, "dd MMM yyyy, HH:mm", "Recently")}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    headerClassName: "w-12 text-center",
    className: "text-center",
    isFixedRight: true,
    cell: (record) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md cursor-pointer">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(record.idempotencyKey);
              toast.success("Copied Idempotency Key");
            }}
            className="text-xs gap-2 cursor-pointer"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy Idempotency Key
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              toast.info(`Transaction Details: ${record.id}`, {
                description: `Cost: ₹${record.cardValue} | Fee: ₹${record.serviceFee} | Net: ₹${record.totalDeducted} | Status: ${record.status}`,
              });
            }}
            className="text-xs gap-2 cursor-pointer"
          >
            <Receipt className="h-3.5 w-3.5" />
            View Full Receipt
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

interface GiftCardLedgerListProps {
  records: GiftCardIssuanceRecord[];
  loading?: boolean;
}

export function GiftCardLedgerList({
  records,
  loading = false,
}: GiftCardLedgerListProps) {
  const columns = React.useMemo(() => getGiftCardLedgerTableColumns(), []);

  return (
    <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
      <AdminTable
        columns={columns}
        data={records}
        loading={loading}
        keyExtractor={(item) => item.id}
        emptyTitle="No Gift Card Issuance Records Yet"
        emptyDescription="When members win digital gift cards in engagement games, transaction entries will appear here."
      />
    </div>
  );
}
