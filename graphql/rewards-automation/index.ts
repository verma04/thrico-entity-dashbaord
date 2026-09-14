import { gql } from "@apollo/client";

export type RewardAutomationModule =
  | "REWARDS"
  | "SPIN_WHEEL"
  | "SCRATCH_CARD"
  | "MATCH_WIN";

export type RewardRuleTrigger =
  | "REWARD_CLAIMED"
  | "REWARD_REDEEMED"
  | "REWARD_EXPIRED"
  | "SPIN_WHEEL_PLAYED"
  | "SCRATCH_CARD_PLAYED"
  | "MATCH_WIN_PLAYED"
  | "PRIZE_WON"
  | "NO_REWARDS";

export type RewardRuleActionType =
  | "ASSIGN_MEMBERSHIP_TIER"
  | "EMAIL"
  | "NOTIFICATION"
  | "COMMUNITY_JOIN"
  | "ADD_MEMBER_TAG"
  | "AWARD_POINTS"
  | "AWARD_BADGE"
  | "AWARD_CURRENCY"
  | "AWARD_REWARD"
  | "CUSTOM_WEBHOOK"
  | "WEBHOOK";

export interface RewardRuleBranchItem {
  id: string;
  name: string;
  isDefault?: boolean | null;
  hasNoPath?: boolean | null;
}

export interface RewardRuleCondition {
  field: string;
  operator: string;
  value: any;
  branch?: string | null;
}

export interface RewardRuleConditionInput {
  field: string;
  operator: string;
  value: any;
  branch?: string | null;
}

export interface RewardRuleAction {
  type: RewardRuleActionType | string;
  branch?: string | null;
  tierId?: string | null;
  tierName?: string | null;
  tags?: string[] | null;
  notificationMessage?: string | null;
  pushTitle?: string | null;
  pushBody?: string | null;
  push?: boolean | null;
  emailSubject?: string | null;
  emailBody?: string | null;
  templateId?: string | null;
  templateName?: string | null;
  communityId?: string | null;
  communityName?: string | null;
  badgeId?: string | null;
  badgeName?: string | null;
  currencyAmount?: number | null;
  currencyType?: string | null;
  rewardId?: string | null;
  rewardTitle?: string | null;
  points?: { points: number } | null;
  currency?: { amount: number; currencyType: string } | null;
  badge?: { badgeId: string; badgeName?: string | null } | null;
  reward?: { rewardId: string; rewardTitle?: string | null } | null;
  tier?: { tierId: string; tierName?: string | null } | null;
  email?: { templateId?: string | null; subject?: string | null; body?: string | null } | null;
  notification?: { message?: string | null; pushTitle?: string | null; pushBody?: string | null; push?: boolean | null } | null;
  webhook?: { url: string; method?: string | null; headers?: any } | null;
}

export interface RewardRuleActionInput {
  type: RewardRuleActionType | string;
  branch?: string | null;
  tierId?: string | null;
  tierName?: string | null;
  tags?: string[] | null;
  notificationMessage?: string | null;
  pushTitle?: string | null;
  pushBody?: string | null;
  push?: boolean | null;
  emailSubject?: string | null;
  emailBody?: string | null;
  templateId?: string | null;
  templateName?: string | null;
  communityId?: string | null;
  communityName?: string | null;
  badgeId?: string | null;
  badgeName?: string | null;
  currencyAmount?: number | null;
  currencyType?: string | null;
  rewardId?: string | null;
  rewardTitle?: string | null;
  points?: { points: number } | null;
  currency?: { amount: number; currencyType: string } | null;
  badge?: { badgeId: string; badgeName?: string | null } | null;
  reward?: { rewardId: string; rewardTitle?: string | null } | null;
  tier?: { tierId: string; tierName?: string | null } | null;
  email?: { templateId?: string | null; subject?: string | null; body?: string | null } | null;
  notification?: { message?: string | null; pushTitle?: string | null; pushBody?: string | null; push?: boolean | null } | null;
  tag?: { tags: string[] } | null;
  webhook?: { url: string; method?: string | null; headers?: any } | null;
}

