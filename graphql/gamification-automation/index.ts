import { gql } from "@apollo/client";

// ==========================================
// 1. MODULE TYPES & TRIGGERS
// ==========================================

export type GamificationModuleType =
  | "POINTS"
  | "BADGES"
  | "RANKS"
  | "LEADERBOARD"
  | "CURRENCY";

export type PointsRuleTrigger =
  | "POINTS_EARNED"
  | "POINTS_THRESHOLD_REACHED"
  | "DAILY_CAP_REACHED"
  | "WEEKLY_CAP_REACHED"
  | "MONTHLY_CAP_REACHED";

export type BadgesRuleTrigger =
  | "BADGE_EARNED"
  | "BADGE_PROGRESS_UPDATED"
  | "ALL_BADGES_COMPLETED";

export type RanksRuleTrigger =
  | "RANK_ACHIEVED"
  | "RANK_PROMOTED"
  | "RANK_DEMOTED";

export type LeaderboardRuleTrigger =
  | "LEADERBOARD_TOP_POSITION"
  | "LEADERBOARD_POSITION_CHANGED"
  | "LEADERBOARD_ENTERED";

export type CurrencyRuleTrigger =
  | "EC_EARNED"
  | "TC_COINS_EARNED"
  | "CURRENCY_THRESHOLD_REACHED"
  | "CURRENCY_CONVERTED"
  | "REDEMPTION_COMPLETED"
  | "DAILY_CONVERSION_CAP_REACHED";

export type AnyGamificationTrigger =
  | PointsRuleTrigger
  | BadgesRuleTrigger
  | RanksRuleTrigger
  | LeaderboardRuleTrigger
  | CurrencyRuleTrigger;

// ==========================================
// 2. ACTION TYPES
// ==========================================

export type PointsRuleActionType =
  | "ASSIGN_MEMBERSHIP_TIER"
  | "EMAIL"
  | "NOTIFICATION"
  | "COMMUNITY_JOIN"
  | "ADD_MEMBER_TAG"
  | "AWARD_BADGE";

export type BadgesRuleActionType =
  | "ASSIGN_MEMBERSHIP_TIER"
  | "EMAIL"
  | "NOTIFICATION"
  | "COMMUNITY_JOIN"
  | "ADD_MEMBER_TAG"
  | "AWARD_POINTS";

export type RanksRuleActionType =
  | "ASSIGN_MEMBERSHIP_TIER"
  | "EMAIL"
  | "NOTIFICATION"
  | "COMMUNITY_JOIN"
  | "ADD_MEMBER_TAG"
  | "AWARD_POINTS"
  | "AWARD_BADGE";

export type LeaderboardRuleActionType =
  | "ASSIGN_MEMBERSHIP_TIER"
  | "EMAIL"
  | "NOTIFICATION"
  | "COMMUNITY_JOIN"
  | "ADD_MEMBER_TAG"
  | "AWARD_POINTS"
  | "AWARD_BADGE";

export type CurrencyRuleActionType =
  | "ASSIGN_MEMBERSHIP_TIER"
  | "EMAIL"
  | "NOTIFICATION"
  | "COMMUNITY_JOIN"
  | "ADD_MEMBER_TAG"
  | "AWARD_POINTS"
  | "AWARD_BADGE"
  | "AWARD_CURRENCY";

export type AnyGamificationActionType =
  | PointsRuleActionType
  | BadgesRuleActionType
  | RanksRuleActionType
  | LeaderboardRuleActionType
  | CurrencyRuleActionType;

// ==========================================
// 3. CONDITIONS & COMMON PAYLOADS
// ==========================================

export interface GamificationRuleCondition {
  field: string;
  operator: string;
  value: any;
}

export interface GamificationRuleConditionInput {
  field: string;
  operator: string;
  value: any;
}

export interface AutomationTierAction {
  tierId: string;
  tierName?: string | null;
}

export interface AutomationTierActionInput {
  tierId: string;
}

export interface AutomationEmailAction {
  templateId?: string | null;
  templateName?: string | null;
  subject?: string | null;
  body?: string | null;
}

