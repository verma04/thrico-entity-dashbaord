import { gql, useMutation, MutationHookOptions } from "@apollo/client";
import { GamificationSourceType } from "./gamification-quiries";

// ---------------------------------------------------------
// BADGE MUTATIONS
// ---------------------------------------------------------

export interface BadgeInput {
  source?: GamificationSourceType;
  name: string;
  description?: string;
  icon?: string;
  type: string;
  module?: string;
  action?: string;
  count?: number;
  points?: number;
  allowPushNotification?: boolean;
  allowEmailNotification?: boolean;
  pushNotificationTitle?: string;
  pushNotificationBody?: string;
  emailNotificationSubject?: string;
  emailNotificationBody?: string;
}

export interface BadgeUpdateInput {
  source?: GamificationSourceType;
  name?: string;
  description?: string;
  icon?: string;
  type?: string;
  module?: string;
  action?: string;
  targetValue?: number;
  allowPushNotification?: boolean;
  allowEmailNotification?: boolean;
  pushNotificationTitle?: string;
  pushNotificationBody?: string;
  emailNotificationSubject?: string;
  emailNotificationBody?: string;
  isActive?: boolean;
}

const CREATE_BADGE = gql`
  mutation CreateBadge($input: BadgeInput!) {
    createBadge(input: $input) {
      id
      source
      name
      type
      module
      action
      targetValue
      icon
      description
      condition
      allowPushNotification
      allowEmailNotification
      pushNotificationTitle
      pushNotificationBody
      emailNotificationSubject
      emailNotificationBody
      isActive
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_BADGE = gql`
  mutation UpdateBadge($id: ID!, $input: BadgeUpdateInput!) {
    updateBadge(id: $id, input: $input) {
      id
      source
      name
      type
      module
      action
      targetValue
      icon
      description
      condition
      allowPushNotification
      allowEmailNotification
      pushNotificationTitle
      pushNotificationBody
      emailNotificationSubject
      emailNotificationBody
      isActive
      createdAt
      updatedAt
    }
  }
`;

const DELETE_BADGE = gql`
  mutation DeleteBadge($id: ID!) {
    deleteBadge(id: $id)
  }
`;

const TOGGLE_BADGE = gql`
  mutation ToggleBadge($id: ID!) {
    toggleBadge(id: $id) {
      id
      source
      name
      type
      module
      action
      targetValue
      icon
      description
      condition
      allowPushNotification
      allowEmailNotification
      pushNotificationTitle
      pushNotificationBody
      emailNotificationSubject
      emailNotificationBody
      isActive
      createdAt
      updatedAt
    }
  }
`;

export interface UpdateBadgeNotificationInput {
  allowPushNotification?: boolean;
  pushNotificationTitle?: string;
  pushNotificationBody?: string;
  allowEmailNotification?: boolean;
  emailNotificationSubject?: string;
  emailNotificationBody?: string;
}

const UPDATE_BADGE_NOTIFICATIONS = gql`
  mutation UpdateBadgeNotifications($id: ID!, $input: UpdateBadgeNotificationInput!) {
    updateBadgeNotifications(id: $id, input: $input) {
      id
      source
      name
      type
      module
      action
      targetValue
      icon
      description
      condition
      allowPushNotification
      allowEmailNotification
      pushNotificationTitle
      pushNotificationBody
      emailNotificationSubject
      emailNotificationBody
      isActive
      createdAt
      updatedAt
    }
  }
`;

export function useCreateBadge(options?: MutationHookOptions) {
  return useMutation(CREATE_BADGE, options);
}

export function useUpdateBadge(options?: MutationHookOptions) {
  return useMutation(UPDATE_BADGE, options);
}

export function useUpdateBadgeNotifications(options?: MutationHookOptions) {
  return useMutation(UPDATE_BADGE_NOTIFICATIONS, options);
}

export function useDeleteBadge(options?: MutationHookOptions) {
  return useMutation(DELETE_BADGE, options);
}

export function useToggleBadge(options?: MutationHookOptions) {
  return useMutation(TOGGLE_BADGE, options);
}

// ---------------------------------------------------------
export interface CreatePointRuleInput {
  source?: GamificationSourceType;
  module: string;
  action: string;
  trigger: string;
  points: number;
  dailyCap?: number | null;
  weeklyCap?: number | null;
  monthlyCap?: number | null;
  description?: string | null;
}

export interface UpdatePointRuleInput {
  points?: number;
  dailyCap?: number | null;
  weeklyCap?: number | null;
  monthlyCap?: number | null;
  isActive?: boolean;
  description?: string | null;
}

const CREATE_POINT_RULE = gql`
  mutation CreatePointRule($input: CreatePointRuleInput!) {
    createPointRule(input: $input) {
      id
      module
      action
      trigger
      points
      dailyCap
      weeklyCap
      monthlyCap
      isActive
      description
      allowPushNotification
      allowEmailNotification
      pushNotificationTitle
      pushNotificationBody
      emailNotificationSubject
      emailNotificationBody
    }
  }
