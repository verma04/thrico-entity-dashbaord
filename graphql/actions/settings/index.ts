import {
  useMutation,
  useQuery,
  type QueryHookOptions,
  type MutationHookOptions,
  type MutationFunctionOptions,
} from "@apollo/client";
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
  sendWelcomeEmail?: boolean;
  welcomeEmailSubject?: string;
  sendApprovalEmail?: boolean;
  approvalEmailSubject?: string;
  actionEmails?: Array<{
    id?: string;
    slug: string;
    type: "welcome" | "approval" | "custom";
    title?: string;
    enabled: boolean;
    subject: string;
    html?: string;
    json?: string;
  }>;
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
  allowEntityMomentsInFeed: boolean;
  feedOrder: string[];
  feedEntityName: string;

  // Media Gallery
  allowMediaGalleryComments: boolean;
}

export interface GetEntitySettingsResponse {
  getEntitySettings: EntitySettings;
}

export interface UpdateEntitySettingsInput {
  allowNewUser?: boolean;
  autoApproveUser?: boolean;
  sendWelcomeEmail?: boolean;
  welcomeEmailSubject?: string;
  sendApprovalEmail?: boolean;
  approvalEmailSubject?: string;
  actionEmails?: Array<{
    id?: string;
    slug: string;
    type: "welcome" | "approval" | "custom";
    title?: string;
    enabled: boolean;
    subject: string;
    html?: string;
    json?: string;
  }>;
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

  // Media Gallery
  allowMediaGalleryComments?: boolean;
}

export interface UpdateEntitySettingsResponse {
  updateEntitySettings: EntitySettings;
}

// Custom hook to get entity settings
export const useGetEntitySettings = (
  options?: QueryHookOptions<GetEntitySettingsResponse>
) => useQuery<GetEntitySettingsResponse>(GET_ENTITY_SETTINGS, options);

// Custom hook to update entity settings
export const useUpdateEntitySettings = (
  options?: MutationHookOptions<
    UpdateEntitySettingsResponse,
    { input: UpdateEntitySettingsInput }
  >
) => {
  const [mutate, result] = useMutation<
    UpdateEntitySettingsResponse,
    { input: UpdateEntitySettingsInput }
  >(UPDATE_ENTITY_SETTINGS, options);

  const wrappedMutate = (
    mutationOptions?: MutationFunctionOptions<
      UpdateEntitySettingsResponse,
      { input: UpdateEntitySettingsInput }
    >
  ) => {
    if (mutationOptions?.variables?.input) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const inputObj = mutationOptions.variables.input as any;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __typename, id, entity, ...rest } = inputObj;
      return mutate({
        ...mutationOptions,
        variables: {
          ...mutationOptions.variables,
          input: rest as UpdateEntitySettingsInput,
        },
      });
    }
    return mutate(mutationOptions);
  };

  return [wrappedMutate, result] as const;
};

// Custom hook to update feed order
export const useUpdateFeedOrder = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: MutationHookOptions<any, any>
) =>
  useMutation(UPDATE_FEED_ORDER, {
    ...options,
    refetchQueries: [{ query: GET_ENTITY_SETTINGS }],
    awaitRefetchQueries: true,
  });

// Custom hook to update feed entity name
export const useUpdateFeedEntityName = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: MutationHookOptions<any, any>
) =>
  useMutation(UPDATE_FEED_ENTITY_NAME, {
    ...options,
    refetchQueries: [{ query: GET_ENTITY_SETTINGS }],
    awaitRefetchQueries: true,
  });


export * from "./shopify";
export * from "./woocommerce";
export * from "./roles";
export * from "./hr";
export * from "./crm";

