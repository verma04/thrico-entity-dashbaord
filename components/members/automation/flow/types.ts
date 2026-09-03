import {
  MemberRuleTrigger,
  MemberRuleConditionInput,
  MemberRuleActionInput,
  MemberRuleActionType,
} from "@/graphql/member-automation";

export type FlowNodeType = "trigger" | "condition" | "action" | "addAction";

export interface TriggerNodeData {
  trigger: MemberRuleTrigger;
  label?: string;
  onSelect?: () => void;
  [key: string]: any;
}

export interface ConditionNodeData {
  conditions: MemberRuleConditionInput[];
  conditionOperator: "AND" | "OR";
  onAddCondition?: () => void;
  onRemoveCondition?: (index: number) => void;
  onOperatorChange?: (op: "AND" | "OR") => void;
  onSelect?: () => void;
  simulationStatus?: "passed" | "failed" | "idle" | "running";
  [key: string]: any;
}

export interface ActionNodeData {
  action: MemberRuleActionInput;
  index: number;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onSelect?: () => void;
  simulationStatus?: "executed" | "skipped" | "idle" | "running";
  [key: string]: any;
}

export interface AddActionNodeData {
  onAddAction: (type: MemberRuleActionType) => void;
  [key: string]: any;
}

export type SelectedNodeInfo =
  | { type: "trigger"; data: TriggerNodeData }
  | { type: "condition"; data: ConditionNodeData }
  | { type: "action"; data: ActionNodeData; index: number }
  | null;

export interface SimulationMemberProfile {
  name: string;
  email: string;
  college?: string;
  graduationYear?: string;
  gender?: string;
  city?: string;
  country?: string;
  company?: string;
  jobTitle?: string;
  tags?: string[];
}
