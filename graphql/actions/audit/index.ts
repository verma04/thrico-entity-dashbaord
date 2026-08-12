import { useQuery } from "@apollo/client";
import { GET_AUDIT_LOG_MODULES, GET_AUDIT_LOGS, GET_AUDIT_LOG_BY_ID } from "../../quries/audit";

export interface AuditLog {
  id: string;
  adminId?: string;
  entityId?: string;
  module?: string;
  action: string;
  resourceId?: string;
  targetUserId?: string;
  previousState?: string;
  newState?: string;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  admin?: {
    id?: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface AuditLogResponse {
  auditLogs: {
    data: AuditLog[];
    meta: {
      totalItems: number;
      totalPages: number;
    };
  };
}

export interface AuditLogModulesResponse {
  auditLogModules: string[];
}

export const useGetAuditLogModules = (options?: any) => 
  useQuery<AuditLogModulesResponse>(GET_AUDIT_LOG_MODULES, options);

export interface GetAuditLogsVariables {
  pagination?: {
    page: number;
    limit: number;
  };
  module?: string;
  resourceId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const useGetAuditLogs = (variables: GetAuditLogsVariables, options?: any) => 
  useQuery<AuditLogResponse>(GET_AUDIT_LOGS, {
    ...options,
    variables
  });

export interface AuditLogByIdResponse {
  auditLogById: AuditLog;
}

export interface GetAuditLogByIdVariables {
  auditLogByIdId: string;
}

export const useGetAuditLogById = (variables: GetAuditLogByIdVariables, options?: any) => 
  useQuery<AuditLogByIdResponse>(GET_AUDIT_LOG_BY_ID, {
    ...options,
    variables
  });
