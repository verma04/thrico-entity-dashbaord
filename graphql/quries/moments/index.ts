import { gql } from "@apollo/client";

export const GET_ALL_MOMENTS = gql`
  query GetAllMoments($pagination: PaginationInput) {
    getAllMoments(pagination: $pagination) {
      data {
        id
        caption
        videoUrl
        thumbnailUrl
        status
        createdAt
        owner {
          firstName
          lastName
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
`;export const GET_MOMENT_DASHBOARD_KPIs = gql`
  query GetMomentDashboardKPIs($timeRange: TimeRange!) {
    getMomentAnalytics(timeRange: $timeRange) {
      totalMoments
      totalViews
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
