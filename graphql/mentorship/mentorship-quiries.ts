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
  featuredArticle?: string;
  greatestAchievement?: string;
  intro?: string;
  introVideo?: string;
  whyDoWantBecomeMentor?: string;
  agreement?: boolean;
  user: MentorUser;
  category: MentorCategory;
  createdAt?: string;
  updatedAt?: string;
  isFeatured?: boolean;
}

export interface PaginationInput {
  limit?: number;
  offset?: number;
}

export interface AllStatusInput extends PaginationInput {
  status?:
    | "APPROVED"
    | "BLOCKED"
    | "PENDING"
    | "REJECTED"
    | "REQUESTED"
    | "ALL";
}

// ---------------------------------------------------------
// PENDING MENTORSHIPS
// ---------------------------------------------------------

export interface GetAllPendingMentorshipsData {
  getAllPendingMentorships: Mentor[];
}

const GET_ALL_PENDING_MENTORSHIPS = gql`
  query GetAllPendingMentorships($input: PaginationInput) {
    getAllPendingMentorships(input: $input) {
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
      user {
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

export function useGetAllPendingMentorships(
  options?: QueryHookOptions<
    GetAllPendingMentorshipsData,
    { input?: PaginationInput }
  >,
) {
  return useQuery<GetAllPendingMentorshipsData, { input?: PaginationInput }>(
    GET_ALL_PENDING_MENTORSHIPS,
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
      user {
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
  query GetAllMentor($input: allStatusInput) {
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
      user {
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

export function useGetAllMentor(
  options?: QueryHookOptions<GetAllMentorData, { input?: AllStatusInput }>,
) {
  return useQuery<GetAllMentorData, { input?: AllStatusInput }>(
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
      user {
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
      user {
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
