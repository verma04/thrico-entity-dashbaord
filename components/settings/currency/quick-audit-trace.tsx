"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReceiptText, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickAuditTrace() {
  const router = useRouter();

  const transactions = [
    {
      id: "1",
      user: "John Doe",
      type: "TC_DEBIT",
      amount: 50,
      timestamp: "2 mins ago",
      status: "Verified",
    },
    {
      id: "2",
      user: "Jane Smith",
      type: "POINTS_TO_EC",
      amount: 120,
      timestamp: "1 hour ago",
      status: "Verified",
    },
    {
      id: "3",
      user: "Bob Wilson",
      type: "TC_DEBIT",
      amount: 30,
      timestamp: "3 hours ago",
      status: "Verified",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ReceiptText className="h-5 w-5 text-blue-500" />
          Quick Audit Trace
        </CardTitle>
        <CardDescription>Real-time spending verification</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between text-sm py-2 border-b last:border-0 border-dashed"
            >
              <div>
                <div className="font-medium flex items-center gap-1">
                  {tx.user}
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {tx.type}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-mono font-bold ${tx.type.includes("DEBIT") ? "text-red-600" : "text-emerald-600"}`}
                >
                  {tx.type.includes("DEBIT") ? "-" : "+"}
                  {tx.amount}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {tx.timestamp}
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-primary mt-2"
            onClick={() => router.push("/settings/currency/audit-log")}
          >
            View Comprehensive Audit Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
