import { gql } from "@apollo/client";

export const GET_MCP_KEYS = gql`
  query GetMCPKeys {
    mcpKeys {
      id
      name
      status
      permissions
      createdAt
    }
  }
`;

export const GET_MCP_LOGS = gql`
  query GetMCPLogs($limit: Int) {
    mcpLogs(limit: $limit) {
      id
      actionName
      status
      triggerSource
      timestamp
      payload
      result
    }
  }
`;
