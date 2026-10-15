import { gql } from "@apollo/client";

export const GET_ALL_MOMENTS = gql`
  query GetAllMoments($pagination: PaginationInput, $sortBy: String, $sortOrder: String) {
    getAllMoments(pagination: $pagination, sortBy: $sortBy, sortOrder: $sortOrder) {
      data {
        id
        caption
        videoUrl
        thumbnailUrl
        status
        totalViews
        createdAt
        addedBy
        owner {
          id
          firstName
          lastName
          avatar
        }
      }
      meta {
        currentPage
        totalPages
        totalItems
        hasNextPage
      }
    }
  }
`;

export const GET_MOMENT_DETAILS = gql`
  query GetMomentDetails($input: inputId!) {
    getMomentDetailsById(input: $input) {
      id
      caption
      videoUrl
      status
      totalViews
      totalReactions
      detectedCategory
      extractedKeywords
      sentimentScore
      owner {
        id
        firstName
        lastName
        avatar
      }
    }
  }
`;
export const GET_MOMENT_DASHBOARD_KPIs = gql`
  query GetMomentDashboardKPIs($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getMomentAnalytics(timeRange: $timeRange, dateRange: $dateRange) {
      totalMoments
      totalViews
      totalWatchTime
      totalReactions
      totalComments
      activeCreators
      growth {
        date
        count
      }
      engagement {
        name
        value
      }
    }
  }
`;

export const ADMIN_DELETE_MOMENT = gql`
  mutation AdminDeleteMoment($adminDeleteMomentId: ID!) {
    adminDeleteMoment(id: $adminDeleteMomentId)
  }
`;

export const ADMIN_GENERATE_MOMENT_UPLOAD_URL = gql`
  mutation AdminGenerateMomentUploadUrl($input: AdminGenerateMomentUploadInput!) {
    adminGenerateMomentUploadUrl(input: $input) {
      momentId
      videoUploadUrl
      videoFileUrl
      thumbnailUploadUrl
      thumbnailFileUrl
      expiresIn
    }
  }
`;

export const ADMIN_CONFIRM_MOMENT_UPLOAD = gql`
  mutation AdminConfirmMomentUpload($input: AdminConfirmMomentUploadInput!) {
    adminConfirmMomentUpload(input: $input) {
      id
      caption
      videoUrl
      thumbnailUrl
      status
      createdAt
    }
  }
`;

export const ADMIN_EDIT_MOMENT = gql`
  mutation AdminEditMoment($id: ID!, $input: AdminUpdateMomentInput!) {
    adminEditMoment(id: $id, input: $input) {
      id
      caption
      videoUrl
      thumbnailUrl
      status
      totalViews
      createdAt
      addedBy
      owner {
        id
        firstName
        lastName
        avatar
      }
    }
  }
`;

export const ADMIN_CHANGE_MOMENT_UPLOAD_TYPE = gql`
  mutation AdminChangeMomentUploadType($id: ID!, $input: AdminChangeMomentUploadTypeInput!) {
    adminChangeMomentUploadType(id: $id, input: $input) {
      id
      caption
      videoUrl
      thumbnailUrl
      status
      totalViews
      createdAt
      addedBy
      owner {
        id
        firstName
        lastName
        avatar
      }
    }
  }
`;

export const GET_MOMENT_SETTING = gql`
  query GetMomentSetting {
    getMomentSetting {
      id
      entity
      allowMomentsShareInFeed
      momentsShareInFeedTitle
      momentsShareInFeedDescription
      allowMomentsAiLabel
      momentsAiLabelTitle
      momentsAiLabelDescription
      momentsMaxDuration
      momentsUploadTitle
      momentsUploadDescription
      momentsUploadFormat
      momentsUploadCardTitle
      momentsUploadCardDescription
    }
  }
`;

export const UPDATE_MOMENT_SETTING = gql`
  mutation UpdateMomentSetting($input: UpdateMomentSettingInput!) {
    updateMomentSetting(input: $input) {
      id
      entity
      allowMomentsShareInFeed
      momentsShareInFeedTitle
      momentsShareInFeedDescription
      allowMomentsAiLabel
      momentsAiLabelTitle
      momentsAiLabelDescription
      momentsMaxDuration
      momentsUploadTitle
      momentsUploadDescription
      momentsUploadFormat
      momentsUploadCardTitle
      momentsUploadCardDescription
    }
  }
`;


