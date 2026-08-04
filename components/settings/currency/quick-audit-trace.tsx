"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ReceiptText, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useGetCurrencyTransactions } from "@/graphql/actions/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { safeFormat } from "@/lib/date-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const typeLabels: Record<string, string> = {
  TC_DEBIT: "TC Debit",
  POINTS_TO_EC: "Points → EC",
  EC_TO_TC: "EC → TC",
  EC_DEBIT: "EC Debit",
};

export function QuickAuditTrace() {
  const router = useRouter();

  const { data, loading, error } = useGetCurrencyTransactions({
    limit: 5,
  });

  const transactions = data?.getCurrencyTransactions?.items || [];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <ReceiptText className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Quick Audit Trace
            </p>
            <p className="text-xs text-muted-foreground">
              Recent currency movements
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-muted-foreground"
          onClick={() => router.push("/currency/audit-log")}
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Transactions */}
      <div className="divide-y divide-border">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
                <Skeleton className="h-3 w-16 mt-1 ml-auto" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="px-5 py-4 text-center text-sm text-rose-500">
            Failed to load trace
          </div>
        ) : transactions.length === 0 ? (
          <div className="px-5 py-4 text-center text-sm text-muted-foreground">
            No recent activity found.
          </div>
        ) : (
          transactions.map((tx: any, idx: number) => {
            const isDebit = tx.type.includes("DEBIT");
            const userInfo = tx.userBasicInfo || {};
            const initials = userInfo.firstName
              ? userInfo.firstName.charAt(0)
              : "U";
            const fullName =
              `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim() ||
              "Unknown User";
            const avatarUrl = userInfo.avatar
              ? userInfo.avatar.startsWith("http")
                ? userInfo.avatar
                : `https://cdn.thrico.network/${userInfo.avatar}`
              : "";

            return (
              <div
                key={tx.transactionId || idx}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <UserProfileHoverCard
                    user={{
                      id: tx.userId,
                      firstName: userInfo.firstName,
                      lastName: userInfo.lastName,
                      avatar: userInfo.avatar,
                    }}
                  >
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 -ml-1 rounded-md transition-colors">
                      <Avatar className="h-6 w-6 border border-border">
                        <AvatarImage src={avatarUrl} alt={fullName} />
                        <AvatarFallback className="text-[10px] bg-indigo-50 text-indigo-700 font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground hover:underline decoration-muted-foreground/50 underline-offset-4">
                        {fullName}
                      </span>
                    </div>
                  </UserProfileHoverCard>

                  <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-medium">
                    {typeLabels[tx.type] || tx.type}
                  </span>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "text-sm font-bold font-mono",
                      isDebit ? "text-rose-600" : "text-emerald-600",
                    )}
                  >
                    {isDebit ? "-" : "+"}
                    {tx.amount}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {safeFormat(tx.timestamp, "MMM dd, HH:mm")}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
