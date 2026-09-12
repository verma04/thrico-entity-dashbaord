"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  useAnalytics360ChurnRisk,
  Analytics360ChurnRiskMember,
} from "@/graphql/analytics/analytics360";
import {
  AlertTriangle,
  HeartPulse,
  Clock,
  Send,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Layers,
  Copy,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { safeFormatDistanceToNow } from "@/lib/date-utils";

interface Customer360ChurnTabProps {
  initialMembers?: Analytics360ChurnRiskMember[];
  onInspectMember: (userId: string) => void;
}

export function Customer360ChurnTab({
  initialMembers,
  onInspectMember,
}: Customer360ChurnTabProps) {
  const [limit, setLimit] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");

  const { data, loading, error, refetch } = useAnalytics360ChurnRisk(limit);

  const members = data?.getAnalytics360ChurnRisk || initialMembers || [];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("User ID copied to clipboard");
  };

  const handleTriggerAction = (member: Analytics360ChurnRiskMember) => {
    toast.success(`Action initiated: ${member.recommendedAction}`, {
      description: `Targeting member ${member.userId.slice(0, 8)}...`,
    });
  };

  const filteredMembers = members.filter((m) => {
    if (riskFilter !== "ALL" && m.churnRiskLevel !== riskFilter) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.userId.toLowerCase().includes(q) ||
      m.rfmSegment?.toLowerCase().includes(q) ||
      m.recommendedAction?.toLowerCase().includes(q)
    );
  });

  const getRiskBadge = (level: string) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
        return (
          <Badge
            variant="destructive"
            className="text-[10px] font-mono uppercase px-2 py-0.5"
          >
            HIGH RISK
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono uppercase px-2 py-0.5 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10"
          >
            MEDIUM RISK
          </Badge>
        );
      case "LOW":
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono uppercase px-2 py-0.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
          >
            LOW RISK
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0.5">
            {level}
          </Badge>
        );
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 40) return "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-destructive bg-destructive/10 border-destructive/20";
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/80 bg-card">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <CardTitle className="text-sm font-semibold">
                  At-Risk Members & Retention Interventions
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Predictive churn detection powered by RFM behavioral scoring
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search user ID, segment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs w-44 sm:w-56"
                />
              </div>

              {/* Risk Filter */}
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((lvl) => (
                  <Button
                    key={lvl}
                    variant={riskFilter === lvl ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setRiskFilter(lvl)}
                    className="h-7 text-xs px-2.5 capitalize"
                  >
                    {lvl.toLowerCase()}
                  </Button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => refetch()}
                disabled={loading}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading && members.length === 0 ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error && members.length === 0 ? (
            <div className="py-12 text-center text-sm text-destructive">
              Failed to load churn risk data: {error.message}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
              No at-risk members found matching the current criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground font-mono bg-muted/20">
                    <th className="py-3 px-4 font-semibold">Member</th>
                    <th className="py-3 px-3 font-semibold text-center">Health Score</th>
                    <th className="py-3 px-3 font-semibold">RFM Segment</th>
                    <th className="py-3 px-3 font-semibold">Last Active</th>
                    <th className="py-3 px-3 font-semibold text-center">Days Inactive</th>
                    <th className="py-3 px-3 font-semibold text-center">Risk Level</th>
                    <th className="py-3 px-3 font-semibold">Recommended Intervention</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredMembers.map((m, idx) => {
                    const healthStyle = getHealthScoreColor(m.healthScore);
                    return (
                      <tr
                        key={m.userId || idx}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* Member User ID */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className="font-semibold text-foreground truncate max-w-[120px]">
                              {m.userId}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopy(m.userId)}
                              className="h-5 w-5 text-muted-foreground/60 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Copy user ID"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>

                        {/* Health Score */}
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center justify-center font-mono font-bold px-2 py-0.5 rounded-full border text-[11px] ${healthStyle}`}
                          >
                            {m.healthScore}
                          </span>
                        </td>

                        {/* RFM Segment */}
                        <td className="py-3 px-3">
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-mono px-2 py-0.5"
                          >
                            {m.rfmSegment || "Unknown"}
                          </Badge>
                        </td>

                        {/* Last Active */}
                        <td className="py-3 px-3 text-muted-foreground font-mono text-[11px]">
                          {m.lastActive
                            ? safeFormatDistanceToNow(m.lastActive)
                            : "N/A"}
                        </td>

                        {/* Days Inactive */}
                        <td className="py-3 px-3 text-center font-mono font-medium text-foreground">
                          {m.daysInactive}d
                        </td>

                        {/* Risk Level */}
                        <td className="py-3 px-3 text-center">
                          {getRiskBadge(m.churnRiskLevel)}
                        </td>

                        {/* Recommended Intervention */}
                        <td className="py-3 px-3">
                          <span className="text-foreground/90 font-medium">
                            {m.recommendedAction || "Monitor engagement"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onInspectMember(m.userId)}
                              className="h-7 text-xs px-2.5 font-medium border-border/80 hover:border-primary"
                              title="Inspect Activity Timeline"
                            >
                              Inspect Journey
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleTriggerAction(m)}
                              className="h-7 text-xs px-2.5"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Act
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
