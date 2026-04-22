import {
  gql,
  QueryHookOptions,
  useQuery,
  useMutation,
  MutationHookOptions,
} from "@apollo/client";

// ---------------------------------------------------------
// TYPES
// ---------------------------------------------------------

export interface MentorUser {
  user: {
    avatar?: string;
    firstName: string;
    lastName: string;
  };
}

export interface MentorCategory {
  id: string;
  title: string;
}

export interface MentorSkill {
  id: string;
  title: string;
}

export interface Mentor {
  id: string;
  isApproved: boolean;
  isRequested: boolean;
  displayName: string;
  slug: string;
  about: string;
  description?: string;
  featuredArticle?: string;
  greatestAchievement?: string;
  intro?: string;
  introVideo?: string;
  whyDoWantBecomeMentor?: string;
  agreement?: boolean;
  mentorUser: MentorUser;
  category: MentorCategory;
  createdAt?: string;
  updatedAt?: string;
  isFeatured?: boolean;
  isTopMentor?: boolean;
  mentorSince?: string;
  skills?: string[];
}

export interface PaginationInput {
  limit?: number;
  offset?: number;
}

export interface GetAllMentorInput {
  status?: string;
  limit?: number;
  offset?: number;
  searchQuery?: string;
  category?: string;
  isTopMentor?: boolean;
  isFeatured?: boolean;
}

// ---------------------------------------------------------
// PENDING MENTORSHIPS
// ---------------------------------------------------------

export interface MentorshipRequestsData {
  mentorshipRequests: Mentor[];
}

const GET_MENTORSHIP_REQUESTS = gql`
  query MentorshipRequests($input: PaginationInput) {
    mentorshipRequests(input: $input) {
      id
      isApproved
      isRequested
      displayName
      slug
      about
      description
      featuredArticle
      greatestAchievement
      intro
      introVideo
      whyDoWantBecomeMentor
      agreement
      mentorUser {
        user {
          avatar
          firstName
          lastName
        }
      }
      category {
        id
        title
      }
      isFeatured
      isTopMentor
      skills
      mentorSince
      createdAt
      updatedAt
    }
  }
`;

export function useMentorshipRequests(
  options?: QueryHookOptions<
    MentorshipRequestsData,
    { input?: PaginationInput }
  >,
) {
  return useQuery<MentorshipRequestsData, { input?: PaginationInput }>(
    GET_MENTORSHIP_REQUESTS,
    options,
  );
}

// ---------------------------------------------------------
// ALL MENTORSHIPS
// ---------------------------------------------------------

export interface GetAllMentorshipsData {
  getAllMentorships: Mentor[];
}

const GET_ALL_MENTORSHIPS = gql`
  query GetAllMentorships($input: PaginationInput) {
    getAllMentorships(input: $input) {
      id
      isApproved
      isRequested
      displayName
      slug
      about
      featuredArticle
      greatestAchievement
      intro
      introVideo
      isFeatured
      whyDoWantBecomeMentor
      agreement
      mentorUser {
        user {
          avatar
          firstName
          lastName
        }
      }
      category {
        id
        title
      }
      createdAt
      updatedAt
    }
  }
`;

export function useGetAllMentorships(
  options?: QueryHookOptions<
    GetAllMentorshipsData,
    { input?: PaginationInput }
  >,
) {
  return useQuery<GetAllMentorshipsData, { input?: PaginationInput }>(
    GET_ALL_MENTORSHIPS,
    options,
  );
}

// ---------------------------------------------------------
// GET ALL MENTOR (WITH STATUS)
// ---------------------------------------------------------

export interface GetAllMentorData {
  getAllMentor: Mentor[];
}

const GET_ALL_MENTOR = gql`
  query GetAllMentor($input: getAllMentorInput) {
    getAllMentor(input: $input) {
      id
      isApproved
      isRequested
      displayName
      slug
      about
      featuredArticle
      greatestAchievement
      intro
      introVideo
      isFeatured
      whyDoWantBecomeMentor
      agreement
      mentorUser {
        user {
          avatar
          firstName
          lastName
        }
      }
      category {
        id
        title
      }
      createdAt
      updatedAt
      isTopMentor
      mentorSince
      skills
    }
  }
`;

export function useGetAllMentor(
  options?: QueryHookOptions<GetAllMentorData, { input?: GetAllMentorInput }>,
) {
  return useQuery<GetAllMentorData, { input?: GetAllMentorInput }>(
    GET_ALL_MENTOR,
    options,
  );
}

// ---------------------------------------------------------
// MENTOR CATEGORIES
// ---------------------------------------------------------

export interface GetMentorCategoriesData {
  getMentorCategories: MentorCategory[];
}

const GET_MENTOR_CATEGORIES = gql`
  query GetMentorCategories {
    getMentorCategories {
      id
      title
    }
  }
`;

export function useGetMentorCategories(
  options?: QueryHookOptions<GetMentorCategoriesData>,
) {
  return useQuery<GetMentorCategoriesData>(GET_MENTOR_CATEGORIES, options);
}

// ---------------------------------------------------------
// SINGLE MENTOR
// ---------------------------------------------------------

export interface GetMentorData {
  getMentor: Mentor;
}

