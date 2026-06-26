import {
  QueryHookOptions,
  QueryResult,
  useQuery,
  useMutation,
  MutationHookOptions,
} from "@apollo/client";
import {
  ADMIN_GET_OPPORTUNITIES,
  ADMIN_GET_OPPORTUNITY_BY_ID,
  ADMIN_CHANGE_OPPORTUNITY_STATUS,
  ADMIN_DELETE_OPPORTUNITY,
  ADMIN_TOGGLE_OPPORTUNITY_FEATURED,
  GET_ALL_OPPORTUNITIES_GRAPH,
} from "@/graphql/quries/opportunities";

export enum OpportunityStatus {
  ALL = "ALL",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type AdminOpportunity = {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  status: string;
  isActive: boolean;
  isFeatured: boolean;
  coverImage?: string;
  tags?: string[];
  location?: string;
  website?: string;
  budgetRange?: string;
  timeline?: string;
  requirements?: string;
  skills?: string[];
  viewsCount?: number;
  interestedCount?: number;
  savedCount?: number;
  userId?: string;
  entityId?: string;
  createdAt: string;
  updatedAt: string;
};

export type GetAdminOpportunitiesInput = {
  allowOpportunities?: boolean | null;
  category?: string | null;
  isFeatured?: boolean | null;
  pagination?: {
    userId?: string | null;
    page?: number | null;
    offset?: number | null;
    limit?: number | null;
  } | null;
  search?: string | null;
  status?: OpportunityStatus | null;
  subcategory?: string | null;
};

export type AdminGetOpportunitiesResponse = {
  adminGetOpportunities: {
    data: AdminOpportunity[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

export type AdminGetOpportunityByIdResponse = {
  adminGetOpportunityById: AdminOpportunity;
};

export function useAdminOpportunities(
  options?: QueryHookOptions<
    AdminGetOpportunitiesResponse,
    { input?: GetAdminOpportunitiesInput }
  >,
): QueryResult<
  AdminGetOpportunitiesResponse,
  { input?: GetAdminOpportunitiesInput }
> {
  return useQuery(ADMIN_GET_OPPORTUNITIES, options);
}

export function useAdminOpportunityById(
  id: string,
  options?: QueryHookOptions<
    AdminGetOpportunityByIdResponse,
    { id: string }
  >,
): QueryResult<
  AdminGetOpportunityByIdResponse,
  { id: string }
> {
  return useQuery(ADMIN_GET_OPPORTUNITY_BY_ID, {
    variables: { id },
    ...options,
  });
}

export function useAdminChangeOpportunityStatus(options?: MutationHookOptions) {
  return useMutation(ADMIN_CHANGE_OPPORTUNITY_STATUS, {
    ...options,
    refetchQueries: [
      {
        query: ADMIN_GET_OPPORTUNITIES,
        variables: { input: { status: OpportunityStatus.ALL } },
      },
      {
        query: ADMIN_GET_OPPORTUNITIES,
        variables: { input: { status: OpportunityStatus.PENDING } },
      },
      {
        query: ADMIN_GET_OPPORTUNITIES,
        variables: { input: { status: OpportunityStatus.APPROVED } },
      },
    ],
    awaitRefetchQueries: true,
  });
}

export function useAdminDeleteOpportunity(options?: MutationHookOptions) {
  return useMutation(ADMIN_DELETE_OPPORTUNITY, {
    ...options,
    refetchQueries: [
      {
        query: ADMIN_GET_OPPORTUNITIES,
        variables: { input: { status: OpportunityStatus.ALL } },
      },
      {
        query: ADMIN_GET_OPPORTUNITIES,
        variables: { input: { status: OpportunityStatus.PENDING } },
      },
      {
        query: ADMIN_GET_OPPORTUNITIES,
        variables: { input: { status: OpportunityStatus.APPROVED } },
      },
    ],
    awaitRefetchQueries: true,
  });
}

export function useAdminToggleOpportunityFeatured(options?: MutationHookOptions) {
  return useMutation(ADMIN_TOGGLE_OPPORTUNITY_FEATURED, {
    ...options,
  });
}

export type OpportunityGraphOpportunity = {
  id: string;
  title?: string;
  description?: string;
};

export type OpportunityGraphCreator = {
  id: string;
  globalUserId?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  headline?: string;
};

export type OpportunityGraphInterestedUser = {
  id: string;
  globalUserId?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  headline?: string;
};

export type OpportunityGraphSkill = {
  id: string;
  name?: string;
  description?: string;
};

export type OpportunityGraphNode = {
  opportunity: OpportunityGraphOpportunity;
  creator?: OpportunityGraphCreator | null;
  skills?: OpportunityGraphSkill[];
  interestedUsers?: OpportunityGraphInterestedUser[];
};

export type GetAllOpportunitiesGraphResponse = {
  getAllOpportunitiesGraph: OpportunityGraphNode[];
};

export function useGetAllOpportunitiesGraph(
  options?: QueryHookOptions<
    GetAllOpportunitiesGraphResponse,
    { limit?: number }
  >
) {
  return useQuery(GET_ALL_OPPORTUNITIES_GRAPH, options);
}
