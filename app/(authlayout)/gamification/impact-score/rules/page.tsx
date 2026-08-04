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
  Pencil
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
import { AdminTable, AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { renderModuleIcon } from "@/components/subscription/utils";

const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  ENGAGEMENT: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  CONTRIBUTION: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  TRUST: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  NETWORK: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
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
  const { data, loading, refetch } = useGetImpactRules();
  const [toggleRule, { loading: toggling }] = useToggleImpactRule();
  const [search, setSearch] = React.useState("");

  const allRules = data?.impactRules || [];

  const handleToggle = async (id: string, currentEnabled: boolean) => {
    try {
      await toggleRule({
        variables: { id, enabled: !currentEnabled },
      });
      refetch();
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

  const columns = [
    {
      key: "action",
      header: "Action / Event",
      cell: (rule: any) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground capitalize">
              {(rule.action || "—").replace(/_/g, " ")}
            </span>
            {rule.formula && (
              <span className="text-[10px] text-muted-foreground font-mono">
                {rule.formula}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "module",
      header: "Module",
      cell: (rule: any) => (
        <span className="text-sm font-medium text-muted-foreground capitalize">
          {(rule.module || "—").replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (rule: any) => {
        const catStyle = getCategoryStyle(rule.category);
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
              catStyle.bg,
              catStyle.text
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", catStyle.dot)} />
            {rule.category}
          </span>
        );
      },
    },
    {
      key: "points",
      header: "Impact",
      cell: (rule: any) => (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-mono text-[13px] font-bold px-2.5 py-1 rounded-md border shadow-sm",
              rule.points > 0
                ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                : rule.points < 0
                ? "text-rose-600 bg-rose-50 border-rose-100"
                : "text-zinc-600 bg-zinc-50 border-zinc-100"
            )}
          >
            {rule.points > 0 ? `+${rule.points.toLocaleString()}` : rule.points.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: "dailyLimit",
      header: "Daily Cap",
      cell: (rule: any) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-foreground">
            {rule.dailyLimit ? `${rule.dailyLimit}x` : "∞"}
          </span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Limit</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (rule: any) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={rule.enabled !== false}
            onCheckedChange={() => handleToggle(rule.id, rule.enabled !== false)}
            disabled={toggling}
            className="scale-90 data-[state=checked]:bg-emerald-500"
          />
          <AdminStatusBadge status={rule.enabled !== false ? "APPROVED" : "PENDING"}>
             {rule.enabled !== false ? "Active" : "Disabled"}
          </AdminStatusBadge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (rule: any) => (
        <div className="flex justify-end pr-2">
          <Link href={`/gamification/impact-score/rules/${rule.id}/edit`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted transition-all rounded-lg"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Scoring Rules"
        description="Define how member actions affect their reputation score across all modules."
        badgeText="Impact Engine"
        icon={Trophy}
        breadcrumbs={[{ label: "Gamification", href: "/gamification" }, { label: "Impact Score", href: "/gamification/impact-score" }, { label: "Rules" }]}
        actions={
          <EcosystemActionBar shadow="none" className="p-0 border-none bg-transparent gap-2">
            <EcosystemActionBar.Group align="right">
              <Link href="/gamification/impact-score/rules/create">
                <EcosystemActionBar.CtaButton>
                  <Plus className="h-3 w-3" />
                  Create Rule
                </EcosystemActionBar.CtaButton>
              </Link>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>
        }
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-4">
          <div className="mb-4 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search rules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full pl-9 pr-3 text-sm bg-card border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all"
            />
          </div>

          <AdminTable
            columns={columns}
            data={filteredRules}
            loading={loading}
            keyExtractor={(rule) => rule.id}
            emptyTitle={search ? "No rules match your search" : "No rules configured yet"}
            emptyDescription={
              search
                ? "Try adjusting your search query to find what you're looking for."
                : "Create your first scoring rule to start tracking member impact across your community modules."
            }
          />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
