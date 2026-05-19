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

export const GET_SKILLS = gql`
  query GetSkills {
    getSkills {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export function useGetSkills(options?: QueryHookOptions<GetSkillsData>) {
  return useQuery<GetSkillsData>(GET_SKILLS, options);
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
