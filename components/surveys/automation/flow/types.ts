import {
  SurveyRuleTrigger,
  SurveyRuleConditionInput,
  SurveyRuleActionInput,
  SurveyRuleActionType,
} from "@/graphql/survey-automation";

export type FlowNodeType =
  | "trigger"
  | "condition"
  | "branchCondition"
  | "action"
  | "addAction"
  | "addBranch";

export interface SurveyTriggerNodeData {
  trigger: SurveyRuleTrigger;
  surveyId?: string | null;
  surveyName?: string | null;
  label?: string;
  onSelect?: () => void;
  [key: string]: any;
}

export interface SurveyBranchConditionNodeData {
  branchIndex: number;
  branchTitle?: string;
  conditions: SurveyRuleConditionInput[];
  conditionOperator: "AND" | "OR";
  actionCount: number;
  onAddCondition?: () => void;
  onRemoveCondition?: (index: number) => void;
  onOperatorChange?: (op: "AND" | "OR") => void;
  onAddActionToBranch?: (type: SurveyRuleActionType) => void;
  onDuplicateBranch?: () => void;
  onDeleteBranch?: () => void;
  onSelect?: () => void;
  simulationStatus?: "passed" | "failed" | "idle" | "running";
  [key: string]: any;
}

export interface SurveyConditionNodeData {
  conditions: SurveyRuleConditionInput[];
  conditionOperator: "AND" | "OR";
  onAddCondition?: () => void;
  onRemoveCondition?: (index: number) => void;
  onOperatorChange?: (op: "AND" | "OR") => void;
  onSelect?: () => void;
  simulationStatus?: "passed" | "failed" | "idle" | "running";
  [key: string]: any;
}

export interface SurveyActionNodeData {
  action: SurveyRuleActionInput;
  index: number;
  branchIndex?: number;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onSelect?: () => void;
  simulationStatus?: "executed" | "skipped" | "idle" | "running";
  [key: string]: any;
}

export interface SurveyAddActionNodeData {
  onAddAction: (type: SurveyRuleActionType) => void;
  branchIndex?: number;
  [key: string]: any;
}

export interface SurveyAddBranchNodeData {
  onAddBranch: () => void;
  [key: string]: any;
}

export type SelectedSurveyNodeInfo =
  | { type: "trigger"; data: SurveyTriggerNodeData }
  | { type: "condition"; data: SurveyConditionNodeData }
  | { type: "branchCondition"; data: SurveyBranchConditionNodeData; branchIndex: number }
  | { type: "action"; data: SurveyActionNodeData; index: number }
  | null;

export interface SimulationSurveyResponse {
  respondentName: string;
  respondentEmail: string;
  rating?: number;
  isPromoter?: boolean;
  npsScore?: number;
  completionTimeSeconds?: number;
  answers?: Record<string, any>;
  memberTags?: string[];
}
