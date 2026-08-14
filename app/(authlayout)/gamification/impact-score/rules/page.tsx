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
  Pencil,
} from "lucide-react";
import {
  useGetImpactRules,
  useToggleImpactRule,
} from "@/graphql/actions/impact";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
  AdminTableText,
} from "@/components/shared/admin-table/admin-table";
import { renderModuleIcon } from "@/components/subscription/utils";

const CATEGORY_TAG_VARIANTS: Record<
  string,
  "indigo" | "emerald" | "amber" | "purple" | "rose" | "default"
> = {
  ENGAGEMENT: "indigo",
  CONTRIBUTION: "emerald",
  TRUST: "amber",
  NETWORK: "purple",
  CONSISTENCY: "rose",
};

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
        <AdminTableItem
          icon={Zap}
          title={(rule.action || "—").replace(/_/g, " ")}
          subtitle={rule.formula || undefined}
        />
      ),
    },
    {
      key: "module",
      header: "Module",
      cell: (rule: any) => (
        <span className="text-[12px] font-medium text-muted-foreground capitalize">
          {(rule.module || "—").replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (rule: any) => (
        <AdminTableTag
          variant={CATEGORY_TAG_VARIANTS[rule.category?.toUpperCase()] || "default"}
        >
          {rule.category}
        </AdminTableTag>
      ),
    },
    {
      key: "points",
      header: "Impact",
      cell: (rule: any) => (
        <AdminTableMetric
          value={`${rule.points > 0 ? "+" : ""}${rule.points}`}
          variant={rule.points > 0 ? "emerald" : rule.points < 0 ? "rose" : "default"}
        />
      ),
    },
    {
      key: "dailyLimit",
      header: "Daily Cap",
      cell: (rule: any) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-mono font-semibold text-foreground">
            {rule.dailyLimit ? `${rule.dailyLimit}x` : "∞"}
          </span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
            Limit
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (rule: any) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={rule.enabled !== false}
            onCheckedChange={() =>
              handleToggle(rule.id, rule.enabled !== false)
            }
            disabled={toggling}
            className="scale-75 data-[state=checked]:bg-emerald-500"
          />
          <AdminStatusBadge
            status={rule.enabled !== false ? "APPROVED" : "DISABLED"}
          >
            {rule.enabled !== false ? "Active" : "Disabled"}
          </AdminStatusBadge>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      cell: (rule: any) => (
        <AdminTableText
          primary={
            rule.createdBy
              ? `${rule.createdBy.firstName} ${rule.createdBy.lastName || ""}`
              : "System"
          }
          secondary={
            rule.createdAt
              ? new Date(rule.createdAt).toLocaleDateString()
              : "—"
          }
        />
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-10 text-right",
      className: "text-right",
      cell: (rule: any) => (
        <div className="flex justify-end">
          <Link href={`/gamification/impact-score/rules/${rule.id}/edit`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
            >
              <Pencil className="h-3.5 w-3.5" />
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
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Impact Score", href: "/gamification/impact-score" },
          { label: "Rules" },
        ]}
        actions={
          <Link href="/gamification/impact-score/rules/create">
            <CtaButton>
              <Plus className="h-3.5 w-3.5" />
              Create Rule
            </CtaButton>
          </Link>
        }
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search rules by module or action..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active={filteredRules.length > 0}>
            {filteredRules.length} Rules
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <AdminTable
            columns={columns}
            data={filteredRules}
            loading={loading}
            size="sm"
            keyExtractor={(rule) => rule.id}
            emptyTitle={
              search ? "No rules match your search" : "No rules configured yet"
            }
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
