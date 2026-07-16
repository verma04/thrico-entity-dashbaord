import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_REPORTS, UPDATE_REPORT_STATUS, ReportModule } from "../../quries/reports";
export { GET_ALL_REPORTS, UPDATE_REPORT_STATUS, ReportModule };

export interface GetAllReportsVariables {
  module?: ReportModule;
  targetId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const useGetAllReports = (options?: any) => 
  useQuery(GET_ALL_REPORTS, options);

export const useUpdateReportStatus = (options?: any) =>
  useMutation(UPDATE_REPORT_STATUS, {
    ...options,
    refetchQueries: [{ query: GET_ALL_REPORTS }],
    awaitRefetchQueries: true,
  });