export interface AutomationEmailActionInput {
  templateId?: string | null;
  subject?: string | null;
  body?: string | null;
}

export interface AutomationNotificationAction {
  message?: string | null;
  pushTitle?: string | null;
  pushBody?: string | null;
  push?: boolean | null;
}

export interface AutomationNotificationActionInput {
  message?: string | null;
  pushTitle?: string | null;
  pushBody?: string | null;
  push?: boolean | null;
}

export interface AutomationCommunityAction {
  communityId: string;
  communityName?: string | null;
}

export interface AutomationCommunityActionInput {
  communityId: string;
}

export interface AutomationTagAction {
  tags: string[];
}

export interface AutomationTagActionInput {
  tags: string[];
}

export interface AutomationBadgeAction {
  badgeId: string;
  badgeName?: string | null;
}

export interface AutomationBadgeActionInput {
  badgeId: string;
}

export interface AutomationPointsAction {
  points: number;
}

export interface AutomationPointsActionInput {
  points: number;
}

export interface AutomationCurrencyAction {
  amount: number;
  currencyType: "EC" | "TC";
}

export interface AutomationCurrencyActionInput {
  amount: number;
  currencyType: "EC" | "TC";
}

// ==========================================
// 4. RULE ACTIONS
// ==========================================

export interface GamificationActionPayload {
  type: AnyGamificationActionType;
  tier?: AutomationTierAction | null;
  email?: AutomationEmailAction | null;
  notification?: AutomationNotificationAction | null;
  community?: AutomationCommunityAction | null;
  tag?: AutomationTagAction | null;
  tags?: string[] | null;
  badge?: AutomationBadgeAction | null;
  points?: AutomationPointsAction | null;
  currency?: AutomationCurrencyAction | null;
  conditionOperator?: string | null;
  conditions?: GamificationRuleCondition[] | null;

  // Backward compatibility flat fields
  tierId?: string | null;
  tierName?: string | null;
  templateId?: string | null;
  templateName?: string | null;
  emailSubject?: string | null;
  emailBody?: string | null;
  communityId?: string | null;
  communityName?: string | null;
  notificationMessage?: string | null;
  pushTitle?: string | null;
  pushBody?: string | null;
  push?: boolean | null;
  badgeId?: string | null;
  badgeName?: string | null;
  currencyAmount?: number | null;
  currencyType?: string | null;
}

export interface GamificationActionInputPayload {
  type: AnyGamificationActionType;
  tier?: AutomationTierActionInput | null;
  email?: AutomationEmailActionInput | null;
  notification?: AutomationNotificationActionInput | null;
  community?: AutomationCommunityActionInput | null;
  tag?: AutomationTagActionInput | null;
  tags?: string[] | null;
  badge?: AutomationBadgeActionInput | null;
  points?: AutomationPointsActionInput | null;
  currency?: AutomationCurrencyActionInput | null;
  conditionOperator?: string | null;
  conditions?: GamificationRuleConditionInput[] | null;

  // Optional flat fields
  tierId?: string | null;
  templateId?: string | null;
  emailSubject?: string | null;
  emailBody?: string | null;
  communityId?: string | null;
  notificationMessage?: string | null;
  pushTitle?: string | null;
  pushBody?: string | null;
  push?: boolean | null;
  badgeId?: string | null;
  currencyAmount?: number | null;
  currencyType?: string | null;
}

// ==========================================
// 5. RULE OBJECTS & INPUTS PER MODULE
// ==========================================

