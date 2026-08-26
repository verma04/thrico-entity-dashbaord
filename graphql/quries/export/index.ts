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
