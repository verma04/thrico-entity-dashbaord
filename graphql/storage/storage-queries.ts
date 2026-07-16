import { gql } from "@apollo/client";

export const GET_STORAGE_STATS = gql`
  query GetStorageStats {
    getStorageStats {
      module
      totalBytes
      fileCount
    }
  }
`;

export const GET_STORAGE_SUMMARY = gql`
  query GetStorageSummary {
    getStorageSummary {
      totalBytes
      totalFileCount
    }
  }
`;
