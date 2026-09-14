import {
  RewardAutomationModule,
  RewardRuleTrigger,
  RewardRuleActionType,
  RewardRuleConditionInput,
  RewardRuleActionInput,
} from "@/graphql/rewards-automation";

export interface SelectedNodeInfo {
  type: "trigger" | "condition" | "action";
  data?: any;
}

export interface RewardsSimulationProfile {
  name: string;
  email: string;
  pointsBalance: number;
  currencyBalance: number;
  currentTier: string;
  isWinner: boolean;
  gameConfigId?: string;
  gameTitle?: string;
  prizeType?: string;
  faceValue?: number;
  streakCount?: number;
  tags: string[];
}

export interface SimulationResult {
  passed: boolean;
  conditionResults: { field: string; passed: boolean; actualValue?: any }[];
  executedActions: RewardRuleActionInput[];
  branchPathTaken: "yes" | "no";
  reason: string;
}
