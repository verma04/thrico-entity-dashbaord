import { gql } from "@apollo/client";

export const GET_AUDIT_LOG_MODULES = gql`
  query AuditLogModules {
    auditLogModules
  }
`;

export const GET_AUDIT_LOGS = gql`
  query AuditLogs($pagination: PaginationInput, $module: String, $resourceId: String) {
    auditLogs(pagination: $pagination, module: $module, resourceId: $resourceId) {
      data {
        id
        adminId
        entityId
        module
        action
        resourceId
        targetUserId
        previousState
        newState
        reason
        ipAddress
        userAgent
        createdAt
        admin {
          firstName
        }
      }
      meta {
        totalItems
        totalPages
      }
    }
  }
`;

export const GET_AUDIT_LOG_BY_ID = gql`
  query AuditLogById($auditLogByIdId: ID!) {
    auditLogById(id: $auditLogByIdId) {
      id
      adminId
      entityId
      module
      action
      resourceId
      targetUserId
      previousState
      newState
      reason
      ipAddress
      userAgent
      createdAt
      admin {
        lastName
        firstName 
        id
      }
    }
  }
`;
