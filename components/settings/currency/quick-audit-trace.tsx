"use client";

import React, { useState, useMemo } from "react";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  UserProfileHoverCard,
  UserProfileHoverData,
} from "@/components/shared/user-profile-hover-card";
import { format, startOfDay, endOfDay } from "date-fns";
import { safeFormat } from "@/lib/date-utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  Activity,
  RotateCcw,
  Info,
  ArrowRight,
  X,
  AlertCircle,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCurrencyTransactions } from "@/graphql/actions/currency";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useModuleStore } from "@/store/useModuleStore";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";

export type CurrencyTransactionNode = {
  transactionId: string;
  userId: string;
  userBasicInfo?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  type: string;
  entityId: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: any;
  timestamp: string;
};

export function QuickAuditTrace() {
  const currencyModuleName = useModuleStore(
    (state) => state.currencyModuleName,
  );
  const [search, setSearch] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [showExportModal, setShowExportModal] = useState(false);

  // Fetch directly linked from GraphQL backend
  const { data, loading, error, refetch } = useGetCurrencyTransactions({
    limit: 100,
  });

  const transactions: CurrencyTransactionNode[] =
    data?.getCurrencyTransactions?.items || [];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "POINTS_TO_EC":
        return {
          label: `Points → ${currencyModuleName}`,
          className:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900",
        };
      case "EC_TO_TC":
        return {
          label: `${currencyModuleName} → TC`,
          className:
            "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900",
        };
      case "TC_DEBIT":
        return {
          label: "TC Debit",
          className:
            "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900",
        };
      case "EC_DEBIT":
        return {
          label: `${currencyModuleName} Debit`,
          className:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
        };
      case "POINTS_AWARD":
        return {
          label: "Points Award",
          className:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
        };
      default:
        return {
          label: type?.replace(/_/g, " ") || "Transaction",
          className:
            "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
        };
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Search text filter (Person name, module, ID, metadata)
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const firstName = tx.userBasicInfo?.firstName || "";
        const lastName = tx.userBasicInfo?.lastName || "";
        const fullName = `${firstName} ${lastName}`.toLowerCase();
        const userId = (tx.userId || "").toLowerCase();
        const type = (tx.type || "").toLowerCase();
        const badgeLabel = getTypeBadge(tx.type).label.toLowerCase();
        const metaStr = tx.metadata
          ? JSON.stringify(tx.metadata).toLowerCase()
          : "";

        const matchesSearch =
          fullName.includes(q) ||
          userId.includes(q) ||
          type.includes(q) ||
          badgeLabel.includes(q) ||
          metaStr.includes(q);

        if (!matchesSearch) return false;
      }

      // 2. Module / Type filter
      if (selectedModule !== "ALL") {
        if (tx.type !== selectedModule) return false;
      }

      // 3. Date range filter
      if (dateRange?.from) {
        const txDate = tx.timestamp ? new Date(tx.timestamp).getTime() : NaN;
        if (!isNaN(txDate)) {
          const fromTime = startOfDay(dateRange.from).getTime();
          const toTime = dateRange.to
            ? endOfDay(dateRange.to).getTime()
            : endOfDay(dateRange.from).getTime();

          if (txDate < fromTime || txDate > toTime) {
            return false;
          }
        }
      }

      return true;
    });
  }, [transactions, search, selectedModule, dateRange, currencyModuleName]);

  const hasActiveFilters = Boolean(
    search.trim() || selectedModule !== "ALL" || dateRange?.from,
  );

  const handleClearFilters = () => {
    setSearch("");
    setSelectedModule("ALL");
    setDateRange(undefined);
  };

  const columns: AdminTableColumn<CurrencyTransactionNode>[] = [
    {
      key: "rank",
      header: "#",
      headerClassName: "w-10 text-center",
      className: "text-center",
      cell: (_tx, index) => (
        <span className="font-mono text-[11px] text-muted-foreground font-semibold">
          #{index + 1}
        </span>
      ),
    },
    {
      key: "member",
      header: "Member",
      cell: (tx) => {
        const user = tx.userBasicInfo || {};
        const firstName = user.firstName || "Member";
        const lastName = user.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();
        const avatarUrl = user.avatar || "";
        const fullAvatar = avatarUrl.startsWith("http")
          ? avatarUrl
          : avatarUrl
            ? `https://cdn.thrico.network/${avatarUrl}`
            : "";

        const hoverUser: UserProfileHoverData = {
          id: tx.userId || user.id || "",
          firstName,
          lastName,
          avatar: avatarUrl,
        };

        return (
          <UserProfileHoverCard user={hoverUser}>
            <div>
              <AdminTableItem
                avatar={fullAvatar}
                title={fullName}
                subtitle={`ID: ${(tx.userId || user.id || "").substring(0, 8)}`}
                fallbackText={firstName.substring(0, 2).toUpperCase()}
                onClick={() => {}}
              />
            </div>
          </UserProfileHoverCard>
        );
      },
    },
    {
      key: "type",
      header: "Module / Type",
      cell: (tx) => {
        const variantMap: Record<
          string,
          "indigo" | "purple" | "rose" | "amber" | "emerald" | "default"
        > = {
          POINTS_TO_EC: "indigo",
          EC_TO_TC: "purple",
          TC_DEBIT: "rose",
          EC_DEBIT: "amber",
          POINTS_AWARD: "emerald",
        };
        const variant = variantMap[tx.type] || "default";
        return (
          <AdminTableTag variant={variant}>
            {getTypeBadge(tx.type).label}
          </AdminTableTag>
        );
      },
    },
    {
      key: "amount",
      header: "Movement",
      cell: (tx) => {
        const isDebit = tx.type?.includes("DEBIT");
        return (
          <AdminTableMetric
            icon={isDebit ? ArrowDownRight : ArrowUpRight}
            value={`${isDebit ? "-" : "+"}${Number(tx.amount || 0).toLocaleString()}`}
            variant={isDebit ? "rose" : "emerald"}
          />
        );
      },
    },
    {
      key: "balance",
      header: "Balance After",
      cell: (tx) => (
        <AdminTableMetric
          value={Number(tx.balanceAfter || 0).toLocaleString()}
          variant="mono"
        />
      ),
    },
    {
      key: "date",
      header: "Date & Time",
      cell: (tx) => {
        const dateObj = tx.timestamp ? new Date(tx.timestamp) : null;
        const validDate = dateObj && !isNaN(dateObj.getTime());
        return (
          <AdminTableDate
            date={validDate ? dateObj : tx.timestamp}
            time={
              validDate
                ? format(dateObj, "hh:mm a")
                : safeFormat(tx.timestamp, "HH:mm")
            }
          />
        );
      },
    },
    {
      key: "info",
      header: "Details",
      headerClassName: "text-center w-12",
      className: "text-center",
      cell: (tx) => {
        if (!tx.metadata)
          return <span className="text-[10px] text-muted-foreground">—</span>;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-md"
                >
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <pre className="text-[10px] max-w-[220px] overflow-auto">
                  {typeof tx.metadata === "object"
                    ? JSON.stringify(tx.metadata, null, 2)
                    : String(tx.metadata)}
                </pre>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
  ];

  return (
    <>
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          {/* 1. Search Field - Person Name or Module */}
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search by person name or module..."
            />
          </EcosystemActionBar.Item>

          {/* 2. Module / Type Selector Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={selectedModule}
              onValueChange={setSelectedModule}
            >
              <SelectTrigger className="h-9 min-w-[140px] text-xs bg-background border-border rounded-xl">
                <SelectValue placeholder="All Modules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Modules</SelectItem>
                <SelectItem value="POINTS_TO_EC">
                  Points → {currencyModuleName}
                </SelectItem>
                <SelectItem value="EC_TO_TC">
                  {currencyModuleName} → TC
                </SelectItem>
                <SelectItem value="TC_DEBIT">TC Debit</SelectItem>
                <SelectItem value="EC_DEBIT">
                  {currencyModuleName} Debit
                </SelectItem>
                <SelectItem value="POINTS_AWARD">Points Award</SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* 3. Date Range Filter */}
          <EcosystemActionBar.Item>
            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
            />
          </EcosystemActionBar.Item>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <EcosystemActionBar.Item>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1 rounded-xl"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            </EcosystemActionBar.Item>
          )}

          <div className="hidden lg:flex items-center gap-2 px-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              Live Feed
            </span>
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-9 w-9 border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <RotateCcw
                className={cn(loading && "animate-spin")}
                size={14}
              />
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Link href="/gamification/currency/audit-log">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-9 rounded-xl text-xs"
              >
                Full Audit Log
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={filteredTransactions.length > 0}>
            {filteredTransactions.length} Transactions
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {error ? (
        <EcosystemContainer className="p-12">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shadow-sm">
              <AlertCircle className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Unable to Load Currency Trace
              </p>
              <p className="text-xs text-muted-foreground mt-1 px-4 leading-relaxed">
                {error.message}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="rounded-xl px-6"
            >
              Retry
            </Button>
          </div>
        </EcosystemContainer>
      ) : (
        <EcosystemContainer className="p-0 border-none shadow-none bg-transparent">
          <AdminTable
            columns={columns}
            data={filteredTransactions}
            loading={loading}
            keyExtractor={(tx, index) => tx.transactionId || `tx-${index}`}
            emptyTitle="No transactions found"
            emptyDescription={
              hasActiveFilters
                ? "No transactions match the selected search, module, or date criteria."
                : "No member currency movements recorded yet."
            }
            emptyIcon={Activity}
          />
        </EcosystemContainer>
      )}

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="currency transactions"
        description="Export the current currency transaction trace as CSV. Filters for search, type, and date range are applied."
        totalCount={transactions.length}
        matchingCount={hasActiveFilters ? filteredTransactions.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredTransactions;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: "No transactions match the current filters." });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "First Name",     getValue: (tx) => tx.userBasicInfo?.firstName || "" },
            { header: "Last Name",      getValue: (tx) => tx.userBasicInfo?.lastName || "" },
            { header: "Type",           getValue: (tx) => tx.type || "" },
            { header: "Amount",         getValue: (tx) => tx.amount ?? 0 },
            { header: "Balance Before", getValue: (tx) => tx.balanceBefore ?? 0 },
            { header: "Balance After",  getValue: (tx) => tx.balanceAfter ?? 0 },
            { header: "Date",           getValue: (tx) => tx.timestamp ? new Date(tx.timestamp).toISOString().slice(0, 10) : "" },
            { header: "Time",           getValue: (tx) => tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString() : "" },
            { header: "Metadata",       getValue: (tx) => tx.metadata ? JSON.stringify(tx.metadata) : "" },
          ]);
          downloadCsv(csv, `currency-trace-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} transaction${rows.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </>
  );
}
