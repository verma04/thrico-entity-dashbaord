import { useMutation, MutationHookOptions } from "@apollo/client";
import { EXPORT_DATA } from "../../quries/export";

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

export interface ExportResponse {
  success: boolean;
  message: string;
  totalCount?: number;
  fileUrl?: string;
}

export interface ExportDataResponse {
  exportData: ExportResponse;
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