const GET_MENTOR = gql`
  query GetMentor($id: ID!) {
    getMentor(id: $id) {
      id
      isApproved
      isRequested
      displayName
      slug
      about
      featuredArticle
      greatestAchievement
      intro
      introVideo
      whyDoWantBecomeMentor
      agreement
      mentorUser {
        user {
          avatar
          firstName
          lastName
        }
      }
      category {
        id
        title
      }
      createdAt
      updatedAt
    }
  }
`;

export function useGetMentor(
  options?: QueryHookOptions<GetMentorData, { id: string }>,
) {
  return useQuery<GetMentorData, { id: string }>(GET_MENTOR, options);
}

// ---------------------------------------------------------
// MENTORSHIP STATS
// ---------------------------------------------------------

export interface MentorshipStats {
  totalMentors: number;
  approvedMentors: number;
  pendingMentors: number;
  rejectedMentors: number;
  totalCategories: number;
}

export interface GetMentorshipStatsData {
  getMentorshipStats: MentorshipStats;
}

const GET_MENTORSHIP_STATS = gql`
  query GetMentorshipStats {
    getMentorshipStats {
      totalMentors
      approvedMentors
      pendingMentors
      rejectedMentors
      totalCategories
    }
  }
`;

export function useGetMentorshipStats(
  options?: QueryHookOptions<GetMentorshipStatsData>,
) {
  return useQuery<GetMentorshipStatsData>(GET_MENTORSHIP_STATS, options);
}

// ---------------------------------------------------------
// MENTOR SKILLS
// ---------------------------------------------------------

export interface GetMentorSkillsData {
  getMentorSkills: MentorSkill[];
}

const GET_MENTOR_SKILLS = gql`
  query GetMentorSkills {
    getMentorSkills {
      id
      title
    }
  }
`;

export function useGetMentorSkills(
  options?: QueryHookOptions<GetMentorSkillsData>,
) {
  return useQuery<GetMentorSkillsData>(GET_MENTOR_SKILLS, options);
}

// ---------------------------------------------------------
// UPDATE MENTORSHIPS STATUS
// ---------------------------------------------------------

export interface UpdateMentorshipStatusInput {
  mentorshipId: string;
  status: "APPROVED" | "BLOCKED" | "PENDING" | "REJECTED" | "REQUESTED";
  reason?: string;
}

export interface UpdateMentorshipStatusData {
  updateMentorshipStatus: Mentor;
}

const UPDATE_MENTORSHIP_STATUS = gql`
  mutation UpdateMentorshipStatus($input: updateMentorshipStatusInput) {
    updateMentorshipStatus(input: $input) {
      id
      isApproved
      isRequested
      displayName
      slug
      about
      featuredArticle
      greatestAchievement
      intro
      introVideo
      whyDoWantBecomeMentor
      agreement
      mentorUser {
        user {
          avatar
          firstName
          lastName
        }
      }
      category {
        id
        title
      }
      createdAt
      updatedAt
    }
  }
`;

export function useUpdateMentorshipStatus(
  options?: MutationHookOptions<
    UpdateMentorshipStatusData,
    { input: UpdateMentorshipStatusInput }
  >,
) {
  return useMutation<
    UpdateMentorshipStatusData,
    { input: UpdateMentorshipStatusInput }
  >(UPDATE_MENTORSHIP_STATUS, options);
}

// ---------------------------------------------------------
// GET MENTOR BY ID
// ---------------------------------------------------------

export interface GetMentorByIdData {
  getMentorById: Mentor;
}

const GET_MENTOR_BY_ID = gql`
  query GetMentorById($id: ID!) {
    getMentorById(id: $id) {
      id
      isApproved
      isRequested
      displayName
      slug
      about
      description
      featuredArticle
      greatestAchievement
      intro
      introVideo
      whyDoWantBecomeMentor
      agreement
      mentorUser {
        user {
          avatar
          firstName
          lastName
        }
      }
      category {
        id
        title
      }
      isFeatured
      isTopMentor
      skills
      mentorSince
      createdAt
      updatedAt
    }
  }
`;

export function useGetMentorById(
  options?: QueryHookOptions<GetMentorByIdData, { id: string }>,
) {
  return useQuery<GetMentorByIdData, { id: string }>(GET_MENTOR_BY_ID, options);
}

// ---------------------------------------------------------
// AUDIT LOGS
// ---------------------------------------------------------

export interface MentorshipAuditLog {
  action: string;
  admin: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  targetUser: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface MentorshipAuditLogsData {
  mentorshipAuditLogs: {
    data: MentorshipAuditLog[];
    meta: {
      totalItems: number;
    };
  };
}

export const GET_MENTORSHIP_AUDIT_LOGS = gql`
  query MentorshipAuditLogs($pagination: PaginationInput) {
    mentorshipAuditLogs(pagination: $pagination) {
      data {
        action
        admin {
          firstName
          lastName
          avatar
        }
        targetUser {
          firstName
          lastName
          avatar
        }
        createdAt
      }
      meta {
        totalItems
      }
    }
  }
`;

export function useMentorshipAuditLogs(
  options?: QueryHookOptions<
    MentorshipAuditLogsData,
    { pagination?: PaginationInput }
  >,
) {
  return useQuery<MentorshipAuditLogsData, { pagination?: PaginationInput }>(
    GET_MENTORSHIP_AUDIT_LOGS,
    options,
  );
}
