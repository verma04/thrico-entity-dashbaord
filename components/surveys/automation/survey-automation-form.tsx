"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  SurveyAutomationRule,
  CreateSurveyAutomationRuleInput,
  UpdateSurveyAutomationRuleInput,
  SurveyRuleTrigger,
  SurveyRuleConditionInput,
  SurveyRuleActionInput,
} from "@/graphql/survey-automation";
import {
  PolarisFormLayout,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Sparkles,
  Users,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  ClipboardList,
} from "lucide-react";
import { SurveyAutomationFlowBuilder } from "./flow/survey-automation-flow-builder";
import { useGetSurveys } from "@/graphql/surveys/survey-queries";
import {
  SurveyRuleDetailsCard,
  SurveyGlobalConditionsCard,
  SurveyActionPipelineCard,
} from "./form";
import { toast } from "sonner";

interface SurveyAutomationFormProps {
  initialValues?: SurveyAutomationRule | null;
  defaultSurveyId?: string | null;
  onSubmit?: (
    input: CreateSurveyAutomationRuleInput | UpdateSurveyAutomationRuleInput,
  ) => Promise<void>;
  onSave?: (
    input: CreateSurveyAutomationRuleInput | UpdateSurveyAutomationRuleInput,
  ) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

export const SurveyAutomationForm: React.FC<SurveyAutomationFormProps> = ({
  initialValues,
  defaultSurveyId,
  onSubmit,
  onSave,
  onCancel,
  loading = false,
  isEdit = false,
}) => {
  const [viewMode, setViewMode] = useState<"flow" | "form">("flow");

  // Form State
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(
    initialValues?.description || "",
  );
  const [surveyId, setSurveyId] = useState<string | null>(
    initialValues?.surveyId || defaultSurveyId || null,
  );
  const [trigger, setTrigger] = useState<SurveyRuleTrigger>(
    initialValues?.trigger || "SURVEY_SUBMITTED",
  );
  const [conditionOperator, setConditionOperator] = useState<"AND" | "OR">(
    (initialValues?.conditionOperator as "AND" | "OR") || "AND",
  );
  const [conditions, setConditions] = useState<SurveyRuleConditionInput[]>(
    initialValues?.conditions
      ? initialValues.conditions.map((c) => ({
          field: c.field,
          operator: c.operator,
          value: c.value,
        }))
      : [],
  );
  const [actions, setActions] = useState<SurveyRuleActionInput[]>(
    initialValues?.actions
      ? initialValues.actions.map((a) => ({
          type: a.type,
          tierId: a.tierId || undefined,
          templateId: a.templateId || undefined,
          emailSubject: a.emailSubject || undefined,
          emailBody: a.emailBody || undefined,
          communityId: a.communityId || undefined,
          tags: a.tags ? [...a.tags] : undefined,
          notificationMessage: a.notificationMessage || undefined,
          pushTitle: a.pushTitle || undefined,
          pushBody: a.pushBody || undefined,
          push: a.push ?? undefined,
          conditionOperator: (a.conditionOperator as "AND" | "OR") || "AND",
          conditions: a.conditions?.map((c) => ({
            field: c.field,
            operator: c.operator,
            value: c.value,
          })),
        }))
      : [{ type: "ASSIGN_MEMBERSHIP_TIER" }],
  );
  const [isActive, setIsActive] = useState(
    initialValues ? initialValues.isActive : true,
  );
  const [savedState, setSavedState] = useState(false);

  // Sync state when initialValues loads/changes (critical for edit pages)
  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || "");
      setDescription(initialValues.description || "");
      setSurveyId(initialValues.surveyId || defaultSurveyId || null);
      setTrigger(initialValues.trigger || "SURVEY_SUBMITTED");
      setConditionOperator(
        (initialValues.conditionOperator as "AND" | "OR") || "AND",
      );
      setConditions(
        initialValues.conditions
          ? initialValues.conditions.map((c) => ({
              field: c.field,
              operator: c.operator,
              value: c.value,
            }))
          : [],
      );
      setActions(
        initialValues.actions && initialValues.actions.length > 0
          ? initialValues.actions.map((a) => ({
              type: a.type,
              tierId: a.tierId || undefined,
              templateId: a.templateId || undefined,
              emailSubject: a.emailSubject || undefined,
              emailBody: a.emailBody || undefined,
              communityId: a.communityId || undefined,
              tags: a.tags ? [...a.tags] : undefined,
              notificationMessage: a.notificationMessage || undefined,
              pushTitle: a.pushTitle || undefined,
              pushBody: a.pushBody || undefined,
              push: a.push ?? undefined,
              conditionOperator: (a.conditionOperator as "AND" | "OR") || "AND",
              conditions: a.conditions?.map((c) => ({
                field: c.field,
                operator: c.operator,
                value: c.value,
              })),
            }))
          : [{ type: "ASSIGN_MEMBERSHIP_TIER" }],
      );
      setIsActive(initialValues.isActive ?? true);
    }
  }, [initialValues, defaultSurveyId]);

  const { data: surveysData, loading: surveysLoading } = useGetSurveys({
    variables: { input: {} },
  });
  const surveysList: any[] = surveysData?.getSurveys?.surveys || [];
  const activeSurveyObj = surveysList.find((s) => s.id === surveyId);
  const surveyName =
    activeSurveyObj?.title || initialValues?.surveyName || null;

  // Track changes
  const hasChanged = useMemo(() => {
    if (!initialValues) {
      return name.trim().length > 0 || description.trim().length > 0;
    }
    return (
      name !== initialValues.name ||
      description !== (initialValues.description || "") ||
      surveyId !== (initialValues.surveyId || null) ||
      trigger !== initialValues.trigger ||
      conditionOperator !== (initialValues.conditionOperator || "AND") ||
      isActive !== initialValues.isActive ||
      JSON.stringify(conditions) !==
        JSON.stringify(
          initialValues.conditions?.map((c) => ({
            field: c.field,
            operator: c.operator,
            value: c.value,
          })) || [],
        ) ||
      JSON.stringify(actions) !==
        JSON.stringify(
          initialValues.actions?.map((a) => ({
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
          })) || [],
        )
    );
  }, [
    name,
    description,
    surveyId,
    trigger,
    conditionOperator,
    conditions,
    actions,
    isActive,
    initialValues,
  ]);

  const handleReset = () => {
    if (initialValues) {
      setName(initialValues.name || "");
      setDescription(initialValues.description || "");
      setSurveyId(initialValues.surveyId || defaultSurveyId || null);
      setTrigger(initialValues.trigger || "SURVEY_SUBMITTED");
      setConditionOperator(
        (initialValues.conditionOperator as "AND" | "OR") || "AND",
      );
      setConditions(
        initialValues.conditions
          ? initialValues.conditions.map((c) => ({
              field: c.field,
              operator: c.operator,
              value: c.value,
            }))
          : [],
      );
      setActions(
        initialValues.actions
          ? initialValues.actions.map((a) => ({
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
            }))
          : [],
      );
      setIsActive(initialValues.isActive);
    } else {
      setName("");
      setDescription("");
      setSurveyId(defaultSurveyId || null);
      setTrigger("SURVEY_SUBMITTED");
      setConditionOperator("AND");
      setConditions([]);
      setActions([{ type: "ASSIGN_MEMBERSHIP_TIER" }]);
      setIsActive(true);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a rule name.");
      return;
    }

    if (actions.length === 0) {
      toast.error("Please configure at least one automated action.");
      return;
    }

    const validConditions = conditions.filter((c) => {
      if (c.operator === "is_not_empty" || c.operator === "is_empty")
        return true;
      if (typeof c.value === "string") return c.value.trim().length > 0;
      return c.value !== null && c.value !== undefined;
    });

    const payload: CreateSurveyAutomationRuleInput = {
      name: name.trim(),
      description: description.trim() || undefined,
      surveyId: surveyId || undefined,
      trigger,
      conditionOperator,
      conditions: validConditions,
      actions: actions.map((a) => ({
        type: a.type,
        tierId: a.tierId || undefined,
        templateId: a.templateId || undefined,
        emailSubject: a.emailSubject || undefined,
        emailBody: a.emailBody || undefined,
        communityId: a.communityId || undefined,
        tags: a.tags && a.tags.length > 0 ? a.tags : undefined,
        notificationMessage: a.notificationMessage || undefined,
        pushTitle: a.pushTitle || undefined,
        pushBody: a.pushBody || undefined,
        push: a.push ?? undefined,
        conditionOperator: a.conditionOperator || undefined,
        conditions:
          a.conditions && a.conditions.length > 0
            ? a.conditions.filter((c) => {
                if (c.operator === "is_not_empty" || c.operator === "is_empty")
                  return true;
                if (typeof c.value === "string")
                  return c.value.trim().length > 0;
                return c.value !== null && c.value !== undefined;
              })
            : undefined,
      })),
      isActive,
    };

    const saveHandler = onSave || onSubmit;
    if (!saveHandler) {
      toast.error("Save handler is not configured.");
      return;
    }

    try {
      await saveHandler(payload);
      setSavedState(true);
      setTimeout(() => setSavedState(false), 2500);
    } catch (err: any) {
      if (err?.message) {
        toast.error(err.message);
      }
    }
  };

  if (viewMode === "flow") {
    return (
      <SurveyAutomationFlowBuilder
        name={name}
        description={description}
        surveyId={surveyId}
        surveyName={surveyName}
        trigger={trigger}
        conditionOperator={conditionOperator}
        conditions={conditions}
        actions={actions}
        isActive={isActive}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onSurveyIdChange={setSurveyId}
        onTriggerChange={setTrigger}
        onConditionOperatorChange={setConditionOperator}
        onConditionsChange={setConditions}
        onActionsChange={setActions}
        onIsActiveChange={setIsActive}
        onSave={() => handleSubmit()}
        onReset={handleReset}
        hasChanged={hasChanged}
        isSaving={loading}
        isEdit={isEdit}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Banner View Mode Switcher */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">
              {isEdit
                ? "Edit Survey Automation Rule"
                : "Create Survey Automation Rule"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Configure respondent rewards, emails, tiers, and circles triggered
              by survey submissions.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setViewMode("flow")}
          className="text-xs gap-1.5 font-bold border-cyan-500/40 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/10 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-600" />
          Switch to Visual Canvas
        </Button>
      </div>

      <PolarisFormLayout
        sidebar={
          <>
            <PolarisSidebarCard title="Rule Summary" icon={Sparkles}>
              <PolarisSummaryRow
                label="Workflow Scope"
                value={surveyName || "All Surveys (Global)"}
              />
              <PolarisSummaryRow
                label="Trigger Event"
                value={trigger.replace(/_/g, " ")}
              />
              <PolarisSummaryRow
                label="Rule Logic"
                value={`${conditionOperator} (Match ${conditionOperator === "AND" ? "All" : "Any"})`}
              />
              <PolarisSummaryRow
                label="Global Criteria"
                value={`${conditions.length} rule${conditions.length === 1 ? "" : "s"}`}
              />
              <PolarisSummaryRow
                label="Action Pipeline"
                value={`${actions.length} action${actions.length === 1 ? "" : "s"}`}
              />
              <PolarisSummaryRow
                label="Active Status"
                value={
                  <Badge
                    variant="outline"
                    className={
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                    }
                  >
                    {isActive ? "Active" : "Paused"}
                  </Badge>
                }
              />
            </PolarisSidebarCard>

            <PolarisTipCard title="Survey Automation Tips" icon={TrendingUp}>
              <ul className="space-y-2 text-[11px] text-muted-foreground list-disc pl-3 leading-relaxed">
                <li>
                  Use <strong>Action-Level Filters</strong> to build
                  multi-option branching paths (e.g. Option contains
                  "Mentorship").
                </li>
                <li>
                  Assign VIP membership tiers to 5-star respondents
                  automatically.
                </li>
                <li>
                  Send transactional follow-up emails via the integrated
                  GrapesJS Studio.
                </li>
              </ul>
            </PolarisTipCard>
          </>
        }
      >
        <SurveyRuleDetailsCard
          name={name}
          description={description}
          surveyId={surveyId}
          trigger={trigger}
          isActive={isActive}
          surveysList={surveysList}
          surveysLoading={surveysLoading}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onSurveyIdChange={setSurveyId}
          onTriggerChange={setTrigger}
          onIsActiveChange={setIsActive}
        />

        <SurveyGlobalConditionsCard
          conditions={conditions}
          conditionOperator={conditionOperator}
          onConditionOperatorChange={setConditionOperator}
          onConditionsChange={setConditions}
        />

        <SurveyActionPipelineCard
          actions={actions}
          onActionsChange={setActions}
        />
      </PolarisFormLayout>

      <FloatingSavePanel
        hasChanged={hasChanged}
        saved={savedState}
        isSaving={loading}
        onSave={() => handleSubmit()}
        onReset={handleReset}
        title="Unsaved survey rule changes"
        buttonText={isEdit ? "Update Rule" : "Create Rule"}
      />
    </form>
  );
};
