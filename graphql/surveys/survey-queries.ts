import { gql, QueryHookOptions, useQuery } from "@apollo/client";
import { TimeRange } from "../actions";

// ---------------------------------------------------------
// TYPES
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

export interface Survey {
  id: string;
  formId?: string;
  title: string;
  description?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  previewType?: string;
  appearance?: any;
  questions?: Question[];
  fields?: Question[];
}

export interface Pagination {
  totalCount: number;
  limit?: number;
  offset?: number;
}

export interface GetSurveysInput {
  limit?: number | null;
  offset?: number | null;
  search?: string | null;
  status?: string | null;
}

export interface GetSurveysData {
  getSurveys: {
    pagination: Pagination;
    surveys: Survey[];
  };
}

// ---------------------------------------------------------
// GET SINGLE SURVEY
// ---------------------------------------------------------

export interface GetSurveyData {
  getSurvey: Survey;
}

export const GET_SURVEY = gql`
  query GetSurvey($id: ID!) {
    getSurvey(id: $id) {
      id
      appearance
      previewType
      description
      fields {
        id
        formId
        question
        type
        order
        options
        required
        maxLength
        scale
        ratingType
        min
        max
        labels
        allowMultiple
        fieldName
        defaultValue
        allowedTypes
        maxSize
      }
      status
      title
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;
export function useGetSurvey(
  options?: QueryHookOptions<GetSurveyData, { id: string }>,
) {
  return useQuery<GetSurveyData, { id: string }>(GET_SURVEY, options);
}
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

export interface Survey {
  id: string;
  formId?: string;
  title: string;
  description?: string;
  status: string;
  sharedAsFeed?: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  previewType?: string;
  appearance?: any;
  questions?: Question[];
  fields?: Question[];
}

export interface Pagination {
  totalCount: number;
  limit?: number;
  offset?: number;
}

export interface GetSurveysInput {
  limit?: number | null;
  offset?: number | null;
  search?: string | null;
  status?: string | null;
}

export interface GetSurveysData {
  getSurveys: {
    pagination: Pagination;
    surveys: Survey[];
  };
}

// ---------------------------------------------------------
// GET SINGLE SURVEY
// ---------------------------------------------------------

export interface GetSurveyData {
  getSurvey: Survey;
}

// ---------------------------------------------------------
// GET CUSTOM FORM
// ---------------------------------------------------------

export interface GetCustomFormData {
  getCustomForm: Survey;
}

export const GET_CUSTOM_FORM = gql`
  query GetCustomForm($id: ID!) {
    getCustomForm(id: $id) {
      id
      previewType
      appearance
      title
      description
      questions {
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
  }
`;

export function useGetCustomForm(
  options?: QueryHookOptions<GetCustomFormData, { id: string }>,
) {
  return useQuery<GetCustomFormData, { id: string }>(GET_CUSTOM_FORM, options);
}

// ---------------------------------------------------------
// GET SURVEYS
// ---------------------------------------------------------

export const GET_SURVEYS = gql`
  query GetSurveys($input: GetSurveysInput) {
    getSurveys(input: $input) {
      pagination {
        totalCount
        limit
        offset
      }
      surveys {
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
  }
`;

export function useGetSurveys(
  options?: QueryHookOptions<GetSurveysData, { input?: GetSurveysInput }>,
) {
  return useQuery<GetSurveysData, { input?: GetSurveysInput }>(
    GET_SURVEYS,
    options,
  );
}

export const GET_SURVEY_STATS = gql`
  query GetSurveyStats($timeRange: TimeRange!) {
    getSurveyStats(timeRange: $timeRange) {
      totalSurveys
      activeSurveys
      totalResponses
      completionRate
      totalSurveysChange
      activeSurveysChange
      totalResponsesChange
      completionRateChange
      responseTrend {
        date
        count
      }
      statusDistribution {
        status
        count
      }
    }
  }
`;

export interface SurveyStats {
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
  completionRate: number;
  totalSurveysChange: number;
  activeSurveysChange: number;
  totalResponsesChange: number;
  completionRateChange: number;
  responseTrend: {
    date: string;
    count: number;
  }[];
  statusDistribution: {
    status: string;
    count: number;
  }[];
}

export interface GetSurveyStatsResponse {
  getSurveyStats: SurveyStats;
}

export const useGetSurveyStats = (
  timeRange: TimeRange,
  options?: QueryHookOptions<GetSurveyStatsResponse, { timeRange: TimeRange }>,
) =>
  useQuery<GetSurveyStatsResponse, { timeRange: TimeRange }>(GET_SURVEY_STATS, {
    variables: { timeRange },
    ...options,
  });

// ---------------------------------------------------------
// GET SURVEY RESULTS
// ---------------------------------------------------------

export interface ChoiceResult {
  count: number;
  label: string;
  percentage: number;
}

export interface QuestionResult {
  questionId: string;
  question: string;
  type: string;
  totalAnswers: number;
  answers?: string[];
  choices?: ChoiceResult[];
}

export interface SurveyResults {
  surveyId: string;
  totalResponses: number;
  questionResults: QuestionResult[];
}

export interface GetSurveyResultsData {
  getSurveyResults: SurveyResults;
}

export const GET_SURVEY_RESULTS = gql`
  query GetSurveyResults($surveyId: ID!) {
    getSurveyResults(surveyId: $surveyId) {
      surveyId
      totalResponses
      questionResults {
        questionId
        question
        type
        totalAnswers
        answers
        choices {
          label
          count
          percentage
        }
      }
    }
  }
`;

export function useGetSurveyResults(
  options?: QueryHookOptions<GetSurveyResultsData, { surveyId: string }>,
) {
  return useQuery<GetSurveyResultsData, { surveyId: string }>(
    GET_SURVEY_RESULTS,
    options,
  );
}

// ---------------------------------------------------------
// GET SURVEY RESPONSES
// ---------------------------------------------------------

export interface Respondent {
  id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface SurveyResponse {
  id: string;
  formId: string;
  surveyId: string;
  answers: any;
  respondentId: string;
  submittedAt: string;
  respondent?: Respondent;
}

export interface GetSurveyResponsesInput {
  limit?: number | null;
  offset?: number | null;
}

export interface GetSurveyResponsesData {
  getSurveyResponses: {
    pagination: Pagination;
    responses: SurveyResponse[];
  };
}

export const GET_SURVEY_RESPONSES = gql`
  query GetSurveyResponses($surveyId: ID!, $input: GetSurveyResponsesInput) {
    getSurveyResponses(surveyId: $surveyId, input: $input) {
      pagination {
        totalCount
        limit
        offset
      }
      responses {
        id
        formId
        surveyId
        answers
        respondentId
        submittedAt
        respondent {
          firstName
          id
          lastName
          avatar
        }
      }
    }
  }
`;

export function useGetSurveyResponses(
  options?: QueryHookOptions<
    GetSurveyResponsesData,
    { surveyId: string; input?: GetSurveyResponsesInput }
  >,
) {
  return useQuery<
    GetSurveyResponsesData,
    { surveyId: string; input?: GetSurveyResponsesInput }
  >(GET_SURVEY_RESPONSES, options);
}

// ---------------------------------------------------------
// GET SURVEY TEMPLATES
// ---------------------------------------------------------

export interface SurveyTemplate {
  id: string;
  title: string;
  description?: string;
  questions: {
    question: string;
    type: string;
    required: boolean;
    scale?: number;
    ratingType?: string;
    options?: string[];
    labels?: any;
  }[];
}

export interface GetSurveyTemplatesData {
  getSurveyTemplates: SurveyTemplate[];
}

export const GET_SURVEY_TEMPLATES = gql`
  query GetSurveyTemplates {
    getSurveyTemplates {
      id
      title
      description
      questions {
        question
        type
        required
        scale
        ratingType
        options
        labels
      }
    }
  }
`;

export function useGetSurveyTemplates(
  options?: QueryHookOptions<GetSurveyTemplatesData>,
) {
  return useQuery<GetSurveyTemplatesData>(GET_SURVEY_TEMPLATES, options);
}
