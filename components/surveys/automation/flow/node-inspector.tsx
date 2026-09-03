"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { X, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GET_MEMBERSHIP_TIERS } from "@/graphql/membership-tier";
import { GET_EMAIL_TEMPLATES } from "@/graphql/quries/email";
import { GET_COMMUNITIES } from "@/graphql/quries/group/approval";
import { useGetSurveys } from "@/graphql/surveys/survey-queries";
import {
  SurveyRuleTrigger,
  SurveyRuleConditionInput,
  SurveyRuleActionInput,
  SurveyRuleActionType,
} from "@/graphql/survey-automation";
import { SelectedSurveyNodeInfo } from "./types";
import {
  TriggerInspector,
  GlobalConditionInspector,
  BranchConditionInspector,
  ActionInspector,
} from "./inspector";

interface NodeInspectorProps {
  selectedNode: SelectedSurveyNodeInfo;
  surveyId?: string | null;
  trigger: SurveyRuleTrigger;
  conditionOperator: "AND" | "OR";
  conditions: SurveyRuleConditionInput[];
  actions: SurveyRuleActionInput[];
  branches?: {
    conditions: SurveyRuleConditionInput[];
    conditionOperator: "AND" | "OR";
    actionsWithIndices: { action: SurveyRuleActionInput; originalIndex: number }[];
  }[];
  onSurveyIdChange: (id: string | null) => void;
  onTriggerChange: (trigger: SurveyRuleTrigger) => void;
  onConditionOperatorChange: (op: "AND" | "OR") => void;
  onConditionsChange: (conditions: SurveyRuleConditionInput[]) => void;
  onActionUpdate: (index: number, action: Partial<SurveyRuleActionInput>) => void;
  onActionDelete: (index: number) => void;
  onBranchConditionsChange?: (
    branchIndex: number,
    conditions: SurveyRuleConditionInput[],
    conditionOperator: "AND" | "OR"
  ) => void;
  onAddActionToBranch?: (branchIndex: number, type: SurveyRuleActionType) => void;
  onDuplicateBranch?: (branchIndex: number) => void;
  onDeleteBranch?: (branchIndex: number) => void;
  onClose: () => void;
}

export const SurveyNodeInspector: React.FC<NodeInspectorProps> = ({
  selectedNode,
  surveyId,
  trigger,
  conditionOperator,
  conditions,
  actions,
  branches = [],
  onSurveyIdChange,
  onTriggerChange,
  onConditionOperatorChange,
  onConditionsChange,
  onActionUpdate,
  onActionDelete,
  onBranchConditionsChange,
  onDuplicateBranch,
  onDeleteBranch,
  onClose,
}) => {
  const { data: tiersData, loading: tiersLoading } =
    useQuery(GET_MEMBERSHIP_TIERS);
  const { data: emailsData, loading: emailsLoading } =
    useQuery(GET_EMAIL_TEMPLATES);
  const { data: communitiesData, loading: communitiesLoading } = useQuery(
    GET_COMMUNITIES,
    { variables: { input: {} } }
  );
  const { data: surveysData, loading: surveysLoading } = useGetSurveys({
    variables: { input: {} },
  });

  const tiers: any[] = tiersData?.getMembershipTiers || [];
  const emailTemplates: any[] = emailsData?.getEmailTemplates || [];
  const communities: any[] =
    communitiesData?.getCommunities?.data ||
    communitiesData?.getAllCommunities ||
    [];
  const surveysList: any[] = surveysData?.getSurveys?.surveys || [];

  if (!selectedNode) return null;

  const currentAction =
    selectedNode.type === "action" ? actions[selectedNode.index] : null;

  const currentBranch =
    selectedNode.type === "branchCondition" && branches[selectedNode.branchIndex]
      ? branches[selectedNode.branchIndex]
      : null;

  const currentBranchConds =
    currentBranch?.conditions ||
    (selectedNode.type === "branchCondition"
      ? selectedNode.data.conditions || []
      : []);

  const currentBranchOp =
    currentBranch?.conditionOperator ||
    (selectedNode.type === "branchCondition"
      ? selectedNode.data.conditionOperator || "AND"
      : "AND");

  return (
    <aside className="w-[360px] xl:w-[410px] h-full bg-card border-l border-border flex flex-col shadow-xl animate-in slide-in-from-right duration-200 z-20">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase block truncate">
              Survey Flow Inspector
            </span>
            <h3 className="text-xs font-bold text-foreground truncate">
              {selectedNode.type === "trigger" && "Trigger Event & Scope"}
              {selectedNode.type === "condition" && "Global Response Criteria"}
              {selectedNode.type === "branchCondition" &&
                `Condition Branch #${selectedNode.branchIndex + 1}`}
              {selectedNode.type === "action" &&
                `Action #${selectedNode.index + 1} & Branching`}
            </h3>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {selectedNode.type === "trigger" && (
          <TriggerInspector
            surveyId={surveyId}
            trigger={trigger}
            surveysList={surveysList}
            surveysLoading={surveysLoading}
            onSurveyIdChange={onSurveyIdChange}
            onTriggerChange={onTriggerChange}
          />
        )}

        {selectedNode.type === "condition" && (
          <GlobalConditionInspector
            conditions={conditions}
            conditionOperator={conditionOperator}
            onConditionOperatorChange={onConditionOperatorChange}
            onConditionsChange={onConditionsChange}
          />
        )}

        {selectedNode.type === "branchCondition" && (
          <BranchConditionInspector
            branchIndex={selectedNode.branchIndex}
            conditions={currentBranchConds}
            conditionOperator={currentBranchOp}
            onBranchConditionsChange={onBranchConditionsChange}
            onDuplicateBranch={onDuplicateBranch}
            onDeleteBranch={onDeleteBranch}
          />
        )}

        {selectedNode.type === "action" && currentAction && (
          <ActionInspector
            action={currentAction}
            actionIndex={selectedNode.index}
            tiers={tiers}
            tiersLoading={tiersLoading}
            emailTemplates={emailTemplates}
            emailsLoading={emailsLoading}
            communities={communities}
            communitiesLoading={communitiesLoading}
            onActionUpdate={onActionUpdate}
            onActionDelete={onActionDelete}
          />
        )}
      </div>
    </aside>
  );
};
