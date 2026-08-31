"use client";

import React from "react";
import Link from "next/link";
import { useChurnRiskMembers } from "@/graphql/analytics/churnRisk";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, ShieldAlert, Zap, Clock, User } from "lucide-react";

interface ChurnRiskTableProps {
  limit?: number;
  className?: string;
}

export function ChurnRiskTable({ limit = 10, className }: ChurnRiskTableProps) {
  const { data, loading, error } = useChurnRiskMembers(limit);

  if (loading) {
    return (
      <Card className={`p-6 space-y-4 ${className || ""}`}>
        <Skeleton className="h-6 w-48" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  if (error || !data?.getChurnRiskMembers) {
    return (
      <Card className={`p-6 border-dashed text-center text-muted-foreground text-sm ${className || ""}`}>
        {error ? `Failed to load churn risk data: ${error.message}` : "No at-risk members found."}
      </Card>
    );
  }

  const members = data.getChurnRiskMembers;

  const getRiskBadge = (level: string) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
        return <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-semibold">High Risk</Badge>;
      case "MEDIUM":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold">Medium Risk</Badge>;
      case "LOW":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-semibold">Low Risk</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              <CardTitle className="text-base font-bold">Churn Risk & Retention Triggers</CardTitle>
            </div>
            <CardDescription className="text-xs">
              At-risk members detected via ClickHouse inactivity and engagement drop-offs
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-semibold">
            {members.length} At-Risk
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {members.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">
            No at-risk members detected. Member retention is healthy!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="py-2.5 px-3 font-semibold">Member</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Health</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Segment</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Inactive</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Risk Level</th>
                  <th className="py-2.5 px-3 font-semibold">Recommended Action</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {members.map((m, idx) => (
                  <tr key={m.userId || idx} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-[11px] text-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate max-w-[120px]">{m.userId}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-foreground">
                      {m.healthScore}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant="outline" className="text-[10px]">
                        {m.rfmSegment}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-center text-muted-foreground">
                      {m.daysInactive} days
                    </td>
                    <td className="py-3 px-3 text-center">
                      {getRiskBadge(m.churnRiskLevel)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-primary font-medium text-[11px]">
                        <Zap className="h-3 w-3 text-amber-500 shrink-0" />
                        <span>{m.recommendedAction}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link href={`/members/${m.userId}/360`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                          View 360° <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