export interface CanvasNodeState {
  id: string;
  type: string;
  position: { x: number; y: number };
  data?: any;
}

export interface CanvasEdgeState {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string | null;
  animated?: boolean | null;
}

export interface RewardsAutomationRule {
  id: string;
  name: string;
  description?: string | null;
  entityId?: string;
  rewardId?: string | null;
  rewardTitle?: string | null;
  trigger: RewardRuleTrigger;
  conditionOperator?: "AND" | "OR" | string;
  conditions?: RewardRuleCondition[] | null;
  actions: RewardRuleAction[];
  branches?: RewardRuleBranchItem[] | null;
  canvasNodes?: CanvasNodeState[] | null;
  canvasEdges?: CanvasEdgeState[] | null;
  isActive: boolean;
  priority?: number | null;
  executionCount?: number | null;
  lastRunAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  module?: RewardAutomationModule | null;
}

export interface CreateRewardsAutomationRuleInput {
  name: string;
  description?: string | null;
  rewardId?: string | null;
  trigger: RewardRuleTrigger | string;
  conditionOperator?: string;
  conditions?: RewardRuleConditionInput[];
  actions: RewardRuleActionInput[];
  branches?: RewardRuleBranchItem[];
  canvasNodes?: any;
  canvasEdges?: any;
  isActive?: boolean;
  priority?: number;
}

export interface UpdateRewardsAutomationRuleInput {
  name?: string;
  description?: string | null;
  rewardId?: string | null;
  trigger?: RewardRuleTrigger | string;
  conditionOperator?: string;
  conditions?: RewardRuleConditionInput[];
  actions?: RewardRuleActionInput[];
  branches?: RewardRuleBranchItem[];
  canvasNodes?: any;
  canvasEdges?: any;
  isActive?: boolean;
  priority?: number;
}

export type CreateRewardsRuleInput = CreateRewardsAutomationRuleInput;
export type UpdateRewardsRuleInput = UpdateRewardsAutomationRuleInput;

export interface RewardsAutomationRuleStats {
  campaignId: string;
  campaignName?: string;
  module?: string;
  totalRuns: number;
  successRuns: number;
  failedRuns: number;
  processingRuns?: number;
  lastRunAt?: string | null;
  firstRunAt?: string | null;
}

export interface RewardsAutomationRuleLog {
  id: string;
  campaignId?: string;
  userId: string;
  userName?: string | null;
  userEmail?: string | null;
  actionIndex?: number;
  actionType: string;
  status: string;
  branch?: string | null;
  durationMs?: number | null;
  errorMessage?: string | null;
  executedAt?: string | null;
  createdAt?: string | null;
}

export interface RewardsAutomationLogsResponse {
  logs: RewardsAutomationRuleLog[];
  totalCount: number;
  hasMore: boolean;
}

export interface AutomationMetadataTrigger {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
}

export interface AutomationMetadataField {
  id: string;
  name: string;
  type: string;
  options?: {
    label: string;
    value: string;
  }[] | null;
  // Fallbacks for backward compatibility
  key?: string;
  label?: string;
  operators?: string[] | null;
  description?: string | null;
}

export interface AutomationMetadataModule {
  id: RewardAutomationModule | string;
  name: string;
  description?: string | null;
  triggers: AutomationMetadataTrigger[];
  segmentationFields: AutomationMetadataField[];
}


export interface AutomationMetadataResponse {
  modules: AutomationMetadataModule[];
}

// ── Action Formatters & Adapters ─────────────────────────────────────────────