export interface BaseGamificationRule {
  id: string;
  entityId?: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  priority?: number | null;
  conditionOperator?: string | null;
  conditions?: GamificationRuleCondition[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Points Rule
export interface PointsAutomationRule extends BaseGamificationRule {
  pointRuleId?: string | null;
  pointRuleName?: string | null;
  trigger: PointsRuleTrigger;
  actions: GamificationActionPayload[];
}

export interface CreatePointsAutomationRuleInput {
  pointRuleId?: string | null;
  name: string;
  description?: string | null;
  trigger: PointsRuleTrigger;
  conditionOperator?: string;
  conditions?: GamificationRuleConditionInput[];
  actions: GamificationActionInputPayload[];
  isActive?: boolean;
  priority?: number;
}

export interface UpdatePointsAutomationRuleInput {
  pointRuleId?: string | null;
  name?: string;
  description?: string | null;
  trigger?: PointsRuleTrigger;
  conditionOperator?: string;
  conditions?: GamificationRuleConditionInput[];
  actions?: GamificationActionInputPayload[];
  isActive?: boolean;
  priority?: number;
}

// Badges Rule
export interface BadgesAutomationRule extends BaseGamificationRule {
  badgeId?: string | null;
  badgeName?: string | null;
  trigger: BadgesRuleTrigger;
  actions: GamificationActionPayload[];
}

export interface CreateBadgesAutomationRuleInput {
  badgeId?: string | null;
  name: string;
  description?: string | null;
  trigger: BadgesRuleTrigger;
  conditionOperator?: string;
  conditions?: GamificationRuleConditionInput[];
  actions: GamificationActionInputPayload[];
  isActive?: boolean;
  priority?: number;
}

export interface UpdateBadgesAutomationRuleInput {
  badgeId?: string | null;
  name?: string;
  description?: string | null;
  trigger?: BadgesRuleTrigger;
  conditionOperator?: string;
  conditions?: GamificationRuleConditionInput[];
  actions?: GamificationActionInputPayload[];
  isActive?: boolean;
  priority?: number;
}

// Ranks Rule
export interface RanksAutomationRule extends BaseGamificationRule {
  rankId?: string | null;
  rankName?: string | null;
  trigger: RanksRuleTrigger;
  actions: GamificationActionPayload[];
}

export interface CreateRanksAutomationRuleInput {
  rankId?: string | null;
  name: string;
  description?: string | null;
  trigger: RanksRuleTrigger;
  conditionOperator?: string;
  conditions?: GamificationRuleConditionInput[];
  actions: GamificationActionInputPayload[];
  isActive?: boolean;
  priority?: number;
}

export interface UpdateRanksAutomationRuleInput {
  rankId?: string | null;
  name?: string;
  description?: string | null;
  trigger?: RanksRuleTrigger;
  conditionOperator?: string;
  conditions?: GamificationRuleConditionInput[];
  actions?: GamificationActionInputPayload[];
  isActive?: boolean;
  priority?: number;
}

// Leaderboard Rule
export interface LeaderboardAutomationRule extends BaseGamificationRule {
  trigger: LeaderboardRuleTrigger;
  actions: GamificationActionPayload[];
}

export interface CreateLeaderboardAutomationRuleInput {
  name: string;
  description?: string | null;
  trigger: LeaderboardRuleTrigger;
  conditionOperator?: string;
  conditions?: GamificationRuleConditionInput[];
  actions: GamificationActionInputPayload[];
  isActive?: boolean;
  priority?: number;
}

export interface UpdateLeaderboardAutomationRuleInput {
  name?: string;
  description?: string | null;
  trigger?: LeaderboardRuleTrigger;
  conditionOperator?: string;
  conditions?: GamificationRuleConditionInput[];
  actions?: GamificationActionInputPayload[];
  isActive?: boolean;
  priority?: number;
}

// Currency Rule
export interface CurrencyAutomationRule extends BaseGamificationRule {
  trigger: CurrencyRuleTrigger;
  actions: GamificationActionPayload[];
}

export interface CreateCurrencyAutomationRuleInput {
  name: string;
  description?: string | null;
  trigger: CurrencyRuleTrigger;
  conditionOperator?: string;
  conditions?: GamificationRuleConditionInput[];
  actions: GamificationActionInputPayload[];
  isActive?: boolean;
  priority?: number;
}

export interface UpdateCurrencyAutomationRuleInput {
  name?: string;
  description?: string | null;
  trigger?: CurrencyRuleTrigger;
  conditionOperator?: string;
  conditions?: GamificationRuleConditionInput[];
  actions?: GamificationActionInputPayload[];
  isActive?: boolean;
  priority?: number;
}

// Unified UI Rule representation
export interface UnifiedGamificationRule extends BaseGamificationRule {
  module: GamificationModuleType;
  trigger: AnyGamificationTrigger;
  actions: GamificationActionPayload[];
  targetId?: string | null;
  targetName?: string | null;
}

// ==========================================
// 6. GRAPHQL OPERATIONS: 1. POINTS
// ==========================================

export const GET_POINTS_AUTOMATION_RULES = gql`
  query GetPointsAutomationRules($pointRuleId: ID) {
    getPointsAutomationRules(pointRuleId: $pointRuleId) {
      id
      entityId
      pointRuleId
      pointRuleName
      name
      description
      trigger
      conditionOperator
      isActive
      priority
      conditions {
        field
        operator
        value
      }
      actions {
        type
        tier {
          tierId
          tierName
        }
        email {
          templateId
          templateName
          subject
          body
        }
        notification {
          message
          pushTitle
          pushBody
          push
        }
        community {
          communityId
          communityName
        }
        tag {
          tags
        }
        tags
        badge {
          badgeId
          badgeName
        }
        conditionOperator
        conditions {
          field
          operator
          value
        }
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        notificationMessage
        pushTitle
        pushBody
        push
        badgeId
        badgeName
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_POINTS_AUTOMATION_RULE = gql`
  query GetPointsAutomationRule($id: ID!) {
    getPointsAutomationRule(id: $id) {
      id
      entityId
      pointRuleId
      pointRuleName
      name
      description
      trigger
      conditionOperator
      isActive
      priority
      conditions {
        field
        operator
        value
      }
      actions {
        type
        tier {
          tierId
          tierName
        }
        email {
          templateId
          templateName
          subject
          body
        }
        notification {
          message
          pushTitle
          pushBody
          push
        }
        community {
          communityId
          communityName
        }
        tag {
          tags
        }
        tags
        badge {
          badgeId
          badgeName
        }
        conditionOperator
        conditions {
          field
          operator
          value
        }
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        notificationMessage
        pushTitle
        pushBody
        push
        badgeId
        badgeName
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_POINTS_AUTOMATION_RULE = gql`
  mutation CreatePointsAutomationRule($input: CreatePointsAutomationRuleInput!) {
    createPointsAutomationRule(input: $input) {
      id
      name
      isActive
      trigger
    }
  }
`;

export const UPDATE_POINTS_AUTOMATION_RULE = gql`
  mutation UpdatePointsAutomationRule(
    $id: ID!
    $input: UpdatePointsAutomationRuleInput!
  ) {
    updatePointsAutomationRule(id: $id, input: $input) {
      id
      name
      isActive
      trigger
    }
  }
`;

export const DELETE_POINTS_AUTOMATION_RULE = gql`
  mutation DeletePointsAutomationRule($id: ID!) {
    deletePointsAutomationRule(id: $id)
  }
`;

export const TOGGLE_POINTS_AUTOMATION_RULE = gql`
  mutation TogglePointsAutomationRule($id: ID!, $isActive: Boolean!) {
    togglePointsAutomationRule(id: $id, isActive: $isActive) {
      id
      isActive
    }
  }
`;

export const REORDER_POINTS_AUTOMATION_RULES = gql`
  mutation ReorderPointsAutomationRules($ruleIds: [ID!]!) {
    reorderPointsAutomationRules(ruleIds: $ruleIds)
  }
`;

// ==========================================
// 7. GRAPHQL OPERATIONS: 2. BADGES
// ==========================================

export const GET_BADGES_AUTOMATION_RULES = gql`
  query GetBadgesAutomationRules($badgeId: ID) {
    getBadgesAutomationRules(badgeId: $badgeId) {
      id
      entityId
      badgeId
      badgeName
      name
      description
      trigger
      conditionOperator
      isActive
      priority
      conditions {
        field
        operator
        value
      }
      actions {
        type
        tier {
          tierId
          tierName
        }
        email {
          templateId
          templateName
          subject
          body
        }
        notification {
          message
          pushTitle
          pushBody
          push
        }
        community {
          communityId
          communityName
        }
        tag {
          tags
        }
        tags
        points {
          points
        }
        conditionOperator
        conditions {
          field
          operator
          value
        }
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        notificationMessage
        pushTitle
        pushBody
        push
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_BADGES_AUTOMATION_RULE = gql`
  query GetBadgesAutomationRule($id: ID!) {
    getBadgesAutomationRule(id: $id) {
      id
      entityId
      badgeId
      badgeName
      name
      description
      trigger
      conditionOperator
      isActive
      priority
      conditions {
        field
        operator
        value
      }
      actions {
        type
        tier {
          tierId
          tierName
        }
        email {
          templateId
          templateName
          subject
          body
        }
        notification {
          message
          pushTitle
          pushBody
          push
        }
        community {
          communityId
          communityName
        }
        tag {
          tags
        }
        tags
        points {
          points
        }
        conditionOperator
        conditions {
          field
          operator
          value
        }
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        notificationMessage
        pushTitle
        pushBody
        push
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_BADGES_AUTOMATION_RULE = gql`
  mutation CreateBadgesAutomationRule($input: CreateBadgesAutomationRuleInput!) {
    createBadgesAutomationRule(input: $input) {
      id
      name
      isActive
    }
  }
`;

export const UPDATE_BADGES_AUTOMATION_RULE = gql`
  mutation UpdateBadgesAutomationRule(
    $id: ID!
    $input: UpdateBadgesAutomationRuleInput!
  ) {
    updateBadgesAutomationRule(id: $id, input: $input) {
      id
      name
      isActive
    }
  }
`;

export const DELETE_BADGES_AUTOMATION_RULE = gql`
  mutation DeleteBadgesAutomationRule($id: ID!) {
    deleteBadgesAutomationRule(id: $id)
  }
`;

export const TOGGLE_BADGES_AUTOMATION_RULE = gql`
  mutation ToggleBadgesAutomationRule($id: ID!, $isActive: Boolean!) {
    toggleBadgesAutomationRule(id: $id, isActive: $isActive) {
      id
      isActive
    }
  }
`;

export const REORDER_BADGES_AUTOMATION_RULES = gql`
  mutation ReorderBadgesAutomationRules($ruleIds: [ID!]!) {
    reorderBadgesAutomationRules(ruleIds: $ruleIds)
  }
`;

// ==========================================
// 8. GRAPHQL OPERATIONS: 3. RANKS
// ==========================================

export const GET_RANKS_AUTOMATION_RULES = gql`
  query GetRanksAutomationRules($rankId: ID) {
    getRanksAutomationRules(rankId: $rankId) {
      id
      entityId
      rankId
      rankName
      name
      description
      trigger
      conditionOperator
      isActive
      priority
      conditions {
        field
        operator
        value
      }
      actions {
        type
        tier {
          tierId
          tierName
        }
        email {
          templateId
          templateName
          subject
          body
        }
        notification {
          message
          pushTitle
          pushBody
          push
        }
        community {
          communityId
          communityName
        }
        tag {
          tags
        }
        tags
        badge {
          badgeId
          badgeName
        }
        points {
          points
        }
        conditionOperator
        conditions {
          field
          operator
          value
        }
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        notificationMessage
        pushTitle
        pushBody
        push
        badgeId
        badgeName
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_RANKS_AUTOMATION_RULE = gql`
  query GetRanksAutomationRule($id: ID!) {
    getRanksAutomationRule(id: $id) {
      id
      entityId
      rankId
      rankName
      name
      description
      trigger
      conditionOperator
      isActive
      priority
      conditions {
        field
        operator
        value
      }
      actions {
        type
        tier {
          tierId
          tierName
        }
        email {
          templateId
          templateName
          subject
          body
        }
        notification {
          message
          pushTitle
          pushBody
          push
        }
        community {
          communityId
          communityName
        }
        tag {
          tags
        }
        tags
        badge {
          badgeId
          badgeName
        }
        points {
          points
        }
        conditionOperator
        conditions {
          field
          operator
          value
        }
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        notificationMessage
        pushTitle
        pushBody
        push
        badgeId
        badgeName
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_RANKS_AUTOMATION_RULE = gql`
  mutation CreateRanksAutomationRule($input: CreateRanksAutomationRuleInput!) {
    createRanksAutomationRule(input: $input) {
      id
      name
      isActive
    }
  }
`;

export const UPDATE_RANKS_AUTOMATION_RULE = gql`
  mutation UpdateRanksAutomationRule(
    $id: ID!
    $input: UpdateRanksAutomationRuleInput!
  ) {
    updateRanksAutomationRule(id: $id, input: $input) {
      id
      name
      isActive
    }
  }
`;

export const DELETE_RANKS_AUTOMATION_RULE = gql`
  mutation DeleteRanksAutomationRule($id: ID!) {
    deleteRanksAutomationRule(id: $id)
  }
`;

export const TOGGLE_RANKS_AUTOMATION_RULE = gql`
  mutation ToggleRanksAutomationRule($id: ID!, $isActive: Boolean!) {
    toggleRanksAutomationRule(id: $id, isActive: $isActive) {
      id
      isActive
    }
  }
`;

export const REORDER_RANKS_AUTOMATION_RULES = gql`
  mutation ReorderRanksAutomationRules($ruleIds: [ID!]!) {
    reorderRanksAutomationRules(ruleIds: $ruleIds)
  }
`;

// ==========================================
// 9. GRAPHQL OPERATIONS: 4. LEADERBOARD
// ==========================================

export const GET_LEADERBOARD_AUTOMATION_RULES = gql`
  query GetLeaderboardAutomationRules {
    getLeaderboardAutomationRules {
      id
      entityId
      name
      description
      trigger
      conditionOperator
      isActive
      priority
      conditions {
        field
        operator
        value
      }
      actions {
        type
        tier {
          tierId
          tierName
        }
        email {
          templateId
          templateName
          subject
          body
        }
        notification {
          message
          pushTitle
          pushBody
          push
        }
        community {
          communityId
          communityName
        }
        tag {
          tags
        }
        tags
        points {
          points
        }
        badge {
          badgeId
          badgeName
        }
        conditionOperator
        conditions {
          field
          operator
          value
        }
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        notificationMessage
        pushTitle
        pushBody
        push
        badgeId
        badgeName
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_LEADERBOARD_AUTOMATION_RULE = gql`
  query GetLeaderboardAutomationRule($id: ID!) {
    getLeaderboardAutomationRule(id: $id) {
      id
      entityId
      name
      description
      trigger
      conditionOperator
      isActive
      priority
      conditions {
        field
        operator
        value
      }
      actions {
        type
        tier {
          tierId
          tierName
        }
        email {
          templateId
          templateName
          subject
          body
        }
        notification {
          message
          pushTitle
          pushBody
          push
        }
        community {
          communityId
          communityName
        }
        tag {
          tags
        }
        tags
        points {
          points
        }
        badge {
          badgeId
          badgeName
        }
        conditionOperator
        conditions {
          field
          operator
          value
        }
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        notificationMessage
        pushTitle
        pushBody
        push
        badgeId
        badgeName
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_LEADERBOARD_AUTOMATION_RULE = gql`
  mutation CreateLeaderboardAutomationRule(
    $input: CreateLeaderboardAutomationRuleInput!
  ) {
    createLeaderboardAutomationRule(input: $input) {
      id
      name
      isActive
    }
  }
`;

export const UPDATE_LEADERBOARD_AUTOMATION_RULE = gql`
  mutation UpdateLeaderboardAutomationRule(
    $id: ID!
    $input: UpdateLeaderboardAutomationRuleInput!
  ) {
    updateLeaderboardAutomationRule(id: $id, input: $input) {
      id
      name
      isActive
    }
  }
`;

export const DELETE_LEADERBOARD_AUTOMATION_RULE = gql`
  mutation DeleteLeaderboardAutomationRule($id: ID!) {
    deleteLeaderboardAutomationRule(id: $id)
  }
`;

export const TOGGLE_LEADERBOARD_AUTOMATION_RULE = gql`
  mutation ToggleLeaderboardAutomationRule($id: ID!, $isActive: Boolean!) {
    toggleLeaderboardAutomationRule(id: $id, isActive: $isActive) {
      id
      isActive
    }
  }
`;

export const REORDER_LEADERBOARD_AUTOMATION_RULES = gql`
  mutation ReorderLeaderboardAutomationRules($ruleIds: [ID!]!) {
    reorderLeaderboardAutomationRules(ruleIds: $ruleIds)
  }
`;

// ==========================================
// 10. GRAPHQL OPERATIONS: 5. CURRENCY
// ==========================================

export const GET_CURRENCY_AUTOMATION_RULES = gql`
  query GetCurrencyAutomationRules {
    getCurrencyAutomationRules {
      id
      entityId
      name
      description
      trigger
      conditionOperator
      conditions {
        field
        operator
        value
      }
      actions {
        type
        tier {
          tierId
          tierName
        }
        email {
          templateId
          templateName
          subject
          body
        }
        notification {
          message
          pushTitle
          pushBody
          push
        }
        community {
          communityId
          communityName
        }
        tag {
          tags
        }
        tags
        points {
          points
        }
        badge {
          badgeId
          badgeName
        }
        currency {
          amount
          currencyType
        }
        conditionOperator
        conditions {
          field
          operator
          value
        }
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        notificationMessage
        pushTitle
        pushBody
        push
        badgeId
        badgeName
        currencyAmount
        currencyType
      }
      isActive
      priority
      createdAt
      updatedAt
    }
  }
`;

export const GET_CURRENCY_AUTOMATION_RULE = gql`
  query GetCurrencyAutomationRule($id: ID!) {
    getCurrencyAutomationRule(id: $id) {
      id
      entityId
      name
      description
      trigger
      conditionOperator
      conditions {
        field
        operator
        value
      }
      actions {
        type
        tier {
          tierId
          tierName
        }
        email {
          templateId
          templateName
          subject
          body
        }
        notification {
          message
          pushTitle
          pushBody
          push
        }
        community {
          communityId
          communityName
        }
        tag {
          tags
        }
        tags
        points {
          points
        }
        badge {
          badgeId
          badgeName
        }
        currency {
          amount
          currencyType
        }
        conditionOperator
        conditions {
          field
          operator
          value
        }
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        notificationMessage
        pushTitle
        pushBody
        push
        badgeId
        badgeName
        currencyAmount
        currencyType
      }
      isActive
      priority
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CURRENCY_AUTOMATION_RULE = gql`
  mutation CreateCurrencyAutomationRule($input: CreateCurrencyAutomationRuleInput!) {
    createCurrencyAutomationRule(input: $input) {
      id
      name
      isActive
    }
  }
`;

export const UPDATE_CURRENCY_AUTOMATION_RULE = gql`
  mutation UpdateCurrencyAutomationRule(
    $id: ID!
    $input: UpdateCurrencyAutomationRuleInput!
  ) {
    updateCurrencyAutomationRule(id: $id, input: $input) {
      id
      name
      isActive
    }
  }
`;

export const DELETE_CURRENCY_AUTOMATION_RULE = gql`
  mutation DeleteCurrencyAutomationRule($id: ID!) {
    deleteCurrencyAutomationRule(id: $id)
  }
`;

export const TOGGLE_CURRENCY_AUTOMATION_RULE = gql`
  mutation ToggleCurrencyAutomationRule($id: ID!, $isActive: Boolean!) {
    toggleCurrencyAutomationRule(id: $id, isActive: $isActive) {
      id
      isActive
    }
  }
`;

export const REORDER_CURRENCY_AUTOMATION_RULES = gql`
  mutation ReorderCurrencyAutomationRules($ruleIds: [ID!]!) {
    reorderCurrencyAutomationRules(ruleIds: $ruleIds)
  }
`;

// Helper to get human-readable display label for point rules
export function getPointRuleDisplay(pr: any): string {
  if (!pr) return "";
  if (pr.description) return pr.description;
  if (pr.action) {
    const formattedAction = pr.action
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
    return pr.points ? `${formattedAction} (+${pr.points} pts)` : formattedAction;
  }
  if (pr.name) return pr.name;
  return `Point Rule #${pr.id ? pr.id.slice(-4) : ""}`;
}

