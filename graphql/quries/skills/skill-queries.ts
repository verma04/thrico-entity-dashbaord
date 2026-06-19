import { gql, QueryHookOptions, useQuery, useMutation, MutationHookOptions } from "@apollo/client";

// ---------------------------------------------------------
// TYPES
// ---------------------------------------------------------

export interface Skill {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------------------------------------------------------
// GET SKILLS
// ---------------------------------------------------------

export interface GetSkillsData {
  getSkills: Skill[];
}

export interface GetSkillsVars {
  search?: string;
  limit?: number;
  offset?: number;
}

export const GET_SKILLS = gql`
  query GetSkills($search: String, $limit: Int, $offset: Int) {
    getSkills(search: $search, limit: $limit, offset: $offset) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export function useGetSkills(options?: QueryHookOptions<GetSkillsData, GetSkillsVars>) {
  return useQuery<GetSkillsData, GetSkillsVars>(GET_SKILLS, options);
}

// ---------------------------------------------------------
// ADD SKILL
// ---------------------------------------------------------

export interface AddSkillInput {
  title: string;
}

export interface AddSkillResponse {
  addSkill: Skill;
}

export const ADD_SKILL = gql`
  mutation AddSkill($input: AddSkillInput!) {
    addSkill(input: $input) {
      id
      title
      createdAt
    }
  }
`;

export function useAddSkill(
  options?: MutationHookOptions<AddSkillResponse, { input: AddSkillInput }>,
) {
  return useMutation<AddSkillResponse, { input: AddSkillInput }>(
    ADD_SKILL,
    options,
  );
}

// ---------------------------------------------------------
// UPDATE SKILL
// ---------------------------------------------------------

export interface UpdateSkillInput {
  id: string;
  title: string;
}

export interface UpdateSkillResponse {
  updateSkill: Skill;
}

export const UPDATE_SKILL = gql`
  mutation UpdateSkill($input: UpdateSkillInput!) {
    updateSkill(input: $input) {
      id
      title
      updatedAt
    }
  }
`;

export function useUpdateSkill(
  options?: MutationHookOptions<UpdateSkillResponse, { input: UpdateSkillInput }>,
) {
  return useMutation<UpdateSkillResponse, { input: UpdateSkillInput }>(
    UPDATE_SKILL,
    options,
  );
}

// ---------------------------------------------------------
// DELETE SKILL
// ---------------------------------------------------------

export interface DeleteSkillInput {
  id: string;
}

export interface DeleteSkillResponse {
  deleteSkill: Skill;
}

export const DELETE_SKILL = gql`
  mutation DeleteSkill($input: DeleteSkillInput!) {
    deleteSkill(input: $input) {
      id
      title
    }
  }
`;

export function useDeleteSkill(
  options?: MutationHookOptions<DeleteSkillResponse, { input: DeleteSkillInput }>,
) {
  return useMutation<DeleteSkillResponse, { input: DeleteSkillInput }>(
    DELETE_SKILL,
    options,
  );
}

// ---------------------------------------------------------
// BULK ADD SKILLS
// ---------------------------------------------------------

export interface BulkAddSkillInput {
  titles: string[];
}

export interface BulkAddSkillResponse {
  bulkAddSkills: Skill[];
}

export const BULK_ADD_SKILLS = gql`
  mutation BulkAddSkills($input: BulkAddSkillInput!) {
    bulkAddSkills(input: $input) {
      id
      title
    }
  }
`;

export function useBulkAddSkills(
  options?: MutationHookOptions<BulkAddSkillResponse, { input: BulkAddSkillInput }>,
) {
  return useMutation<BulkAddSkillResponse, { input: BulkAddSkillInput }>(
    BULK_ADD_SKILLS,
    options,
  );
}

// ---------------------------------------------------------
// GET USERS BY SKILL
// ---------------------------------------------------------

export interface SkillUser {
  id: string;
  globalUserId: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  headline: string | null;
}

export interface GetUsersBySkillResponse {
  getUsersBySkillNeo4j: {
    data: SkillUser[];
    totalCount: number;
    hasNextPage: boolean;
    cursor: string | null;
  };
}

export interface GetUsersBySkillVars {
  skillId: string;
  limit?: number;
  cursor?: string;
}

export const GET_USERS_BY_SKILL_NEO4J = gql`
  query GetUsersBySkillNeo4j($skillId: ID!, $limit: Int, $cursor: String) {
    getUsersBySkillNeo4j(skillId: $skillId, limit: $limit, cursor: $cursor) {
      data {
        id
        globalUserId
        firstName
        lastName
        avatar
        headline
      }
      totalCount
      hasNextPage
      cursor
    }
  }
`;

export function useGetUsersBySkillNeo4j(
  options?: QueryHookOptions<GetUsersBySkillResponse, GetUsersBySkillVars>,
) {
  return useQuery<GetUsersBySkillResponse, GetUsersBySkillVars>(
    GET_USERS_BY_SKILL_NEO4J,
    options,
  );
}

// ---------------------------------------------------------
// GET USER SKILLS GRAPH
// ---------------------------------------------------------

export interface SkillGraphUser {
  id: string;
  globalUserId: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  headline: string | null;
}

export interface SkillGraphSkill {
  id: string;
  skillId?: string;
  title?: string;
  name?: string;
  category?: string;
  level?: string;
  tags?: string[];
  yearsOfExperience?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSkillEdge {
  user: SkillGraphUser;
  skill: SkillGraphSkill;
}

export interface GetUserSkillsGraphData {
  getUserSkillsGraph: UserSkillEdge[];
}

export interface GetUserSkillsGraphVars {
  limit?: number;
}

export const GET_USER_SKILLS_GRAPH = gql`
  query GetUserSkillsGraph($limit: Int) {
    getUserSkillsGraph(limit: $limit) {
      user {
        id
        globalUserId
        firstName
        lastName
        avatar
        headline
      }
      skill {
        id
        skillId
        title
        name
        category
        level
        tags
        yearsOfExperience
        description
        createdAt
        updatedAt
      }
    }
  }
`;

export function useGetUserSkillsGraph(
  options?: QueryHookOptions<GetUserSkillsGraphData, GetUserSkillsGraphVars>,
) {
  return useQuery<GetUserSkillsGraphData, GetUserSkillsGraphVars>(
    GET_USER_SKILLS_GRAPH,
    options,
  );
}
