import { gql } from "@apollo/client";

export const GET_AUTOMATION_METADATA = gql`
  query GetAutomationMetadata($entityId: ID!) {
    getAutomationMetadata(entityId: $entityId) {
      modules {
        id
        name
        triggers {
          id
          name
        }
        segmentationFields {
          id
          name
          type
        }
      }
    }
  }
`;

export const GET_AUTOMATION_CAMPAIGNS = gql`
  query GetAutomationCampaigns($entityId: ID!) {
    getAutomationCampaigns(entityId: $entityId) {
      id
      name
      description
      status
      triggerType
      triggerConfig
      createdAt
    }
  }
`;

export const GET_AUTOMATION_JOB_LOGS = gql`
  query GetAutomationJobLogs($jobId: ID!) {
    getAutomationExecutionLogs(jobId: $jobId) {
      id
      actionType
      status
      result
      errorMessage
      executedAt
    }
  }
`;
