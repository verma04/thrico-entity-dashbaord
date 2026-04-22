import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ENTITY_SETTINGS,
  UPDATE_ENTITY_SETTINGS,
  UPDATE_FEED_ORDER,
  UPDATE_FEED_ENTITY_NAME,
} from "../../quries";

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

  // Feed Protocol Fields
  allowEntityCommunityInFeed: boolean;
  allowEntityDiscussionForumInFeed: boolean;
  allowEntityPollsInFeed: boolean;
  allowEntityFeedInFeed: boolean;
  feedOrder: string[];
  feedEntityName: string;
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

  // Feed Protocol Fields
  allowEntityCommunityInFeed?: boolean;
  allowEntityDiscussionForumInFeed?: boolean;
  allowEntityPollsInFeed?: boolean;
  allowEntityFeedInFeed?: boolean;
  allowEntityMomentsInFeed?: boolean;
  allowEntityFeedInFeed?: boolean;

  // FAQ & Terms Fields
  termAndConditionsEvents?: string | null;
  termAndConditionsCommunities?: string | null;
  faqWallOfFame?: string | null;
  faqSurveys?: string | null;
  faqStories?: string | null;
  faqShop?: string | null;
  faqPolls?: string | null;
  faqOffers?: string | null;
  faqMentorship?: string | null;
  faqMembers?: string | null;
  faqListing?: string | null;
  faqJobs?: string | null;
  faqGamification?: string | null;
  faqForums?: string | null;
  faqEvents?: string | null;
  faqCommunities?: string | null;
}

export interface UpdateEntitySettingsResponse {
  updateEntitySettings: EntitySettings;
}

// Custom hook to get entity settings
export const useGetEntitySettings = (options?: any) =>
  useQuery<GetEntitySettingsResponse>(GET_ENTITY_SETTINGS, options);

// Custom hook to update entity settings
export const useUpdateEntitySettings = (options?: any) => {
  const [mutate, result] = useMutation<
    UpdateEntitySettingsResponse,
    { input: UpdateEntitySettingsInput }
  >(UPDATE_ENTITY_SETTINGS, options);

  const wrappedMutate = (mutationOptions: any) => {
    if (mutationOptions?.variables?.input) {
      const { __typename, id, entity, ...rest } = mutationOptions.variables.input;
      return mutate({
        ...mutationOptions,
        variables: {
          ...mutationOptions.variables,
          input: rest,
        },
      });
    }
    return mutate(mutationOptions);
  };

  return [wrappedMutate, result] as any;
};

// Custom hook to update feed order
export const useUpdateFeedOrder = (options?: any) =>
  useMutation(UPDATE_FEED_ORDER, {
    ...options,
    refetchQueries: [{ query: GET_ENTITY_SETTINGS }],
    awaitRefetchQueries: true,
  });

// Custom hook to update feed entity name
export const useUpdateFeedEntityName = (options?: any) =>
  useMutation(UPDATE_FEED_ENTITY_NAME, {
    ...options,
    refetchQueries: [{ query: GET_ENTITY_SETTINGS }],
    awaitRefetchQueries: true,
  });
