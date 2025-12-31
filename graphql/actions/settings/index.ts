import { useMutation, useQuery } from "@apollo/client";
import { GET_ENTITY_SETTINGS, UPDATE_ENTITY_SETTINGS } from "../../quries";

// TypeScript types for EntitySettings
export interface EntitySettings {
  id: string;
  entity: string;
  allowNewUser: boolean;
  autoApproveUser: boolean;
  allowCommunity: boolean;
  autoApproveCommunity: boolean;
  autoApproveGroup: boolean;
  allowDiscussionForum: boolean;
  autoApproveDiscussionForum: boolean;
  allowEvents: boolean;
  autoApproveEvents: boolean;
  allowJobs: boolean;
  autoApproveJobs: boolean;
  allowMentorship: boolean;
  autoApproveMentorship: boolean;
  allowListing: boolean;
  autoApproveListing: boolean;
  autoApproveMarketPlace: boolean;
  allowShop: boolean;
  autoApproveShop: boolean;
  allowOffers: boolean;
  autoApproveOffers: boolean;
  allowSurveys: boolean;
  autoApproveSurveys: boolean;
  allowPolls: boolean;
  autoApprovePolls: boolean;
  allowStories: boolean;
  autoApproveStories: boolean;
}

export interface GetEntitySettingsResponse {
  getEntitySettings: EntitySettings;
}

export interface UpdateEntitySettingsInput {
  allowNewUser?: boolean;
  autoApproveUser?: boolean;
  allowCommunity?: boolean;
  autoApproveCommunity?: boolean;
  autoApproveGroup?: boolean;
  allowDiscussionForum?: boolean;
  autoApproveDiscussionForum?: boolean;
  allowEvents?: boolean;
  autoApproveEvents?: boolean;
  allowJobs?: boolean;
  autoApproveJobs?: boolean;
  allowMentorship?: boolean;
  autoApproveMentorship?: boolean;
  allowListing?: boolean;
  autoApproveListing?: boolean;
  autoApproveMarketPlace?: boolean;
  allowShop?: boolean;
  autoApproveShop?: boolean;
  allowOffers?: boolean;
  autoApproveOffers?: boolean;
  allowSurveys?: boolean;
  autoApproveSurveys?: boolean;
  allowPolls?: boolean;
  autoApprovePolls?: boolean;
  allowStories?: boolean;
  autoApproveStories?: boolean;
}

export interface UpdateEntitySettingsResponse {
  updateEntitySettings: EntitySettings;
}

// Custom hook to get entity settings
export const useGetEntitySettings = (options?: any) =>
  useQuery<GetEntitySettingsResponse>(GET_ENTITY_SETTINGS, options);

// Custom hook to update entity settings
export const useUpdateEntitySettings = (options?: any) =>
  useMutation<
    UpdateEntitySettingsResponse,
    { input: UpdateEntitySettingsInput }
  >(UPDATE_ENTITY_SETTINGS, options);
