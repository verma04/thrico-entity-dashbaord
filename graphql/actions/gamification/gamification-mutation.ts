import { gql, useMutation, MutationHookOptions } from "@apollo/client";

// ---------------------------------------------------------
// BADGE MUTATIONS
// ---------------------------------------------------------

export interface BadgeInput {
  name: string;
  description: string;
  icon: string;
  type: string;
  module: string;
  action: string;
  targetValue: number;
  isActive?: boolean;
}

export interface BadgeUpdateInput {
  name?: string;
  description?: string;
  icon?: string;
  type?: string;
  module?: string;
  action?: string;
  targetValue?: number;
  isActive?: boolean;
}

const CREATE_BADGE = gql`
  mutation CreateBadge($input: BadgeInput!) {
    createBadge(input: $input) {
      id
      name
      type
      module
      action
      targetValue
      icon
      description
      condition
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
      name
      type
      module
      action
      targetValue
      icon
      description
      condition
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
      name
      type
      module
      action
      targetValue
      icon
      description
      condition
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

export function useDeleteBadge(options?: MutationHookOptions) {
  return useMutation(DELETE_BADGE, options);
}

export function useToggleBadge(options?: MutationHookOptions) {
  return useMutation(TOGGLE_BADGE, options);
}

// ---------------------------------------------------------
// POINT RULE MUTATIONS
// ---------------------------------------------------------

export interface CreatePointRuleInput {
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
}

export interface UpdateRankInput {
  name?: string;
  minPoints?: number;
  maxPoints?: number;
  color?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
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
