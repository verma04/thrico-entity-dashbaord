import { gql, useMutation, MutationHookOptions } from "@apollo/client";
import { GET_SURVEYS } from "./survey-queries";
export type MemberEligibility =
  | "ALL"
  | "VERIFIED"
  | "TIERS"
  | "COMMUNITY"
  | "SPECIFIC_CUSTOMERS"
  | "OUTSIDE_PLATFORM";

export type SurveyStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | string;

// ---------------------------------------------------------
// TYPES
// ---------------------------------------------------------

export interface SurveyEligibilityInput {
  memberEligibility?: MemberEligibility;
  membershipTierId?: string[];
  eligibleTierIds?: string[];
  eligibleUserIds?: string[];
  eligibleSegmentIds?: string[];
  eligibleCommunityIds?: string[];
  communityIds?: string[];
  acceptAnonymousResponse?: boolean;
}

export interface SurveyEligibilityRule {
  id: string;
  memberEligibility: MemberEligibility;
  membershipTierId?: string[];
  eligibleTierIds?: string[];
  eligibleUserIds?: string[];
  eligibleSegmentIds?: string[];
  eligibleCommunityIds?: string[];
  communityIds?: string[];
  acceptAnonymousResponse?: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface Survey {
  id: string;
  formId?: string;
  title: string;
  description?: string | null;
  status: SurveyStatus;
  slug?: string | null;
  shortCode?: string | null;
  shortUrl?: string | null;
  shareUrl?: string | null;
  shareLink?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  form?: any;
  sharedAsFeed?: boolean;
  addedBy?: string | null;
  communityId?: string | null;
  communityIds?: string[] | null;
  memberEligibility?: MemberEligibility;
  acceptAnonymousResponse?: boolean;
  eligibilityRuleId?: string | null;
  eligibility?: SurveyEligibilityRule;
  eligibilityRule?: SurveyEligibilityRule;
  responses?: any[];
  createdAt?: string;
  updatedAt?: string | null;
  previewType?: string;
  appearance?: any;
  questions?: Question[];
  fields?: Question[];
}

export interface AddSurveyInput {
  title: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  addedBy?: string | null;
  communityId?: string | null;
  communityIds?: string[] | null;
  slug?: string | null;
  shortCode?: string | null;
  shortUrl?: string | null;
  memberEligibility?: MemberEligibility;
  acceptAnonymousResponse?: boolean;
  eligibilityRuleId?: string | null;
  eligibility?: SurveyEligibilityInput;
  status?: string;
  previewType?: string;
  appearance?: any;
  fields?: any[];
}

// ---------------------------------------------------------
// ADD SURVEY
// ---------------------------------------------------------

export interface AddSurveyData {
  addSurvey: Survey;
}

const ADD_SURVEY = gql`
  mutation AddSurvey($input: AddSurveyInput!) {
    addSurvey(input: $input) {
      id
      formId
      title
      description
      status
      slug
      shortCode
      shortUrl
      shareUrl
      shareLink
      startDate
      endDate
      sharedAsFeed
      addedBy
      communityId
      communityIds
      eligibilityRuleId
      eligibilityRule {
        id
        memberEligibility
        membershipTierId
        eligibleTierIds
        eligibleUserIds
        eligibleSegmentIds
        eligibleCommunityIds
        communityIds
        acceptAnonymousResponse
        createdAt
        updatedAt
      }
      eligibility {
        id
        memberEligibility
        membershipTierId
        eligibleTierIds
        eligibleUserIds
        eligibleSegmentIds
        eligibleCommunityIds
        communityIds
        acceptAnonymousResponse
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export function useAddSurvey(
  options?: MutationHookOptions<AddSurveyData, { input: AddSurveyInput }>,
) {
  return useMutation<AddSurveyData, { input: AddSurveyInput }>(ADD_SURVEY, {
    ...options,
    refetchQueries: options?.refetchQueries || ["GetSurveys"],
    awaitRefetchQueries: true,
  });
}

// ---------------------------------------------------------
// UPDATE SURVEY
// ---------------------------------------------------------

export interface EditSurveyInput {
  title?: string | null;
  description?: string | null;
  status?: SurveyStatus | null;
  startDate?: string | null;
  endDate?: string | null;
  addedBy?: string | null;
  communityId?: string | null;
  communityIds?: string[] | null;
  slug?: string | null;
  shortCode?: string | null;
  shortUrl?: string | null;
  memberEligibility?: MemberEligibility | null;
  acceptAnonymousResponse?: boolean | null;
  eligibilityRuleId?: string | null;
  eligibility?: SurveyEligibilityInput | null;
}

export interface EditSurveyData {
  editSurvey: Survey;
}

const EDIT_SURVEY = gql`
  mutation EditSurvey($id: ID!, $input: EditSurveyInput!) {
    editSurvey(id: $id, input: $input) {
      id
      formId
      title
      description
      status
      slug
      shortCode
      shortUrl
      shareUrl
      shareLink
      startDate
      endDate
      sharedAsFeed
      addedBy
      communityId
      communityIds
      eligibilityRuleId
      eligibilityRule {
        id
        memberEligibility
        membershipTierId
        eligibleTierIds
        eligibleUserIds
        eligibleSegmentIds
        eligibleCommunityIds
        communityIds
        acceptAnonymousResponse
        createdAt
        updatedAt
      }
      eligibility {
        id
        memberEligibility
        membershipTierId
        eligibleTierIds
        eligibleUserIds
        eligibleSegmentIds
        eligibleCommunityIds
        communityIds
        acceptAnonymousResponse
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export function useEditSurvey(
  options?: MutationHookOptions<
    EditSurveyData,
    { id: string; input: EditSurveyInput }
  >,
) {
  return useMutation<EditSurveyData, { id: string; input: EditSurveyInput }>(
    EDIT_SURVEY,
    {
      ...options,
      refetchQueries: options?.refetchQueries || ["GetSurveys"],
      awaitRefetchQueries: true,
    },
  );
}

// ---------------------------------------------------------
// DELETE SURVEY
// ---------------------------------------------------------

export interface DeleteSurveyData {
  deleteSurvey: {
    id: string;
    deleted: boolean;
  };
}

const DELETE_SURVEY = gql`
  mutation DeleteSurvey($id: ID!) {
    deleteSurvey(id: $id) {
      id
      deleted
    }
  }
`;

export function useDeleteSurvey(
  options?: MutationHookOptions<DeleteSurveyData, { id: string }>,
) {
  return useMutation<DeleteSurveyData, { id: string }>(DELETE_SURVEY, {
    ...options,
    refetchQueries: options?.refetchQueries || ["GetSurveys"],
    awaitRefetchQueries: true,
  });
}

// ---------------------------------------------------------
// PUBLISH SURVEY
// ---------------------------------------------------------

export interface PublishSurveyData {
  publishSurvey: Survey;
}

const PUBLISH_SURVEY = gql`
  mutation PublishSurvey($publishSurveyId: ID!) {
    publishSurvey(id: $publishSurveyId) {
      id
      formId
      title
      description
      status
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export function usePublishSurvey(
  options?: MutationHookOptions<PublishSurveyData, { publishSurveyId: string }>,
) {
  return useMutation<PublishSurveyData, { publishSurveyId: string }>(
    PUBLISH_SURVEY,
    {
      ...options,
      refetchQueries: options?.refetchQueries || ["GetSurveys"],
      awaitRefetchQueries: true,
    },
  );
}

// ---------------------------------------------------------
// DRAFT SURVEY
// ---------------------------------------------------------

export interface DraftSurveyData {
  draftSurvey: Survey;
}

const DRAFT_SURVEY = gql`
  mutation DraftSurvey($draftSurveyId: ID!) {
    draftSurvey(id: $draftSurveyId) {
      id
      formId
      title
      description
      status
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export function useDraftSurvey(
  options?: MutationHookOptions<DraftSurveyData, { draftSurveyId: string }>,
) {
  return useMutation<DraftSurveyData, { draftSurveyId: string }>(DRAFT_SURVEY, {
    ...options,
    refetchQueries: options?.refetchQueries || ["GetSurveys"],
    awaitRefetchQueries: true,
  });
}

// ---------------------------------------------------------
// QUESTIONS
// ---------------------------------------------------------

export interface Question {
  id: string;
  formId: string;
  type: string;
  question: string;
  description?: string;
  order: number;
  required: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  scale?: number;
  ratingType?: string;
  options?: string[];
  labels?: any;
  allowMultiple?: boolean;
  legalText?: string;
}

export interface AddQuestionInput {
  formId: string;
  type: string;
  question: string;
  description?: string;
  order: number;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  scale?: number;
  ratingType?: string;
  options?: string[];
  labels?: any;
  allowMultiple?: boolean;
  legalText?: string;
}

export interface AddQuestionData {
  addQuestion: Question;
}

const ADD_QUESTION = gql`
  mutation AddQuestion($input: AddQuestionInput!) {
    addQuestion(input: $input) {
      id
      formId
      type
      question
      description
      order
      required
      maxLength
      min
      max
      scale
      ratingType
      options
      labels
      allowMultiple
      legalText
    }
  }
`;

export function useAddQuestion(
  options?: MutationHookOptions<AddQuestionData, { input: AddQuestionInput }>,
) {
  return useMutation<AddQuestionData, { input: AddQuestionInput }>(
    ADD_QUESTION,
    {
      ...options,
    },
  );
}

export interface EditQuestionInput {
  type?: string;
  question?: string;
  description?: string;
  order?: number;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  scale?: number;
  ratingType?: string;
  options?: string[];
  labels?: any;
  allowMultiple?: boolean;
  legalText?: string;
}

export interface EditQuestionData {
  editQuestion: Question;
}

const EDIT_QUESTION = gql`
  mutation EditQuestion($id: ID!, $input: EditQuestionInput!) {
    editQuestion(id: $id, input: $input) {
      id
      formId
      type
      question
      description
      order
      required
      maxLength
      min
      max
      scale
      ratingType
      options
      labels
      allowMultiple
      legalText
    }
  }
`;

export function useEditQuestion(
  options?: MutationHookOptions<
    EditQuestionData,
    { id: string; input: EditQuestionInput }
  >,
) {
  return useMutation<
    EditQuestionData,
    { id: string; input: EditQuestionInput }
  >(EDIT_QUESTION, {
    ...options,
  });
}

export interface DeleteQuestionData {
  deleteQuestion: {
    id: string;
    deleted: boolean;
  };
}

const DELETE_QUESTION = gql`
  mutation DeleteQuestion($id: ID!) {
    deleteQuestion(id: $id) {
      id
      deleted
    }
  }
`;

export function useDeleteQuestion(
  options?: MutationHookOptions<DeleteQuestionData, { id: string }>,
) {
  return useMutation<DeleteQuestionData, { id: string }>(DELETE_QUESTION, {
    ...options,
  });
}

export interface ReorderQuestionInput {
  id: string;
  order: number;
}

export interface ReorderQuestionsData {
  reorderQuestions: Question[];
}

const REORDER_QUESTIONS = gql`
  mutation ReorderQuestions($input: [ReorderQuestionInput!]!) {
    reorderQuestions(input: $input) {
      id
      formId
      type
      question
      description
      order
      required
      maxLength
      min
      max
      scale
      ratingType
      options
      labels
      allowMultiple
      legalText
    }
  }
`;

export function useReorderQuestions(
  options?: MutationHookOptions<
    ReorderQuestionsData,
    { input: ReorderQuestionInput[] }
  >,
) {
  return useMutation<ReorderQuestionsData, { input: ReorderQuestionInput[] }>(
    REORDER_QUESTIONS,
    {
      ...options,
    },
  );
}

// ---------------------------------------------------------
// UPDATE FORM SETTINGS
// ---------------------------------------------------------

export interface UpdateFormSettingsInput {
  // Specific settings
  previewType?: string;
  appearance?: any; // JSON object
}

export interface UpdateFormSettingsData {
  updateFormSettings: {
    id: string;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    title?: string;
    endDate?: string;
    description?: string;

    userId?: string;
    previewType?: string;
    appearance?: any;
  };
}

const UPDATE_FORM_SETTINGS = gql`
  mutation UpdateFormSettings(
    $updateFormSettingsId: ID!
    $input: UpdateFormSettingsInput!
  ) {
    updateFormSettings(id: $updateFormSettingsId, input: $input) {
      id
      createdAt
      updatedAt
      status
      title
      endDate
      description
      addedBy
      userId
      previewType
      appearance
    }
  }
`;

export function useUpdateFormSettings(
  options?: MutationHookOptions<
    UpdateFormSettingsData,
    { updateFormSettingsId: string; input: UpdateFormSettingsInput }
  >,
) {
  return useMutation<
    UpdateFormSettingsData,
    { updateFormSettingsId: string; input: UpdateFormSettingsInput }
  >(UPDATE_FORM_SETTINGS, {
    ...options,
  });
}

// ---------------------------------------------------------
// CREATE SURVEY FROM TEMPLATE
// ---------------------------------------------------------

export interface CreateSurveyFromTemplateData {
  createSurveyFromTemplate: Survey;
}

const CREATE_SURVEY_FROM_TEMPLATE = gql`
  mutation CreateSurveyFromTemplate($templateId: String!) {
    createSurveyFromTemplate(templateId: $templateId) {
      id
      formId
      title
      description
      status
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export function useCreateSurveyFromTemplate(
  options?: MutationHookOptions<
    CreateSurveyFromTemplateData,
    { templateId: string }
  >,
) {
  return useMutation<CreateSurveyFromTemplateData, { templateId: string }>(
    CREATE_SURVEY_FROM_TEMPLATE,
    {
      refetchQueries: options?.refetchQueries || ["GetSurveys"],
      awaitRefetchQueries: true,
      ...options,
    },
  );
}

// ---------------------------------------------------------
// SHARE SURVEY AS FEED
// ---------------------------------------------------------

export interface ShareSurveyAsFeedInput {
  surveyId: string;
  shouldShare: boolean;
  description?: string;
}

export interface ShareSurveyAsFeedData {
  shareSurveyAsFeed: Survey;
}

const SHARE_SURVEY_AS_FEED = gql`
  mutation ShareSurveyAsFeed(
    $surveyId: ID!
    $shouldShare: Boolean!
    $description: String
  ) {
    shareSurveyAsFeed(
      surveyId: $surveyId
      shouldShare: $shouldShare
      description: $description
    ) {
      id
      formId
      title
      description
      status
      startDate
      endDate
      createdAt
      updatedAt
      sharedAsFeed
    }
  }
`;

export function useShareSurveyAsFeed(
  options?: MutationHookOptions<ShareSurveyAsFeedData, ShareSurveyAsFeedInput>,
) {
  return useMutation<ShareSurveyAsFeedData, ShareSurveyAsFeedInput>(
    SHARE_SURVEY_AS_FEED,
    {
      ...options,
    },
  );
}

// ---------------------------------------------------------
// EXPORT SURVEY RESPONSES
// ---------------------------------------------------------

export interface ExportSurveyResponsesData {
  exportSurveyResponses: {
    success: boolean;
    message: string;
    totalCount?: number;
    fileUrl?: string;
  };
}

const EXPORT_SURVEY_RESPONSES = gql`
  mutation ExportSurveyResponses($surveyId: ID!, $format: String) {
    exportSurveyResponses(surveyId: $surveyId, format: $format) {
      success
      message
      totalCount
      fileUrl
    }
  }
`;

export function useExportSurveyResponses(
  options?: MutationHookOptions<
    ExportSurveyResponsesData,
    { surveyId: string; format?: string }
  >,
) {
  return useMutation<
    ExportSurveyResponsesData,
    { surveyId: string; format?: string }
  >(EXPORT_SURVEY_RESPONSES, {
    ...options,
  });
}
