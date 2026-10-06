import { gql } from "@apollo/client";

export const GET_ALLOWED_IDENTIFIERS = gql`
  query GetAllowedIdentifiers(
    $fieldKey: String
    $search: String
    $status: String
    $page: Int
    $limit: Int
  ) {
    getAllowedIdentifiers(
      fieldKey: $fieldKey
      search: $search
      status: $status
      page: $page
      limit: $limit
    ) {
      items {
        id
        entityId
        fieldKey
        identifier
        originalIdentifier
        name
        email
        metadata
        source
        s3Url
        status
        claimedByUserId
        claimedAt
        createdAt
        updatedAt
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const IMPORT_ALLOWED_IDENTIFIERS_CSV = gql`
  mutation ImportAllowedIdentifiersCsv(
    $fieldKey: String!
    $csvContent: String!
    $archiveFileName: String
  ) {
    importAllowedIdentifiersCsv(
      fieldKey: $fieldKey
      csvContent: $csvContent
      archiveFileName: $archiveFileName
    ) {
      success
      totalProcessed
      insertedCount
      updatedCount
      failedCount
      message
      s3ArchiveUrl
    }
  }
`;

export const DELETE_ALLOWED_IDENTIFIER = gql`
  mutation DeleteAllowedIdentifier($id: ID!) {
    deleteAllowedIdentifier(id: $id)
  }
`;

export const CLEAR_ALLOWED_IDENTIFIERS = gql`
  mutation ClearAllowedIdentifiers($fieldKey: String) {
    clearAllowedIdentifiers(fieldKey: $fieldKey)
  }
`;
