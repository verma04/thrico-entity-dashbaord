"use client";

import React from "react";
import {
  Trophy,
  Plus,
  Zap,
  ChevronRight,
  Activity,
  Search,
  Settings2,
} from "lucide-react";
import { useGetImpactRules, useToggleImpactRule } from "@/graphql/actions/impact";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  ENGAGEMENT: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  CONTRIBUTION: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  TRUST: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  NETWORK: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  CONSISTENCY: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
};

function getCategoryStyle(category: string) {
  return (
    CATEGORY_STYLES[category] || {
      bg: "bg-zinc-50",
      text: "text-zinc-700",
      dot: "bg-zinc-500",
    }
  );
}

export default function ImpactRulesPage() {
  const { data, loading } = useGetImpactRules();
  const [toggleRule] = useToggleImpactRule();
  const [search, setSearch] = React.useState("");

  const allRules = data?.impactRules || [];

  const handleToggle = async (id: string, currentEnabled: boolean) => {
    try {
      await toggleRule({
        variables: { id, enabled: !currentEnabled },
        optimisticResponse: {
          toggleImpactRule: {
            __typename: "ImpactRule",
            id,
            enabled: !currentEnabled,
          },
        },
      });
      toast.success(currentEnabled ? "Rule disabled" : "Rule enabled");
    } catch (error) {
      toast.error("Failed to update rule status");
    }
  };

  const filteredRules = allRules.filter((rule: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      rule.module?.toLowerCase().includes(q) ||
      rule.action?.toLowerCase().includes(q) ||
      rule.category?.toLowerCase().includes(q)
    );
  });

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Scoring Rules"
        description="Define how member actions affect their reputation score across all modules."
        badgeText="Impact Engine"
        icon={Trophy}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
              <span>Impact Score</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-semibold">Rules</span>
            </div>

            <div className="h-5 w-px bg-border" />

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search rules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-[240px] pl-9 pr-3 text-xs bg-muted/40 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="h-7 px-2.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-50 text-zinc-500 border-zinc-200"
            >
              {allRules.length} Rules
            </Badge>

            <Link href="/impact-score/rules/create">
              <Button
                size="sm"
                className="h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs gap-2 shadow-sm shadow-indigo-500/20"
              >
                <Plus className="h-4 w-4" />
                Create Rule
              </Button>
            </Link>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-muted/40 animate-pulse border border-border/50"
              />
            ))}
          </div>
        ) : filteredRules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-5">
              <Activity className="h-7 w-7 text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">
              {search
                ? "No rules match your search"
                : "No rules configured yet"}
            </h3>
            <p className="text-sm text-zinc-500 max-w-sm mb-6">
              {search
                ? "Try adjusting your search query to find what you're looking for."
                : "Create your first scoring rule to start tracking member impact across your community modules."}
            </p>
            {!search && (
              <Link href="/impact-score/rules/create">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm shadow-indigo-500/20">
                  <Plus className="h-4 w-4" />
                  Create First Rule
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <div className="col-span-4">Action</div>
              <div className="col-span-2">Module</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1 text-center">Points</div>
              <div className="col-span-1 text-center">Daily Cap</div>
              <div className="col-span-2 text-center">Status</div>
            </div>

            {/* Rule Rows */}
            {filteredRules.map((rule: any) => {
              const catStyle = getCategoryStyle(rule.category);
              return (
                <div
                  key={rule.id}
                  className="grid grid-cols-12 gap-4 items-center px-5 py-4 rounded-xl bg-white border border-zinc-100 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all group"
                >
                  {/* Action */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors shrink-0">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate capitalize">
                        {(rule.action || "—").replace(/_/g, " ")}
                      </p>
                      {rule.formula && (
                        <p className="text-[10px] text-zinc-400 font-mono truncate">
                          {rule.formula}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Module */}
                  <div className="col-span-2">
                    <span className="text-xs font-medium text-zinc-600 capitalize">
                      {(rule.module || "—").replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                        catStyle.bg,
                        catStyle.text,
                      )}
                    >
                      <span
                        className={cn("h-1.5 w-1.5 rounded-full", catStyle.dot)}
                      />
                      {rule.category}
                    </span>
                  </div>

                  {/* Points */}
                  <div className="col-span-1 text-center">
                    <span
                      className={cn(
                        "text-sm font-bold",
                        rule.points > 0
                          ? "text-emerald-600"
                          : rule.points < 0
                            ? "text-rose-600"
                            : "text-zinc-400",
                      )}
                    >
                      {rule.points > 0 ? `+${rule.points}` : rule.points}
                    </span>
                  </div>

                  {/* Daily Limit */}
                  <div className="col-span-1 text-center">
                    <span className="text-xs font-semibold text-zinc-500">
                      {rule.dailyLimit ? `${rule.dailyLimit}/day` : "∞"}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center justify-center gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        rule.enabled !== false
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-zinc-100 text-zinc-400",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          rule.enabled !== false
                            ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                            : "bg-zinc-300",
                        )}
                      />
                      {rule.enabled !== false ? "Active" : "Off"}
                    </span>
                    <Switch
                      checked={rule.enabled !== false}
                      onCheckedChange={() =>
                        handleToggle(rule.id, rule.enabled !== false)
                      }
                    />
                    <Link href={`/impact-score/rules/${rule.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-md text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        <Settings2 className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
