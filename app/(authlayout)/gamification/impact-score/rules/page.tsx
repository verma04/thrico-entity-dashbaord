"use client";

import React, { useMemo, useState } from "react";
import {
  Trophy,
  Plus,
  Zap,
  Upload,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Filter,
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type {
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import {
  CATEGORY_TABS,
  CategoryTabValue,
  SectionHeader,
  ContentArea,
} from "@/components/impact/rules/impact-rules-ui";
import { ImpactRuleNode } from "@/components/impact/rules/impact-rule-card";

export default function ImpactRulesPage() {
  const { data, loading, refetch } = useGetImpactRules();
  const [toggleRule, { loading: toggling }] = useToggleImpactRule();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Column visibility state for list view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    action: true,
    module: true,
    category: true,
    points: true,
    dailyLimit: true,
    status: true,
    createdAt: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: prev[key] === false ? true : false,
    }));
  };

  const allRules: ImpactRuleNode[] = (data?.impactRules || []) as ImpactRuleNode[];

  // Dynamic modules extracted from actual rules
  const availableModules = useMemo(() => {
    const set = new Set<string>();
    allRules.forEach((r) => {
      if (r.module) set.add(r.module);
    });
    return Array.from(set).sort();
  }, [allRules]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: allRules.length };
    allRules.forEach((rule) => {
      const cat = rule.category?.toUpperCase() || "OTHER";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [allRules]);

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

  // Filtered rules calculation
  const filteredRules = useMemo(() => {
    return allRules.filter((rule) => {
      // Category filter
      if (
        selectedCategory !== "ALL" &&
        rule.category?.toUpperCase() !== selectedCategory.toUpperCase()
      ) {
        return false;
      }

      // Module filter
      if (
        selectedModule !== "ALL" &&
        rule.module?.toLowerCase() !== selectedModule.toLowerCase()
      ) {
        return false;
      }

      // Status filter
      if (selectedStatus === "ACTIVE" && rule.enabled === false) {
        return false;
      }
      if (selectedStatus === "DISABLED" && rule.enabled !== false) {
        return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesModule = rule.module?.toLowerCase().includes(q);
        const matchesAction = rule.action?.toLowerCase().includes(q);
        const matchesCategory = rule.category?.toLowerCase().includes(q);
        const matchesFormula = rule.formula?.toLowerCase().includes(q);
        if (!matchesModule && !matchesAction && !matchesCategory && !matchesFormula) {
          return false;
        }
      }

      return true;
    });
  }, [allRules, selectedCategory, selectedModule, selectedStatus, search]);

  const availableColumnList = [
    { key: "action", header: "Action / Event" },
    { key: "module", header: "Module" },
    { key: "category", header: "Category" },
    { key: "points", header: "Impact Points" },
    { key: "dailyLimit", header: "Daily Cap" },
    { key: "status", header: "Status" },
    { key: "createdAt", header: "Created Date" },
  ];

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title="Scoring Rules"
        description="Define how member actions affect their reputation score across all community modules."
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

      {/* ── Category Tabs Navigation ────────────────────────────────────── */}
      <div className="px-3">
        <Tabs
          value={selectedCategory}
          onValueChange={(val) => setSelectedCategory(val)}
          className="w-full"
        >
          <TabsList className="bg-muted/60 p-1 rounded-xl border border-border/60 h-auto flex flex-wrap gap-1 justify-start">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const count = categoryCounts[tab.value] ?? 0;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="h-8 px-3 rounded-lg text-xs font-medium data-[state=active]:bg-card data-[state=active]:shadow-2xs data-[state=active]:text-foreground text-muted-foreground transition-all gap-1.5"
                >
                  {tab.dot && (
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full shrink-0", tab.dot)}
                    />
                  )}
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold",
                      selectedCategory === tab.value
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground/70",
                    )}
                  >
                    {count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        {/* Search */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search rules by module or action…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Filters Group: Module & Status */}
        <EcosystemActionBar.Group>
          {/* Module Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={selectedModule}
              onValueChange={(v) => setSelectedModule(v)}
            >
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="All Modules" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[150px]">
                <SelectItem
                  value="ALL"
                  className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                >
                  All Modules
                </SelectItem>
                {availableModules.map((mod) => (
                  <SelectItem
                    key={mod}
                    value={mod}
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer capitalize"
                  >
                    {mod.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Status Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={selectedStatus}
              onValueChange={(v) => setSelectedStatus(v)}
            >
              <SelectTrigger className="w-[125px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[130px]">
                <SelectItem
                  value="ALL"
                  className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                >
                  All Status
                </SelectItem>
                <SelectItem
                  value="ACTIVE"
                  className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    Active Only
                  </div>
                </SelectItem>
                <SelectItem
                  value="DISABLED"
                  className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                    Disabled Only
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        {/* Right Controls: Columns, Export, View Toggle, Status Count */}
        <EcosystemActionBar.Group align="right">
          {/* Columns Toggle for List View */}
          {view === "list" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                  Toggle Columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableColumnList.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={visibleColumns[col.key] !== false}
                    onCheckedChange={() => toggleColumn(col.key)}
                    className="text-xs font-medium cursor-pointer"
                  >
                    {col.header}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export Button */}
          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>

          {/* View Toggle (Grid / List) */}
          <EcosystemActionBar.ViewToggle
            value={view}
            onChange={(v) => setView(v as "grid" | "list")}
            options={[
              { id: "grid", label: "Grid", icon: LayoutGrid },
              { id: "list", label: "List", icon: ListIcon },
            ]}
          />

          <EcosystemActionBar.Separator />

          {/* Live Status Count */}
          <EcosystemActionBar.Status active={filteredRules.length > 0}>
            Showing {filteredRules.length} of {allRules.length} Rules
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL category) */}
        <SectionHeader
          category={selectedCategory}
          count={filteredRules.length}
          loading={loading}
        />

        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={loading}
          rules={filteredRules}
          allRulesCount={allRules.length}
          search={search}
          onToggle={handleToggle}
          isToggling={toggling}
          visibleColumns={visibleColumns}
        />
      </EcosystemContainer>

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="impact rules"
        description="Export impact scoring rules as CSV. Includes action, module, category, points, daily cap, formula, and status."
        totalCount={allRules.length}
        matchingCount={
          search.trim() ||
          selectedCategory !== "ALL" ||
          selectedModule !== "ALL" ||
          selectedStatus !== "ALL"
            ? filteredRules.length
            : undefined
        }
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredRules as any[];
          if (rows.length === 0) {
            toast.error("Nothing to export", {
              description: "No rules match the current filters.",
            });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Action", getValue: (r) => r.action || "" },
            { header: "Module", getValue: (r) => r.module || "" },
            { header: "Category", getValue: (r) => r.category || "" },
            { header: "Points", getValue: (r) => r.points ?? 0 },
            { header: "Daily Cap", getValue: (r) => r.dailyLimit ?? "" },
            { header: "Formula", getValue: (r) => r.formula || "" },
            {
              header: "Status",
              getValue: (r) =>
                r.enabled !== false ? "Active" : "Disabled",
            },
            {
              header: "Created By",
              getValue: (r) =>
                r.createdBy
                  ? `${r.createdBy.firstName} ${r.createdBy.lastName || ""}`.trim()
                  : "System",
            },
            {
              header: "Created At",
              getValue: (r) =>
                r.createdAt
                  ? new Date(r.createdAt).toISOString().slice(0, 10)
                  : "",
            },
          ]);
          downloadCsv(
            csv,
            `impact-rules-${new Date().toISOString().slice(0, 10)}`,
            format,
          );
          toast.success("Export ready", {
            description: `${rows.length} rule${rows.length !== 1 ? "s" : ""} exported.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
}