`;

const UPDATE_POINT_RULE = gql`
  mutation UpdatePointRule($id: ID!, $input: UpdatePointRuleInput!) {
    updatePointRule(id: $id, input: $input) {
      id
      points
      dailyCap
      weeklyCap
      monthlyCap
      isActive
      description
      allowPushNotification
      allowEmailNotification
      pushNotificationTitle
      pushNotificationBody
      emailNotificationSubject
      emailNotificationBody
    }
  }
`;

const DELETE_POINT_RULE = gql`
  mutation DeletePointRule($id: ID!) {
    deletePointRule(id: $id)
  }
`;

const TOGGLE_POINT_RULE = gql`
  mutation TogglePointRule($id: ID!) {
    togglePointRule(id: $id) {
      id
      module
      action
      trigger
      points
      dailyCap
      weeklyCap
      monthlyCap
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;

export function useCreatePointRule(options?: MutationHookOptions) {
  return useMutation(CREATE_POINT_RULE, options);
}

export function useUpdatePointRule(options?: MutationHookOptions) {
  return useMutation(UPDATE_POINT_RULE, options);
}

export function useDeletePointRule(options?: MutationHookOptions) {
  return useMutation(DELETE_POINT_RULE, options);
}

export function useTogglePointRule(options?: MutationHookOptions) {
  return useMutation(TOGGLE_POINT_RULE, options);
}

// ---------------------------------------------------------
// RANK MUTATIONS
// ---------------------------------------------------------

export interface CreateRankInput {
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: string;
  order: number;
  allowPushNotification?: boolean;
  allowEmailNotification?: boolean;
  pushNotificationTitle?: string;
  pushNotificationBody?: string;
  emailNotificationSubject?: string;
  emailNotificationBody?: string;
}

export interface UpdateRankInput {
  name?: string;
  minPoints?: number;
  maxPoints?: number;
  color?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
  allowPushNotification?: boolean;
  allowEmailNotification?: boolean;
  pushNotificationTitle?: string;
  pushNotificationBody?: string;
  emailNotificationSubject?: string;
  emailNotificationBody?: string;
}

export interface RankOrderInput {
  id: string;
  order: number;
}

const CREATE_RANK = gql`
  mutation CreateRank($input: CreateRankInput!) {
    createRank(input: $input) {
      id
      name
      minPoints
      maxPoints
      color
      icon
      order
      allowPushNotification
      allowEmailNotification
      pushNotificationTitle
      pushNotificationBody
      emailNotificationSubject
      emailNotificationBody
      isActive
    }
  }
`;

const UPDATE_RANK = gql`
  mutation UpdateRank($id: ID!, $input: UpdateRankInput!) {
    updateRank(id: $id, input: $input) {
      id
      name
      minPoints
      maxPoints
      color
      icon
      order
      allowPushNotification
      allowEmailNotification
      pushNotificationTitle
      pushNotificationBody
      emailNotificationSubject
      emailNotificationBody
      isActive
    }
  }
`;

const UPDATE_RANK_ORDER = gql`
  mutation UpdateRankOrder($rankOrders: [RankOrderInput!]!) {
    updateRankOrder(rankOrders: $rankOrders) {
      id
      name
      order
    }
  }
`;

const DELETE_RANK = gql`
  mutation DeleteRank($id: ID!) {
    deleteRank(id: $id)
  }
`;

const TOGGLE_RANK = gql`
  mutation ToggleRank($id: ID!) {
    toggleRank(id: $id) {
      id
      name
      isActive
      updatedAt
    }
  }
`;

export function useCreateRank(options?: MutationHookOptions) {
  return useMutation(CREATE_RANK, options);
}

export function useUpdateRank(options?: MutationHookOptions) {
  return useMutation(UPDATE_RANK, options);
}

export function useUpdateRankOrder(options?: MutationHookOptions) {
  return useMutation(UPDATE_RANK_ORDER, options);
}

export function useDeleteRank(options?: MutationHookOptions) {
  return useMutation(DELETE_RANK, options);
}

export function useToggleRank(options?: MutationHookOptions) {
  return useMutation(TOGGLE_RANK, options);
}
