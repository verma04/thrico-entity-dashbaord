import { gql } from "@apollo/client";

export enum ReportModule {
  FEED = "FEED",
  MEMBER = "MEMBER",
  DISCUSSION_FORUM = "DISCUSSION_FORUM",
  COMMUNITY = "COMMUNITY",
  JOB = "JOB",
  LISTING = "LISTING",
  MOMENT = "MOMENT",
  OFFER = "OFFER",
  EVENT = "EVENT",
  USER = "USER",
  SHOP = "SHOP",
  SURVEY = "SURVEY",
}

export const GET_ALL_REPORTS = gql`
  query GetAllReports($module: ReportModule, $status: ReportStatus, $page: Int, $limit: Int) {
    getAllReports(module: $module, status: $status, page: $page, limit: $limit) {
      pagination {
        currentPage
        totalPages
        totalCount
        limit
        hasNextPage
        hasPreviousPage
      }
      reports {
        id
        targetId
        module
        reportedBy
        reporter {
          lastName
          firstName
          id
        }
        reason
        description
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_REPORT_STATUS = gql`
  mutation UpdateReportStatus($reportId: ID!, $status: ReportStatus!) {
    updateReportStatus(reportId: $reportId, status: $status) {
      id
      targetId
      module
      reportedBy
      reason
      description
      status
      createdAt
      updatedAt
    }
  }
`;