export const formatRewardsActionInput = (
  action: RewardRuleActionInput
): any => {
  return {
    type: action.type,
    branch: action.branch || "branch_1_yes",
    tierId: action.tierId || action.tier?.tierId || undefined,
    templateId: action.templateId || action.email?.templateId || undefined,
    emailSubject: action.emailSubject || action.email?.subject || undefined,
    emailBody: action.emailBody || action.email?.body || undefined,
    notificationMessage:
      action.notificationMessage || action.notification?.message || undefined,
    pushTitle: action.pushTitle || action.notification?.pushTitle || undefined,
    pushBody: action.pushBody || action.notification?.pushBody || undefined,
    push: action.push ?? action.notification?.push ?? undefined,
    badgeId: action.badgeId || action.badge?.badgeId || undefined,
    rewardId: action.rewardId || action.reward?.rewardId || undefined,
    currencyAmount:
      action.currencyAmount || action.currency?.amount || undefined,
    currencyType:
      action.currencyType || action.currency?.currencyType || undefined,
    tags:
      action.tags && action.tags.length > 0
        ? action.tags
        : action.tag?.tags || undefined,
    points: action.points
      ? { points: Number(action.points.points) || 0 }
      : undefined,
    currency: action.currency
      ? {
          amount: Number(action.currency.amount) || 0,
          currencyType: action.currency.currencyType || "TC",
        }
      : undefined,
    tier: action.tierId ? { tierId: action.tierId } : undefined,
    email:
      action.emailSubject || action.templateId
        ? {
            templateId: action.templateId || undefined,
            subject: action.emailSubject || undefined,
            body: action.emailBody || undefined,
          }
        : undefined,
    notification:
      action.pushTitle || action.notificationMessage
        ? {
            pushTitle: action.pushTitle || undefined,
            pushBody: action.pushBody || undefined,
            message: action.notificationMessage || action.pushBody || undefined,
            push: action.push ?? true,
          }
        : undefined,
    tag: action.tags && action.tags.length > 0 ? { tags: action.tags } : undefined,
    badge: action.badgeId ? { badgeId: action.badgeId } : undefined,
    reward: action.rewardId ? { rewardId: action.rewardId } : undefined,
  };
};

export const serializeActionToConfig = formatRewardsActionInput;

export const deserializeActionFromConfig = (
  rawAction: any
): RewardRuleAction => {
  return {
    ...rawAction,
    branch: rawAction.branch || "branch_1_yes",
    tierId: rawAction.tierId || rawAction.tier?.tierId || null,
    tierName: rawAction.tierName || rawAction.tier?.tierName || null,
    templateId: rawAction.templateId || rawAction.email?.templateId || null,
    templateName: rawAction.templateName || rawAction.email?.templateName || null,
    emailSubject: rawAction.emailSubject || rawAction.email?.subject || null,
    emailBody: rawAction.emailBody || rawAction.email?.body || null,
    communityId: rawAction.communityId || rawAction.community?.communityId || null,
    communityName: rawAction.communityName || rawAction.community?.communityName || null,
    tags: rawAction.tags || rawAction.tag?.tags || [],
    notificationMessage:
      rawAction.notificationMessage || rawAction.notification?.message || null,
    pushTitle: rawAction.pushTitle || rawAction.notification?.pushTitle || null,
    pushBody: rawAction.pushBody || rawAction.notification?.pushBody || null,
    push:
      rawAction.push !== undefined
        ? rawAction.push
        : rawAction.notification?.push ?? true,
    badgeId: rawAction.badgeId || rawAction.badge?.badgeId || null,
    badgeName: rawAction.badgeName || rawAction.badge?.badgeName || null,
    rewardId: rawAction.rewardId || rawAction.reward?.rewardId || null,
    rewardTitle: rawAction.rewardTitle || rawAction.reward?.rewardTitle || null,
    currencyAmount:
      rawAction.currencyAmount || rawAction.currency?.amount || null,
    currencyType:
      rawAction.currencyType || rawAction.currency?.currencyType || "TC",
    points: rawAction.points
      ? { points: Number(rawAction.points.points || rawAction.points) }
      : null,
    currency: rawAction.currency
      ? {
          amount: Number(rawAction.currency.amount),
          currencyType: rawAction.currency.currencyType || "TC",
        }
      : rawAction.currencyAmount
      ? {
          amount: Number(rawAction.currencyAmount),
          currencyType: rawAction.currencyType || "TC",
        }
      : null,
  };
};

// ── GraphQL Documents ──────────────────────────────────────────────────────────

export const GET_AUTOMATION_METADATA = gql`
  query GetAutomationMetadata($entityId: ID!) {
    getAutomationMetadata(entityId: $entityId) {
      modules {
        id
        name
        triggers {
          id
          name
        }
        segmentationFields {
          id
          name
          type
          options {
            label
            value
          }
        }
      }
    }
  }
`;


