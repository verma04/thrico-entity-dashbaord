import { useQuery, useMutation, MutationHookOptions } from "@apollo/client";
import {
  GET_FEED_CAMPAIGNS,
  GET_FEED_CAMPAIGN_BY_ID,
  ADMIN_CREATE_FEED_CAMPAIGN,
  ADMIN_UPDATE_FEED_CAMPAIGN,
  ADMIN_DELETE_FEED_CAMPAIGN,
  GENERATE_FEED_CAMPAIGN_ASSET_UPLOAD_URL,
  GET_ACTIVE_USER_FEED_CAMPAIGNS,
} from "../../quries/feed/campaigns";

export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED";
export type FeedPlacement = "FEED" | "STORIES" | "BOTH";

export interface FeedCampaign {
  id: string;
  entityId: string;
  title: string;
  slug: string;
  description?: string | null;
  status: CampaignStatus;
  frameUrl: string;
  frameMetadata?: {
    width?: number;
    height?: number;
  } | null;
  placements: string[];
  aspectRatio: string;
  festiveImageUrl?: string | null;
  ctaButtonText?: string | null;
  ctaBgColor?: string | null;
  ctaTextColor?: string | null;
  isFilterActive: boolean;
  allowCameraRecording: boolean;
  allowFileUpload: boolean;
  totalPosts: number;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FeedCampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalPosts: number;
}

export interface GetFeedCampaignsResponse {
  getFeedCampaigns: {
    data: FeedCampaign[];
    meta: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
    };
    stats: FeedCampaignStats;
  };
}

export interface GetFeedCampaignByIdResponse {
  getFeedCampaignById: FeedCampaign;
}

export interface AdminCreateFeedCampaignInput {
  title: string;
  slug?: string;
  description?: string;
  status?: CampaignStatus;
  frameUrl: string;
  frameMetadata?: {
    width?: number;
    height?: number;
  } | null;
  placements?: string[];
  aspectRatio?: string;
  festiveImageUrl?: string | null;
  ctaButtonText?: string | null;
  ctaBgColor?: string | null;
  ctaTextColor?: string | null;
  isFilterActive?: boolean;
  allowCameraRecording?: boolean;
  allowFileUpload?: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

export interface AdminUpdateFeedCampaignInput {
  title?: string;
  slug?: string;
  description?: string;
  status?: CampaignStatus;
  frameUrl?: string;
  frameMetadata?: {
    width?: number;
    height?: number;
  } | null;
  placements?: string[];
  aspectRatio?: string;
  festiveImageUrl?: string | null;
  ctaButtonText?: string | null;
  ctaBgColor?: string | null;
  ctaTextColor?: string | null;
  isFilterActive?: boolean;
  allowCameraRecording?: boolean;
  allowFileUpload?: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

export const useGetFeedCampaigns = (variables?: {
  pagination?: { page?: number; limit?: number };
  status?: string;
  search?: string;
}) => {
  return useQuery<GetFeedCampaignsResponse>(GET_FEED_CAMPAIGNS, {
    variables,
    fetchPolicy: "cache-and-network",
  });
};

export const useGetFeedCampaignById = (id: string) => {
  return useQuery<GetFeedCampaignByIdResponse>(GET_FEED_CAMPAIGN_BY_ID, {
    variables: { id },
    skip: !id,
  });
};

export const useAdminCreateFeedCampaign = (
  options?: MutationHookOptions<
    { adminCreateFeedCampaign: FeedCampaign },
    { input: AdminCreateFeedCampaignInput }
  >,
) => {
  const [createCampaign, { loading }] = useMutation<
    { adminCreateFeedCampaign: FeedCampaign },
    { input: AdminCreateFeedCampaignInput }
  >(ADMIN_CREATE_FEED_CAMPAIGN, {
    refetchQueries: [{ query: GET_FEED_CAMPAIGNS }],
    ...options,
  });
  return [createCampaign, { loading }] as const;
};

export const useAdminUpdateFeedCampaign = (
  options?: MutationHookOptions<
    { adminUpdateFeedCampaign: FeedCampaign },
    { id: string; input: AdminUpdateFeedCampaignInput }
  >,
) => {
  const [updateCampaign, { loading }] = useMutation<
    { adminUpdateFeedCampaign: FeedCampaign },
    { id: string; input: AdminUpdateFeedCampaignInput }
  >(ADMIN_UPDATE_FEED_CAMPAIGN, {
    refetchQueries: [{ query: GET_FEED_CAMPAIGNS }],
    ...options,
  });
  return [updateCampaign, { loading }] as const;
};

export const useAdminDeleteFeedCampaign = () => {
  const [deleteCampaign, { loading }] = useMutation(
    ADMIN_DELETE_FEED_CAMPAIGN,
    {
      refetchQueries: [{ query: GET_FEED_CAMPAIGNS }],
    },
  );
  return { deleteCampaign, loading };
};

export const useGenerateFeedCampaignAssetUploadUrl = () => {
  const [generateUploadUrl, { loading }] = useMutation<{
    generateFeedCampaignAssetUploadUrl: {
      uploadUrl: string;
      fileUrl: string;
      key: string;
      expiresIn: number;
    };
  }>(GENERATE_FEED_CAMPAIGN_ASSET_UPLOAD_URL);
  return [generateUploadUrl, { loading }] as const;
};

export const useGetActiveUserFeedCampaigns = (placement?: string) => {
  return useQuery<{ getActiveUserFeedCampaigns: FeedCampaign[] }>(
    GET_ACTIVE_USER_FEED_CAMPAIGNS,
    {
      variables: { placement },
      fetchPolicy: "cache-and-network",
    },
  );
};
