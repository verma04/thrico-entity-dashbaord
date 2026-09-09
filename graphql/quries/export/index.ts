import { gql } from "@apollo/client";

export const EXPORT_DATA = gql`
  mutation ExportData($input: ExportDataInput!) {
    exportData(input: $input) {
      success
      message
      totalCount
      fileUrl
    }
  }
`;

export const EXPORT_MEMBERS = gql`
  mutation ExportMembers($input: ExportMembersInput) {
    exportMembers(input: $input) {
      success
      message
      totalCount
      fileUrl
    }
  }
`;

export const EXPORT_FEED = gql`
  mutation ExportFeed($input: ExportFeedInput) {
    exportFeed(input: $input) {
      success
      message
      totalCount
      fileUrl
    }
  }
`;