export const GET_REWARDS_AUTOMATION_RULES = gql`
  query GetRewardsAutomationRules($rewardId: ID) {
    getRewardsAutomationRules(rewardId: $rewardId) {
      id
      entityId
      name
      description
      rewardId
      rewardTitle
      trigger
      conditionOperator
      conditions {
        field
        operator
        value
        branch
      }
      actions {
        type
        branch
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        tags
        notificationMessage
        pushTitle
        pushBody
        push
        badgeId
        badgeName
        currencyAmount
        currencyType
        rewardId
        rewardTitle
        points {
          points
        }
        currency {
          amount
          currencyType
        }
      }
      branches {
        id
        name
        isDefault
        hasNoPath
      }
      isActive
      priority
      executionCount
      lastRunAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_REWARDS_AUTOMATION_RULE = gql`
  query GetRewardsAutomationRule($id: ID!) {
    getRewardsAutomationRule(id: $id) {
      id
      entityId
      name
      description
      rewardId
      rewardTitle
      trigger
      conditionOperator
      conditions {
        field
        operator
        value
        branch
      }
      actions {
        type
        branch
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        tags
        notificationMessage
        pushTitle
        pushBody
        push
        badgeId
        badgeName
        currencyAmount
        currencyType
        rewardId
        rewardTitle
        points {
          points
        }
        currency {
          amount
          currencyType
        }
      }
      branches {
        id
        name
        isDefault
        hasNoPath
      }
      canvasNodes
      canvasEdges
      isActive
      priority
      executionCount
      lastRunAt
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_REWARDS_AUTOMATION_RULE = gql`
  mutation CreateRewardsAutomationRule($input: CreateRewardsAutomationRuleInput!) {
    createRewardsAutomationRule(input: $input) {
      id
      entityId
      name
      description
      trigger
      rewardId
      rewardTitle
      conditionOperator
      conditions {
        field
        operator
        value
        branch
      }
      actions {
        type
        branch
        tierId
        pushTitle
        pushBody
      }
      branches {
        id
        name
        isDefault
        hasNoPath
      }
      isActive
      priority
      createdAt
    }
  }
`;

export const UPDATE_REWARDS_AUTOMATION_RULE = gql`
  mutation UpdateRewardsAutomationRule(
    $id: ID!
    $input: UpdateRewardsAutomationRuleInput!
  ) {
    updateRewardsAutomationRule(id: $id, input: $input) {
      id
      entityId
      name
      description
      trigger
      rewardId
      isActive
      updatedAt
    }
  }
`;

export const TOGGLE_REWARDS_AUTOMATION_RULE = gql`
  mutation ToggleRewardsAutomationRule($id: ID!, $isActive: Boolean!) {
    toggleRewardsAutomationRule(id: $id, isActive: $isActive) {
      id
      isActive
    }
  }
`;

export const DELETE_REWARDS_AUTOMATION_RULE = gql`
  mutation DeleteRewardsAutomationRule($id: ID!) {
    deleteRewardsAutomationRule(id: $id)
  }
`;

export const GET_REWARDS_AUTOMATION_RULE_STATS = gql`
  query GetRewardsAutomationRuleStats($ruleId: ID!) {
    getRewardsAutomationRuleStats(ruleId: $ruleId) {
      campaignId
      campaignName
      module
      totalRuns
      successRuns
      failedRuns
      processingRuns
      lastRunAt
      firstRunAt
    }
  }
`;

export const GET_REWARDS_AUTOMATION_RULE_LOGS = gql`
  query GetRewardsAutomationRuleLogs($ruleId: ID!, $limit: Int, $offset: Int, $status: String) {
    getRewardsAutomationRuleLogs(ruleId: $ruleId, limit: $limit, offset: $offset, status: $status) {
      totalCount
      hasMore
      logs {
        id
        campaignId
        userId
        userName
        userEmail
        actionIndex
        actionType
        status
        branch
        durationMs
        errorMessage
        executedAt
      }
    }
  }
`;

