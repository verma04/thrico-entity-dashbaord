"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_SURVEY_AUTOMATION_RULES,
  CREATE_SURVEY_AUTOMATION_RULE,
  TOGGLE_SURVEY_AUTOMATION_RULE,
  DELETE_SURVEY_AUTOMATION_RULE,
  REORDER_SURVEY_AUTOMATION_RULES,
  SurveyAutomationRule,
} from "@/graphql/survey-automation";
import { useGetSurveys } from "@/graphql/surveys/survey-queries";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import {
  SurveyAutomationTable,
  surveyAutomationTableColumns,
} from "./survey-automation-table";
import { SurveyAutomationGrid } from "./survey-automation-grid";
import { SURVEY_TEMPLATE_RECIPES } from "./flow/node-palette";
import {
  Zap,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  PlusCircle,
  Star,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface SurveyAutomationManageProps {
  scopedSurveyId?: string | null;
  scopedSurveyName?: string | null;
}

export const SurveyAutomationManage: React.FC<SurveyAutomationManageProps> = ({
  scopedSurveyId,
  scopedSurveyName,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL State
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const search = searchParams.get("q") || "";
  const triggerFilter = searchParams.get("trigger") || "ALL";
  const actionFilter = searchParams.get("action") || "ALL";
  const statusFilter = searchParams.get("status") || "ALL";
  const surveyFilter = searchParams.get("survey") || scopedSurveyId || "ALL";
  const view = (searchParams.get("view") as "grid" | "list") || "list";

  const setSearch = (q: string) => updateParams({ q: q || null });
  const setTriggerFilter = (t: string) => updateParams({ trigger: t });
  const setActionFilter = (a: string) => updateParams({ action: a });
  const setStatusFilter = (s: string) => updateParams({ status: s });
  const setSurveyFilter = (s: string) => updateParams({ survey: s });
  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "list" ? null : v });

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    priority: true,
    rule: true,
    trigger: true,
    conditions: true,
    actions: true,
    status: true,
    updatedAt: true,
    actionsMenu: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // GraphQL Data
  const { data, loading, refetch } = useQuery(GET_SURVEY_AUTOMATION_RULES, {
    variables: { surveyId: scopedSurveyId || undefined },
    fetchPolicy: "cache-and-network",
  });

  const { data: surveysData } = useGetSurveys({
    variables: { input: {} },
  });
  const surveysList: any[] = surveysData?.getSurveys?.surveys || [];

  const [createRule] = useMutation(CREATE_SURVEY_AUTOMATION_RULE);
  const [toggleRule] = useMutation(TOGGLE_SURVEY_AUTOMATION_RULE);
  const [deleteRule] = useMutation(DELETE_SURVEY_AUTOMATION_RULE);
  const [reorderRules] = useMutation(REORDER_SURVEY_AUTOMATION_RULES);

  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const rawRules: SurveyAutomationRule[] =
    data?.getSurveyAutomationRules || [];

  const sortedRules = useMemo(() => {
    return [...rawRules].sort(
      (a, b) => (a.priority ?? 999) - (b.priority ?? 999)
    );
  }, [rawRules]);

  const filteredRules = useMemo(() => {
    return sortedRules.filter((rule) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rule.name.toLowerCase().includes(q) ||
        rule.description?.toLowerCase().includes(q) ||
        rule.surveyName?.toLowerCase().includes(q) ||
        rule.conditions?.some(
          (c) =>
            c.field.toLowerCase().includes(q) ||
            String(c.value).toLowerCase().includes(q)
        );

      const matchesTrigger =
        triggerFilter === "ALL" || rule.trigger === triggerFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && rule.isActive) ||
        (statusFilter === "PAUSED" && !rule.isActive);

      const matchesAction =
        actionFilter === "ALL" ||
        rule.actions.some((a) => a.type === actionFilter);

      const matchesSurvey =
        surveyFilter === "ALL" || rule.surveyId === surveyFilter;

      return (
        matchesSearch &&
        matchesTrigger &&
        matchesStatus &&
        matchesAction &&
        matchesSurvey
      );
    });
  }, [
    sortedRules,
    search,
    triggerFilter,
    statusFilter,
    actionFilter,
    surveyFilter,
  ]);

  const activeCount = sortedRules.filter((r) => r.isActive).length;
  const pausedCount = sortedRules.filter((r) => !r.isActive).length;

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      setTogglingId(id);
      await toggleRule({
        variables: { id, isActive },
      });
      toast.success(
        isActive ? "Survey rule activated." : "Survey rule paused."
      );
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle rule.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!ruleToDelete) return;
    try {
      await deleteRule({
        variables: { id: ruleToDelete },
      });
      toast.success("Survey automation rule deleted.");
      setRuleToDelete(null);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete rule.");
    }
  };

  const handleMove = async (index: number, direction: "UP" | "DOWN") => {
    const targetIndex = direction === "UP" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedRules.length) return;

    const newRules = [...sortedRules];
    const [moved] = newRules.splice(index, 1);
    newRules.splice(targetIndex, 0, moved);

    const ruleIds = newRules.map((r) => r.id);

    try {
      await reorderRules({
        variables: { ruleIds },
      });
      toast.success("Rule priority updated.");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to reorder rules.");
    }
  };

  const handleDuplicate = async (rule: SurveyAutomationRule) => {
    try {
      await createRule({
        variables: {
          input: {
            name: `${rule.name} (Copy)`,
            description: rule.description,
            surveyId: rule.surveyId,
            trigger: rule.trigger,
            conditionOperator: rule.conditionOperator,
            conditions: rule.conditions?.map((c) => ({
              field: c.field,
              operator: c.operator,
              value: c.value,
            })),
            actions: rule.actions?.map((a) => ({
              type: a.type,
              tierId: a.tierId,
              templateId: a.templateId,
              emailSubject: a.emailSubject,
              emailBody: a.emailBody,
              communityId: a.communityId,
              tags: a.tags,
              notificationMessage: a.notificationMessage,
              pushTitle: a.pushTitle,
              pushBody: a.pushBody,
              push: a.push,
              conditionOperator: a.conditionOperator,
              conditions: a.conditions?.map((c) => ({
                field: c.field,
                operator: c.operator,
                value: c.value,
              })),
            })),
            isActive: false,
            priority: sortedRules.length + 1,
          },
        },
      });
      toast.success("Survey rule duplicated as draft.");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to duplicate rule.");
    }
  };

  const handleCreate = () => {
    if (scopedSurveyId) {
      router.push(`/surveys/${scopedSurveyId}/automation/create`);
    } else {
      router.push("/surveys/automation/create");
    }
  };

  const handleEdit = (rule: SurveyAutomationRule) => {
    if (scopedSurveyId) {
      router.push(`/surveys/${scopedSurveyId}/automation/edit/${rule.id}`);
    } else {
      router.push(`/surveys/automation/edit/${rule.id}`);
    }
  };

  const handleApplyPreset = (preset: (typeof SURVEY_TEMPLATE_RECIPES)[0]) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "survey_automation_draft",
        JSON.stringify({
          ...preset,
          surveyId: scopedSurveyId || undefined,
          priority: sortedRules.length + 1,
        })
      );
    }
    handleCreate();
  };

  return (
    <EcosystemWrapper className="gap-6">
      {/* Header */}
      <EcosystemHeader
        title={scopedSurveyName ? `${scopedSurveyName} — Automation` : "Survey Automation"}
        badgeText="Feedback Engine"
        description={
          loading
            ? "Loading survey rules…"
            : `${sortedRules.length} automated rule${sortedRules.length === 1 ? "" : "s"} configured (${activeCount} active, ${pausedCount} paused).`
        }
        icon={ClipboardList}
        breadcrumbs={
          scopedSurveyId
            ? [
                { label: "Surveys", href: "/surveys/all" },
                { label: scopedSurveyName || "Survey", href: `/surveys/${scopedSurveyId}` },
                { label: "Automation" },
              ]
            : [
                { label: "Surveys", href: "/surveys/all" },
                { label: "Automation" },
              ]
        }
        actions={
          <Button
            onClick={handleCreate}
            className="h-8 rounded-lg gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Survey Rule
          </Button>
        }
      />

      {/* Starter Presets Banner when empty */}
      {sortedRules.length === 0 && !loading && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              Survey Automation Blueprints
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SURVEY_TEMPLATE_RECIPES.map((preset, i) => {
              const Icon = preset.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all flex flex-col justify-between space-y-3 group shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">
                        <Icon className="w-4 h-4" />
                      </div>
                      <Badge variant="outline" className="text-[9px]">
                        {preset.badge}
                      </Badge>
                    </div>
                    <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      {preset.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {preset.actions.length} automated actions configured for matching respondents.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyPreset(preset)}
                    className="w-full text-xs h-8 gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Use Blueprint
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action / Filter Bar */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search survey rules by name, tag, or survey…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          {/* Survey Filter (if not already scoped) */}
          {!scopedSurveyId && (
            <EcosystemActionBar.Item>
              <Select value={surveyFilter} onValueChange={setSurveyFilter}>
                <SelectTrigger className="w-[150px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                  <SelectValue placeholder="All Surveys" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[160px]">
                  <SelectItem value="ALL" className="text-xs font-medium py-1 px-2">
                    🌐 All Surveys
                  </SelectItem>
                  {surveysList.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-xs font-medium py-1 px-2">
                      📋 {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>
          )}

          {/* Trigger Event Filter */}
          <EcosystemActionBar.Item>
            <Select value={triggerFilter} onValueChange={setTriggerFilter}>
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                <SelectValue placeholder="Trigger Event" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[150px]">
                <SelectItem value="ALL" className="text-xs font-medium py-1 px-2">
                  All Triggers
                </SelectItem>
                <SelectItem value="SURVEY_SUBMITTED" className="text-xs font-medium py-1 px-2">
                  On Submit
                </SelectItem>
                <SelectItem value="SURVEY_COMPLETED" className="text-xs font-medium py-1 px-2">
                  On Completed
                </SelectItem>
                <SelectItem value="SURVEY_CREATED" className="text-xs font-medium py-1 px-2">
                  On Launch
                </SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Action Type Filter */}
          <EcosystemActionBar.Item>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[160px]">
                <SelectItem value="ALL" className="text-xs font-medium py-1 px-2">
                  All Actions
                </SelectItem>
                <SelectItem value="ASSIGN_MEMBERSHIP_TIER" className="text-xs font-medium py-1 px-2">
                  Tier Upgrade
                </SelectItem>
                <SelectItem value="EMAIL" className="text-xs font-medium py-1 px-2">
                  Email Dispatch
                </SelectItem>
                <SelectItem value="COMMUNITY_JOIN" className="text-xs font-medium py-1 px-2">
                  Community Join
                </SelectItem>
                <SelectItem value="NOTIFICATION" className="text-xs font-medium py-1 px-2">
                  Push Alert
                </SelectItem>
                <SelectItem value="ADD_MEMBER_TAG" className="text-xs font-medium py-1 px-2">
                  Member Tags
                </SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Status Filter */}
          <EcosystemActionBar.Item>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[130px]">
                <SelectItem value="ALL" className="text-xs font-medium py-1 px-2">
                  All Status
                </SelectItem>
                <SelectItem value="ACTIVE" className="text-xs font-medium py-1 px-2">
                  Active Only
                </SelectItem>
                <SelectItem value="PAUSED" className="text-xs font-medium py-1 px-2">
                  Paused Only
                </SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
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
                {surveyAutomationTableColumns
                  .filter((c) => c.key !== "actionsMenu")
                  .map((col) => (
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

          <EcosystemActionBar.ViewToggle
            value={view}
            onChange={(v) => setView(v as "grid" | "list")}
            options={[
              { id: "list", label: "List", icon: ListIcon },
              { id: "grid", label: "Grid", icon: LayoutGrid },
            ]}
          />

          <EcosystemActionBar.Separator />

          <EcosystemActionBar.Status active={filteredRules.length > 0}>
            Showing {filteredRules.length} of {sortedRules.length} Rules
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* Content Area */}
      <EcosystemContainer className="p-0 m-0 border-none bg-transparent shadow-none ring-0 space-y-4">
        {view === "list" ? (
          <SurveyAutomationTable
            rules={filteredRules}
            loading={loading}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={(id) => setRuleToDelete(id)}
            onMoveUp={(index) => handleMove(index, "UP")}
            onMoveDown={(index) => handleMove(index, "DOWN")}
            onDuplicate={handleDuplicate}
            togglingId={togglingId}
            visibleColumns={visibleColumns}
          />
        ) : (
          <SurveyAutomationGrid
            rules={filteredRules}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={(id) => setRuleToDelete(id)}
            onMoveUp={(index) => handleMove(index, "UP")}
            onMoveDown={(index) => handleMove(index, "DOWN")}
            onDuplicate={handleDuplicate}
            togglingId={togglingId}
          />
        )}
      </EcosystemContainer>

      {/* Delete Dialog */}
      <AlertDialog
        open={Boolean(ruleToDelete)}
        onOpenChange={(open) => !open && setRuleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Survey Automation Rule?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this survey rule. Members who were previously rewarded by this rule will retain their tier or tags.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EcosystemWrapper>
  );
};
