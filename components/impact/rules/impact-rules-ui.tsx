"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List as ListIcon,
  Layers,
  MessageSquare,
  Flame,
  ShieldCheck,
  Users,
  Compass,
  Zap,
  Pencil,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
  AdminTableText,
} from "@/components/shared/admin-table/admin-table";
import { ImpactRulesGrid } from "./impact-rules-grid";
import { ImpactRuleNode } from "./impact-rule-card";

export const CATEGORY_TABS = [
  {
    value: "ALL",
    label: "All Rules",
    icon: Layers,
    dot: "",
    color: "text-foreground",
  },
  {
    value: "ENGAGEMENT",
    label: "Engagement",
    icon: MessageSquare,
    dot: "bg-blue-500",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    value: "CONTRIBUTION",
    label: "Contribution",
    icon: Flame,
    dot: "bg-emerald-500",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    value: "TRUST",
    label: "Trust & Safety",
    icon: ShieldCheck,
    dot: "bg-amber-500",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    value: "NETWORK",
    label: "Network & Referrals",
    icon: Users,
    dot: "bg-purple-500",
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    value: "CONSISTENCY",
    label: "Consistency",
    icon: Compass,
    dot: "bg-rose-500",
    color: "text-rose-600 dark:text-rose-400",
  },
] as const;

export type CategoryTabValue = (typeof CATEGORY_TABS)[number]["value"];

export const CATEGORY_TAG_VARIANTS: Record<
  string,
  "indigo" | "emerald" | "amber" | "purple" | "rose" | "default"
> = {
  ENGAGEMENT: "indigo",
  CONTRIBUTION: "emerald",
  TRUST: "amber",
  NETWORK: "purple",
  CONSISTENCY: "rose",
};

/** Status section bar — appears between action bar and content when filtering by non-ALL category */
export function SectionHeader({
  category,
  count,
  loading,
}: {
  category: string;
  count: number;
  loading: boolean;
}) {
  const tab =
    CATEGORY_TABS.find((t) => t.value === category) ?? CATEGORY_TABS[0];
  const Icon = tab.icon;

  if (category === "ALL" || category === "all") return null;

  return (
    <div className="flex items-center gap-3 pb-1">
      <div
        className={cn(
          "flex items-center gap-2 text-sm font-semibold",
          tab.color,
        )}
      >
        {tab.dot && (
          <span
            className={cn(
              "h-2 w-2 rounded-full shrink-0 animate-pulse",
              tab.dot,
            )}
          />
        )}
        <Icon className="h-4 w-4" />
        <span>{tab.label} Rules</span>
      </div>
      <div className="h-px flex-1 bg-border" />
      {!loading && (
        <span className="text-[11px] font-medium text-muted-foreground">
          {count} {count === 1 ? "rule" : "rules"}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Area with animated transitions
// ─────────────────────────────────────────────────────────────────────────────

interface ContentAreaProps {
  view: "grid" | "list";
  loading: boolean;
  rules: ImpactRuleNode[];
  allRulesCount: number;
  search?: string;
  onToggle: (id: string, currentEnabled: boolean) => void;
  isToggling?: boolean;
  visibleColumns?: Record<string, boolean>;
}

export function ContentArea({
  view,
  loading,
  rules,
  allRulesCount,
  search,
  onToggle,
  isToggling = false,
  visibleColumns,
}: ContentAreaProps) {
  const baseColumns = [
    {
      key: "action",
      header: "Action / Event",
      cell: (rule: ImpactRuleNode) => (
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
      cell: (rule: ImpactRuleNode) => (
        <span className="text-[12px] font-medium text-muted-foreground capitalize">
          {(rule.module || "—").replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (rule: ImpactRuleNode) => (
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
      cell: (rule: ImpactRuleNode) => (
        <AdminTableMetric
          value={`${rule.points > 0 ? "+" : ""}${rule.points}`}
          variant={rule.points > 0 ? "emerald" : rule.points < 0 ? "rose" : "default"}
        />
      ),
    },
    {
      key: "dailyLimit",
      header: "Daily Cap",
      cell: (rule: ImpactRuleNode) => (
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
      cell: (rule: ImpactRuleNode) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={rule.enabled !== false}
            onCheckedChange={() => onToggle(rule.id, rule.enabled !== false)}
            disabled={isToggling}
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
      cell: (rule: ImpactRuleNode) => (
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
      cell: (rule: ImpactRuleNode) => (
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

  const columns = visibleColumns
    ? baseColumns.filter((col) => visibleColumns[col.key] !== false)
    : baseColumns;

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-3"
        >
          {view === "grid" ? (
            /* 4-5 column compact card skeleton */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xs space-y-3 p-3.5"
                >
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-4 w-8 rounded" />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Skeleton className="h-7 w-7 rounded-md shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3.5 w-3/4 rounded" />
                      <Skeleton className="h-2.5 w-1/2 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border/30">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-12 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List table row skeleton */
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="h-10 border-b border-border bg-muted/30 px-5 flex items-center gap-4">
                {[140, 100, 100, 80, 80, 100, 100].map((w, i) => (
                  <Skeleton
                    key={i}
                    className="h-2.5 rounded"
                    style={{ width: w }}
                  />
                ))}
              </div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-3.5 border-b border-border/40 last:border-0"
                >
                  <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3.5 w-36 rounded" />
                    <Skeleton className="h-2.5 w-24 rounded" />
                  </div>
                  <Skeleton className="h-4 w-20 rounded hidden sm:block" />
                  <Skeleton className="h-5 w-20 rounded hidden md:block" />
                  <Skeleton className="h-4 w-12 rounded" />
                  <Skeleton className="h-4 w-10 rounded hidden lg:block" />
                  <Skeleton className="h-5 w-16 rounded" />
                  <Skeleton className="h-3 w-24 rounded hidden xl:block" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {view === "grid" ? (
            <ImpactRulesGrid
              rules={rules}
              onToggle={onToggle}
              isToggling={isToggling}
              search={search}
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
              <AdminTable
                columns={columns}
                data={rules}
                loading={false}
                size="sm"
                keyExtractor={(rule) => rule.id}
                emptyTitle={
                  search
                    ? "No rules match your search"
                    : "No rules configured yet"
                }
                emptyDescription={
                  search
                    ? "Try adjusting your search query to find what you're looking for."
                    : "Create your first scoring rule to start tracking member impact across your community modules."
                }
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
