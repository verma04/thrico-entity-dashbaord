import { gql, useMutation, useQuery } from "@apollo/client";
import { GET_MCP_KEYS, GET_MCP_LOGS } from "../../quries/mcp";

export const GENERATE_MCP_KEY = gql`
  mutation GenerateMCPKey($name: String!, $permissions: [String!]!) {
    generateMCPKey(name: $name, permissions: $permissions) {
      id
      name
      apiKey
      status
      permissions
      createdAt
    }
  }
`;

export const REVOKE_MCP_KEY = gql`
  mutation RevokeMCPKey($revokeMcpKeyId: ID!) {
    revokeMCPKey(id: $revokeMcpKeyId)
  }
`;

export const UPDATE_MCP_KEY = gql`
  mutation UpdateMCPKey($id: ID!, $status: String!) {
    updateMCPKey(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const useGetMCPKeys = () => useQuery(GET_MCP_KEYS);

export const useGetMCPLogs = (limit?: number) =>
  useQuery(GET_MCP_LOGS, {
    variables: { limit },
    pollInterval: 5000, // Polling logs every 5 seconds for activity
  });

export const useGenerateMCPKey = (options?: any) =>
  useMutation(GENERATE_MCP_KEY, {
    ...options,
    refetchQueries: [{ query: GET_MCP_KEYS }],
  });

export const useRevokeMCPKey = (options?: any) =>
  useMutation(REVOKE_MCP_KEY, {
    ...options,
    refetchQueries: [{ query: GET_MCP_KEYS }],
  });

export const useUpdateMCPKey = (options?: any) =>
  useMutation(UPDATE_MCP_KEY, {
    ...options,
    refetchQueries: [{ query: GET_MCP_KEYS }],
  });
