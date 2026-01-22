import { gql, useMutation, MutationHookOptions } from "@apollo/client";

// ---------------------------------------------------------
// TYPES
// ---------------------------------------------------------

export interface MentorshipCategory {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorshipSkill {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------
// CATEGORY MUTATIONS
// ---------------------------------------------------------

export interface AddMentorshipCategoryInput {
  title: string;
}

export interface AddMentorshipCategoryResponse {
  addMentorShipCategory: MentorshipCategory;
}

export const ADD_MENTORSHIP_CATEGORY = gql`
  mutation AddMentorShipCategory($input: inputMentorShipCategory) {
    addMentorShipCategory(input: $input) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export function useAddMentorshipCategory(
  options?: MutationHookOptions<
    AddMentorshipCategoryResponse,
    { input: AddMentorshipCategoryInput }
  >,
) {
  return useMutation<
    AddMentorshipCategoryResponse,
    { input: AddMentorshipCategoryInput }
  >(ADD_MENTORSHIP_CATEGORY, options);
}

export interface DeleteMentorshipCategoryInput {
  id: string;
}

export interface DeleteMentorshipCategoryResponse {
  deleteMentorShipCategory: MentorshipCategory;
}

export const DELETE_MENTORSHIP_CATEGORY = gql`
  mutation DeleteMentorShipCategory($input: inputMentorShipCategoryId) {
    deleteMentorShipCategory(input: $input) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export function useDeleteMentorshipCategory(
  options?: MutationHookOptions<
    DeleteMentorshipCategoryResponse,
    { input: DeleteMentorshipCategoryInput }
  >,
) {
  return useMutation<
    DeleteMentorshipCategoryResponse,
    { input: DeleteMentorshipCategoryInput }
  >(DELETE_MENTORSHIP_CATEGORY, options);
}

export interface UpdateMentorshipCategoryInput {
  id: string;
  title: string;
}

export interface UpdateMentorshipCategoryResponse {
  updateMentorShipCategory: MentorshipCategory;
}

export const UPDATE_MENTORSHIP_CATEGORY = gql`
  mutation UpdateMentorShipCategory($input: updateMentorShipCategoryInput) {
    updateMentorShipCategory(input: $input) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export function useUpdateMentorshipCategory(
  options?: MutationHookOptions<
    UpdateMentorshipCategoryResponse,
    { input: UpdateMentorshipCategoryInput }
  >,
) {
  return useMutation<
    UpdateMentorshipCategoryResponse,
    { input: UpdateMentorshipCategoryInput }
  >(UPDATE_MENTORSHIP_CATEGORY, options);
}

// ---------------------------------------------------------
// SKILL MUTATIONS
// ---------------------------------------------------------

export interface AddMentorshipSkillsInput {
  title: string;
}

export interface AddMentorshipSkillsResponse {
  addMentorShipSkills: MentorshipSkill;
}

export const ADD_MENTORSHIP_SKILLS = gql`
  mutation AddMentorShipSkills($input: inputMentorShipSkills) {
    addMentorShipSkills(input: $input) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export function useAddMentorshipSkills(
  options?: MutationHookOptions<
    AddMentorshipSkillsResponse,
    { input: AddMentorshipSkillsInput }
  >,
) {
  return useMutation<
    AddMentorshipSkillsResponse,
    { input: AddMentorshipSkillsInput }
  >(ADD_MENTORSHIP_SKILLS, options);
}

export interface UpdateMentorshipSkillsInput {
  id: string;
  title: string;
}

export interface UpdateMentorshipSkillsResponse {
  updateMentorShipSkills: MentorshipSkill;
}

export const UPDATE_MENTORSHIP_SKILLS = gql`
  mutation UpdateMentorShipSkills($input: updateMentorShipSkillsInput) {
    updateMentorShipSkills(input: $input) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export function useUpdateMentorshipSkills(
  options?: MutationHookOptions<
    UpdateMentorshipSkillsResponse,
    { input: UpdateMentorshipSkillsInput }
  >,
) {
  return useMutation<
    UpdateMentorshipSkillsResponse,
    { input: UpdateMentorshipSkillsInput }
  >(UPDATE_MENTORSHIP_SKILLS, options);
}

export interface DeleteMentorshipSkillsInput {
  id: string;
}

export interface DeleteMentorshipSkillsResponse {
  deleteMentorShipSkills: MentorshipSkill;
}

export const DELETE_MENTORSHIP_SKILLS = gql`
  mutation DeleteMentorShipSkills($input: inputMentorShipSkillsId) {
    deleteMentorShipSkills(input: $input) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export function useDeleteMentorshipSkills(
  options?: MutationHookOptions<
    DeleteMentorshipSkillsResponse,
    { input: DeleteMentorshipSkillsInput }
  >,
) {
  return useMutation<
    DeleteMentorshipSkillsResponse,
    { input: DeleteMentorshipSkillsInput }
  >(DELETE_MENTORSHIP_SKILLS, options);
}

// ---------------------------------------------------------
// FEATURE MENTOR
// ---------------------------------------------------------

export interface FeatureMentorInput {
  mentorshipId: string;
  isFeatured: boolean;
}

export interface FeatureMentorResponse {
  featureMentor: {
    id: string;
    isFeatured: boolean;
  };
}

export const FEATURE_MENTOR = gql`
  mutation FeatureMentor($input: featureMentorInput) {
    featureMentor(input: $input) {
      id
      isFeatured
    }
  }
`;

export function useFeatureMentor(
  options?: MutationHookOptions<
    FeatureMentorResponse,
    { input: FeatureMentorInput }
  >,
) {
  return useMutation<FeatureMentorResponse, { input: FeatureMentorInput }>(
    FEATURE_MENTOR,
    options,
  );
}
