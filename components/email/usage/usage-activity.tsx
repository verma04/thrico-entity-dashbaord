"use client";

import React from "react";
import { Mail, Clock, RefreshCw, CreditCard, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGetEmailLogs, useGetEmailTopupHistory, EmailLog, EmailTopupHistory } from "@/graphql/actions/email";

export function ActivityLog() {
  const { data, loading } = useGetEmailLogs({ limit: 5 });
  const logs = data?.getEmailLogs || [];

  return (
    <Card className="border-border shadow-none bg-background overflow-hidden">
      <CardHeader className="px-5 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              Recent Activity
            </CardTitle>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Live transmission logs
            </p>
          </div>
          <button className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            View All
          </button>
        </div>
      </CardHeader>

      <div className="divide-y divide-border/50">
        {loading ? (
          <div className="py-8 flex items-center justify-center">
            <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No recent activity found.
          </div>
        ) : (
          logs.map((log: EmailLog) => (
            <div key={log.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {log.subject}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    to {log.to}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={cn(
                  "px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider",
                  log.status === "sent" ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"
                )}>
                  {log.status}
                </span>
                <p className="text-[9px] font-medium text-muted-foreground mt-1">
                  {new Date(log.sentAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export function PurchaseHistory() {
  const { data, loading } = useGetEmailTopupHistory();
  const history = data?.getEmailTopupHistory || [];

  return (
    <Card className="border-border shadow-none bg-background">
      <CardHeader className="px-5 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">
            Purchase History
          </CardTitle>
          <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {loading ? (
            <div className="py-8 flex items-center justify-center">
              <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No purchases yet.
            </div>
          ) : (
            history.slice(0, 5).map((item: EmailTopupHistory) => (
              <div key={item.id} className="p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    +{item.extraEmails.toLocaleString()} Credits
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(item.purchasedAt).toLocaleDateString()}
                  </p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
