import { useMutation, MutationHookOptions } from "@apollo/client";
import { EXPORT_DATA, EXPORT_MEMBERS, EXPORT_FEED } from "../../quries/export";

export enum ExportFormat {
  CSV_EXCEL = "csv_excel",
  CSV_PLAIN = "csv_plain",
}

export interface ExportDataInput {
  module: string;
  targetId?: string | null;
  format?: "csv_excel" | "csv_plain" | ExportFormat;
  status?: string | null;
  search?: string | null;
  membershipTierId?: string | null;
  industryId?: string | null;
}

export interface ExportMembersInput {
  status?: string | null;
  search?: string | null;
  membershipTierId?: string | null;
  industryId?: string | null;
  format?: "csv_excel" | "csv_plain" | ExportFormat;
}

export interface ExportFeedInput {
  status?: string | null;
  search?: string | null;
  targetId?: string | null;
  source?: string | null;
  format?: "csv_excel" | "csv_plain" | ExportFormat;
}

export interface ExportResponse {
  success: boolean;
  message: string;
  totalCount?: number | null;
  fileUrl?: string | null;
}

export interface ExportDataResponse {
  exportData: ExportResponse;
}

export interface ExportMembersResponse {
  exportMembers: ExportResponse;
}

export interface ExportFeedResponse {
  exportFeed: ExportResponse;
}

export const useExportData = (
  options?: MutationHookOptions<
    ExportDataResponse,
    { input: ExportDataInput }
  >
) => {
  return useMutation<ExportDataResponse, { input: ExportDataInput }>(
    EXPORT_DATA,
    options
  );
};

export const useExportMembers = (
  options?: MutationHookOptions<
    ExportMembersResponse,
    { input?: ExportMembersInput }
  >
) => {
  return useMutation<ExportMembersResponse, { input?: ExportMembersInput }>(
    EXPORT_MEMBERS,
    options
  );
};

export const useExportFeed = (
  options?: MutationHookOptions<
    ExportFeedResponse,
    { input?: ExportFeedInput }
  >
) => {
  return useMutation<ExportFeedResponse, { input?: ExportFeedInput }>(
    EXPORT_FEED,
    options
  );
};


