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
  ArrowLeft,
  X,
  Save,
  ListFilter,
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
      <div className="w-full h-full flex flex-col overflow-hidden bg-background">
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
          onCancel={onCancel}
          hasChanged={hasChanged}
          saved={savedState}
          isSaving={loading}
          isEdit={isEdit}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-background">
      {/* Top Navbar */}
      <header className="h-14 px-4 bg-card border-b border-border flex items-center justify-between gap-3 shrink-0 z-10 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {onCancel && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-8 px-2.5 text-xs font-semibold gap-1.5 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                title="Back to Automation Rules"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="h-4 w-px bg-border shrink-0" />
            </>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold shrink-0 shadow-xs">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase leading-none">
                  Survey Automation
                </span>
                <Badge
                  variant="outline"
                  className="text-[8.5px] font-bold px-1 py-0 h-3.5 border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 bg-cyan-50/60 dark:bg-cyan-950/30"
                >
                  {isEdit ? "Edit Form" : "Step Form"}
                </Badge>
              </div>
              <span className="text-[11px] font-semibold text-foreground/80 leading-tight">
                Feedback Lifecycle Rules
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-border shrink-0 hidden md:block" />

          {/* Rule Title Preview */}
          <span className="text-xs font-bold text-foreground truncate max-w-xs hidden sm:inline">
            {name || "Untitled Rule"}
          </span>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View Switcher: Canvas <-> Form */}
          <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setViewMode("flow")}
              className="px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("form")}
              className="px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all bg-card text-foreground shadow-xs cursor-pointer"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Step Form</span>
            </button>
          </div>

          {/* Primary Save Button */}
          <Button
            type="button"
            size="sm"
            disabled={loading}
            onClick={() => handleSubmit()}
            className="h-8 px-3 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            {loading ? "Saving..." : isEdit ? "Update Rule" : "Create Rule"}
          </Button>

          {/* Close Button (X) */}
          {onCancel && (
            <>
              <div className="h-4 w-px bg-border shrink-0 ml-0.5" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
                title="Close Studio (Esc)"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main Scrollable Form Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-50/60 dark:bg-zinc-950/40">
        <div className="max-w-5xl mx-auto pb-16">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                      label="Active Branches"
                      value={`${actions.length} Action${
                        actions.length === 1 ? "" : "s"
                      }`}
                    />
                    <PolarisSummaryRow
                      label="Status"
                      value={isActive ? "Active Rule" : "Paused"}
                    />
                  </PolarisSidebarCard>

                  <PolarisTipCard title="Pro-Tip">
                    Branch conditions allow segmenting respondent actions based
                    on specific question answers, ratings, or tags.
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
        </div>
      </div>
    </div>
  );
};
