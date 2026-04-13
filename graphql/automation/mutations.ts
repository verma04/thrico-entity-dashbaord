import { gql } from "@apollo/client";

export const CREATE_AUTOMATION_CAMPAIGN = gql`
  mutation CreateAutomationCampaign(
    $name: String!, 
    $entityId: ID!, 
    $triggerType: String!, 
    $triggerConfig: JSON!, 
    $actionConfig: JSON!,
    $segmentationConfig: JSON,
    $description: String
  ) {
    createAutomationCampaign(
      name: $name,
      entityId: $entityId,
      triggerType: $triggerType,
      triggerConfig: $triggerConfig,
      actionConfig: $actionConfig,
      segmentationConfig: $segmentationConfig,
      description: $description
    ) {
      id
      status
    }
  }
`;

export const UPDATE_AUTOMATION_CAMPAIGN = gql`
  mutation UpdateAutomationCampaign($id: ID!, $status: AutomationCampaignStatus) {
    updateAutomationCampaign(id: $id, status: $status) {
      id
      status
    }
  }
`;
