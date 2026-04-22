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
// MARK TOP MENTOR
// ---------------------------------------------------------

export interface MarkTopMentorInput {
  mentorshipId: string;
  isTopMentor: boolean;
}

export interface MarkTopMentorResponse {
  markTopMentor: {
    id: string;
    isTopMentor: boolean;
  };
}

export const MARK_TOP_MENTOR = gql`
  mutation MarkTopMentor($input: markTopMentorInput) {
    markTopMentor(input: $input) {
      id
      isTopMentor
    }
  }
`;

export function useMarkTopMentor(
  options?: MutationHookOptions<
    MarkTopMentorResponse,
    { input: MarkTopMentorInput }
  >,
) {
  return useMutation<MarkTopMentorResponse, { input: MarkTopMentorInput }>(
    MARK_TOP_MENTOR,
    options,
  );
}

// ---------------------------------------------------------
// REMOVE MENTOR
// ---------------------------------------------------------

export interface RemoveMentorInput {
  mentorshipId: string;
}

export interface RemoveMentorResponse {
  removeMentor: {
    id: string;
    displayName: string;
  };
}

export const REMOVE_MENTOR = gql`
  mutation RemoveMentor($id: ID!) {
    removeMentor(input: { mentorshipId: $id }) {
      id
      displayName
    }
  }
`;

export function useRemoveMentor(
  options?: MutationHookOptions<
    RemoveMentorResponse,
    { id: string }
  >,
) {
  return useMutation<RemoveMentorResponse, { id: string }>(
    REMOVE_MENTOR,
    options,
  );
}

// ---------------------------------------------------------
// UPDATE MENTOR
// ---------------------------------------------------------

export interface UpdateMentorInput {
  id: string;
  displayName?: string;
  category?: string;
  skills?: string[];
  intro?: string;
  about?: string;
  featuredArticle?: string;
  introVideo?: string;
  whyDoWantBecomeMentor?: string;
  greatestAchievement?: string;
  isFeatured?: boolean;
  isTopMentor?: boolean;
}

export interface UpdateMentorResponse {
  updateMentor: {
    id: string;
    displayName: string;
  };
}

export const UPDATE_MENTOR = gql`
  mutation UpdateMentor($input: UpdateMentorInput!) {
    updateMentor(input: $input) {
      id
      displayName
    }
  }
`;

export function useUpdateMentor(
  options?: MutationHookOptions<UpdateMentorResponse, { input: UpdateMentorInput }>,
) {
  return useMutation<UpdateMentorResponse, { input: UpdateMentorInput }>(
    UPDATE_MENTOR,
    options,
  );
}
