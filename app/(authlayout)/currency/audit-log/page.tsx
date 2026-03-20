"use client";

import { useGetCurrencyTransactions, useGetUser } from "@/graphql/actions";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function CurrencyAuditLogPage() {
  const { data: userData } = useGetUser();
  const userId = userData?.getUser?.id;

  const [limit] = useState(20);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [history, setHistory] = useState<string[]>([]);

  const { data, loading, error } = useGetCurrencyTransactions({
    userId: userId || "",
    limit,
    cursor,
  });

  const getMovementTypeBadge = (type: string) => {
    switch (type) {
      case "POINTS_TO_EC":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
          >
            Earnings
          </Badge>
        );
      case "EC_TO_TC":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-600 border-blue-500/20"
          >
            Global Conversion
          </Badge>
        );
      case "EC_DEBIT":
        return (
          <Badge
            variant="secondary"
            className="bg-red-500/10 text-red-600 border-red-500/20"
          >
            EC Debit
          </Badge>
        );
      case "TC_DEBIT":
        return (
          <Badge
            variant="secondary"
            className="bg-orange-500/10 text-orange-600 border-orange-500/20"
          >
            TC Debit
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleNext = () => {
    if (data?.getCurrencyTransactions?.nextCursor) {
      setHistory([...history, cursor || ""]);
      setCursor(data.getCurrencyTransactions.nextCursor);
    }
  };

  const handlePrevious = () => {
    if (history.length > 0) {
      const prevCursor = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCursor(prevCursor === "" ? undefined : prevCursor);
    }
  };

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-red-500">
          Error loading transactions: {error.message}
        </p>
      </div>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Audit Ledger"
        badgeText="Currency Log"
        description="Real-time paper trail for all currency movements."
        icon={History}
      />

      <EcosystemContainer className="p-6">
        <div className="space-y-6">

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Transaction History
            </CardTitle>
            <CardDescription>
              Cursored view of all earnings, conversions, and redemptions.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Movement</TableHead>
                  <TableHead className="text-right">Balance After</TableHead>
                  <TableHead className="w-[80px] text-center">Info</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : data?.getCurrencyTransactions?.items?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.getCurrencyTransactions?.items.map(
                    (tx: any, idx: number) => (
                      <TableRow
                        key={tx.transactionId || idx}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-mono text-xs">
                          {format(new Date(tx.timestamp), "MMM dd, HH:mm:ss")}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {getMovementTypeBadge(tx.type)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`flex items-center gap-1 font-bold ${tx.type.includes("DEBIT") ? "text-red-600" : "text-emerald-600"}`}
                          >
                            {tx.type.includes("DEBIT") ? (
                              <ArrowDownRight className="h-4 w-4" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4" />
                            )}
                            {tx.amount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {tx.balanceAfter.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          {tx.metadata && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <pre className="text-[10px] max-w-[200px] overflow-auto">
                                    {JSON.stringify(tx.metadata, null, 2)}
                                  </pre>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </TableCell>
                      </TableRow>
                    ),
                  )
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-muted-foreground italic">
              * Using base64 cursors for high performance querying
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={history.length === 0 || loading}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={!data?.getCurrencyTransactions?.nextCursor || loading}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
