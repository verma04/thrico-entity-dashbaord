import {
  useQuery,
  useMutation,
  type QueryHookOptions,
  type MutationHookOptions,
} from "@apollo/client";
import {
  GET_ALLOWED_IDENTIFIERS,
  IMPORT_ALLOWED_IDENTIFIERS_CSV,
  DELETE_ALLOWED_IDENTIFIER,
  CLEAR_ALLOWED_IDENTIFIERS,
} from "../../quries";

export interface AllowedIdentifierItem {
  id: string;
  entityId: string;
  fieldKey: string;
  identifier: string;
  originalIdentifier?: string | null;
  name?: string | null;
  email?: string | null;
  metadata?: Record<string, unknown> | null;
  source: string;
  s3Url?: string | null;
  status: "ACTIVE" | "CLAIMED" | "BLOCKED" | string;
  claimedByUserId?: string | null;
  claimedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedAllowedIdentifiers {
  items: AllowedIdentifierItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllowedIdentifiersResponse {
  getAllowedIdentifiers: PaginatedAllowedIdentifiers;
}

export interface AllowedIdentifierImportResult {
  success: boolean;
  totalProcessed: number;
  insertedCount: number;
  updatedCount: number;
  failedCount: number;
  message: string;
  s3ArchiveUrl?: string | null;
}

export interface ImportAllowedIdentifiersCsvResponse {
  importAllowedIdentifiersCsv: AllowedIdentifierImportResult;
}

export const useGetAllowedIdentifiers = (
  options?: QueryHookOptions<
    GetAllowedIdentifiersResponse,
    {
      fieldKey?: string;
      search?: string;
      status?: string;
      page?: number;
      limit?: number;
    }
  >
) =>
  useQuery<
    GetAllowedIdentifiersResponse,
    {
      fieldKey?: string;
      search?: string;
      status?: string;
      page?: number;
      limit?: number;
    }
  >(GET_ALLOWED_IDENTIFIERS, options);

export const useImportAllowedIdentifiersCsv = (
  options?: MutationHookOptions<
    ImportAllowedIdentifiersCsvResponse,
    {
      fieldKey: string;
      csvContent: string;
      archiveFileName?: string;
    }
  >
) =>
  useMutation<
    ImportAllowedIdentifiersCsvResponse,
    {
      fieldKey: string;
      csvContent: string;
      archiveFileName?: string;
    }
  >(IMPORT_ALLOWED_IDENTIFIERS_CSV, options);

export const useDeleteAllowedIdentifier = (
  options?: MutationHookOptions<{ deleteAllowedIdentifier: boolean }, { id: string }>
) =>
  useMutation<{ deleteAllowedIdentifier: boolean }, { id: string }>(
    DELETE_ALLOWED_IDENTIFIER,
    options
  );

export const useClearAllowedIdentifiers = (
  options?: MutationHookOptions<{ clearAllowedIdentifiers: boolean }, { fieldKey?: string }>
) =>
  useMutation<{ clearAllowedIdentifiers: boolean }, { fieldKey?: string }>(
    CLEAR_ALLOWED_IDENTIFIERS,
    options
  );
