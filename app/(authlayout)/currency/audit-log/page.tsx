"use client";

import { useGetCurrencyTransactions, useGetUser } from "@/graphql/actions";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Info,
} from "lucide-react";
import { safeFormat } from "@/lib/date-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<string, { label: string; variant: string; className: string }> = {
  POINTS_TO_EC: {
    label: "Earnings",
    variant: "secondary",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  },
  EC_TO_TC: {
    label: "Global Conversion",
    variant: "secondary",
    className: "bg-blue-50 text-blue-700 border border-blue-100",
  },
  EC_DEBIT: {
    label: "EC Debit",
    variant: "secondary",
    className: "bg-rose-50 text-rose-700 border border-rose-100",
  },
  TC_DEBIT: {
    label: "TC Debit",
    variant: "secondary",
    className: "bg-orange-50 text-orange-700 border border-orange-100",
  },
};

export default function CurrencyAuditLogPage() {
  const { data: userData } = useGetUser();
  const userId = userData?.getUser?.id;

  const [limit] = useState(20);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [history, setHistory] = useState<string[]>([]);
  const currentPage = history.length + 1;

  const { data, loading, error } = useGetCurrencyTransactions({
    userId: userId || "",
    limit,
    cursor,
  });

  const handleNext = () => {
    if (data?.getCurrencyTransactions?.nextCursor) {
      setHistory([...history, cursor || ""]);
      setCursor(data.getCurrencyTransactions.nextCursor);
    }
  };

  const handlePrevious = () => {
    if (history.length > 0) {
      const prevCursor = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCursor(prevCursor === "" ? undefined : prevCursor);
    }
  };

  const getTypeBadge = (type: string) => {
    const cfg = TYPE_CONFIG[type];
    if (!cfg) return <Badge variant="outline" className="text-[10px] font-medium">{type}</Badge>;
    return (
      <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-md", cfg.className)}>
        {cfg.label}
      </span>
    );
  };

  if (error) {
    return (
      <EcosystemWrapper>
        <EcosystemHeader title="Audit Log" badgeText="Currency" description="Full currency transaction history." icon={History} />
        <EcosystemContainer className="p-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center">
              <History className="h-6 w-6 text-rose-400" />
            </div>
            <p className="text-sm font-semibold text-foreground">Failed to load transactions</p>
            <p className="text-xs text-muted-foreground">{error.message}</p>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  const transactions = data?.getCurrencyTransactions?.items || [];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Audit Log"
        badgeText="Currency"
        description="A complete record of all currency movements — earnings, conversions, and redemptions."
        icon={History}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">Live ledger</span>
          </div>
          <EcosystemActionBar.Separator />
          <span className="text-xs text-muted-foreground">Page {currentPage}</span>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden bg-card">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none border-r border-border"
              onClick={handlePrevious}
              disabled={history.length === 0 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-xs font-semibold text-foreground min-w-[28px] text-center">
              {currentPage}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none border-l border-border"
              onClick={handleNext}
              disabled={!data?.getCurrencyTransactions?.nextCursor || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Transaction History</h2>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="h-11 text-xs font-semibold w-[160px]">Timestamp</TableHead>
                <TableHead className="h-11 text-xs font-semibold">Type</TableHead>
                <TableHead className="h-11 text-xs font-semibold">Movement</TableHead>
                <TableHead className="h-11 text-xs font-semibold text-right">Balance After</TableHead>
                <TableHead className="h-11 text-xs font-semibold text-center w-[60px]">Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <TableRow key={i} className="h-14">
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-14 ml-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-6 w-6 mx-auto rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-sm text-muted-foreground">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx: any, idx: number) => {
                  const isDebit = tx.type.includes("DEBIT");
                  return (
                    <TableRow key={tx.transactionId || idx} className="h-14">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {safeFormat(tx.timestamp, "MMM dd, HH:mm:ss")}
                      </TableCell>
                      <TableCell>{getTypeBadge(tx.type)}</TableCell>
                      <TableCell>
                        <div className={cn(
                          "flex items-center gap-1 font-bold font-mono text-sm",
                          isDebit ? "text-rose-600" : "text-emerald-600"
                        )}>
                          {isDebit
                            ? <ArrowDownRight className="h-3.5 w-3.5" />
                            : <ArrowUpRight className="h-3.5 w-3.5" />}
                          {tx.amount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-medium text-foreground">
                        {tx.balanceAfter.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {tx.metadata && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <pre className="text-[10px] max-w-[200px] overflow-auto">
                                  {JSON.stringify(tx.metadata, null, 2)}
                                </pre>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Paginated using cursor-based queries for high-performance retrieval.
        </p>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
