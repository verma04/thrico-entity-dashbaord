import { useQuery, useMutation, MutationHookOptions } from "@apollo/client";
import {
  GET_MOMENT_CAMPAIGNS,
  GET_MOMENT_CAMPAIGN_BY_ID,
  ADMIN_CREATE_MOMENT_CAMPAIGN,
  ADMIN_UPDATE_MOMENT_CAMPAIGN,
  ADMIN_DELETE_MOMENT_CAMPAIGN,
  GENERATE_CAMPAIGN_ASSET_UPLOAD_URL,
  CREATE_MOMENT_COMPOSITING_JOB,
  GET_MOMENT_COMPOSITING_JOB_BY_ID,
  GET_ACTIVE_USER_MOMENT_CAMPAIGNS,
  GET_MOMENTS_CAMPAIGNS_DESIGN_SETTINGS,
  UPDATE_MOMENTS_CAMPAIGNS_DESIGN_SETTINGS,
} from "../../quries/moments/campaigns";
import { Moment } from "./index";

export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED";
export type FitMode = "FIT" | "FILL" | "CONTAIN";

export interface MomentCampaign {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  status: CampaignStatus;
  frameUrl: string;
  frameMetadata?: {
    width?: number;
    height?: number;
  } | null;
  introMomentId?: string | null;
  introVideoUrl?: string | null;
  outroMomentId?: string | null;
  outroVideoUrl?: string | null;
  aspectRatio: string;
  fitMode: FitMode;
  minUserDurationSeconds?: number;
  maxUserDurationSeconds: number;
  festiveImageUrl?: string | null;
  ctaButtonText?: string | null;
  ctaBgColor?: string | null;
  ctaTextColor?: string | null;
  isFilterActive: boolean;
  allowCameraRecording: boolean;
  allowFileUpload: boolean;
  autoPublishMoment: boolean;
  shareInFeed: boolean;
  totalCompositions: number;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  introMoment?: Moment | null;
  outroMoment?: Moment | null;
}

export interface MomentCampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalCompositions: number;
  totalDownloads: number;
}

export interface GetMomentCampaignsResponse {
  getMomentCampaigns: {
    data: MomentCampaign[];
    meta: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
    };
    stats: MomentCampaignStats;
  };
}

export interface GetMomentCampaignByIdResponse {
  getMomentCampaignById: MomentCampaign;
}

export interface AdminCreateMomentCampaignInput {
  title: string;
  slug: string;
  description?: string;
  status?: CampaignStatus;
  frameUrl: string;
  frameMetadata?: {
    width?: number;
    height?: number;
  } | null;
  introMomentId?: string | null;
  outroMomentId?: string | null;
  aspectRatio?: string;
  fitMode?: FitMode;
  minUserDurationSeconds?: number;
  maxUserDurationSeconds?: number;
  festiveImageUrl?: string | null;
  ctaButtonText?: string | null;
  ctaBgColor?: string | null;
  ctaTextColor?: string | null;
  isFilterActive?: boolean;
  allowCameraRecording?: boolean;
  allowFileUpload?: boolean;
  autoPublishMoment?: boolean;
  shareInFeed?: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

export interface AdminUpdateMomentCampaignInput {
  title?: string;
  slug?: string;
  description?: string;
  status?: CampaignStatus;
  frameUrl?: string;
  frameMetadata?: {
    width?: number;
    height?: number;
  } | null;
  introMomentId?: string | null;
  outroMomentId?: string | null;
  aspectRatio?: string;
  fitMode?: FitMode;
  minUserDurationSeconds?: number;
  maxUserDurationSeconds?: number;
  festiveImageUrl?: string | null;
  ctaButtonText?: string | null;
  ctaBgColor?: string | null;
  ctaTextColor?: string | null;
  isFilterActive?: boolean;
  allowCameraRecording?: boolean;
  allowFileUpload?: boolean;
  autoPublishMoment?: boolean;
  shareInFeed?: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

export interface CompositingJob {
  id: string;
  campaignId: string;
  status: "CREATED" | "UPLOADED" | "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  progress: number;
  rawVideoUrl: string;
  frameUrl: string;
  introVideoUrl?: string | null;
  outroVideoUrl?: string | null;
  outputVideoUrl?: string | null;
  thumbnailUrl?: string | null;
  duration?: number | null;
  errorMessage?: string | null;
  momentId?: string | null;
  createdAt: string;
  completedAt?: string | null;
}

export interface CreateMomentCompositingJobInput {
  campaignId: string;
  rawVideoUrl: string;
  sourceType?: "CAMERA" | "UPLOAD";
  caption?: string;
  shareInFeed?: boolean;
}

export const useGetMomentCampaigns = (variables?: {
  pagination?: { page?: number; limit?: number };
  status?: string;
  search?: string;
}) => {
  return useQuery<GetMomentCampaignsResponse>(GET_MOMENT_CAMPAIGNS, {
    variables,
    fetchPolicy: "cache-and-network",
  });
};

export const useGetMomentCampaignById = (id: string) => {
  return useQuery<GetMomentCampaignByIdResponse>(GET_MOMENT_CAMPAIGN_BY_ID, {
    variables: { id },
    skip: !id,
  });
};

export const useAdminCreateMomentCampaign = (
  options?: MutationHookOptions<
    { adminCreateMomentCampaign: MomentCampaign },
    { input: AdminCreateMomentCampaignInput }
  >,
) => {
  const [createCampaign, { loading }] = useMutation<
    { adminCreateMomentCampaign: MomentCampaign },
    { input: AdminCreateMomentCampaignInput }
  >(ADMIN_CREATE_MOMENT_CAMPAIGN, {
    refetchQueries: [{ query: GET_MOMENT_CAMPAIGNS }],
    ...options,
  });
  return [createCampaign, { loading }] as const;
};

export const useAdminUpdateMomentCampaign = (
  options?: MutationHookOptions<
    { adminUpdateMomentCampaign: MomentCampaign },
    { id: string; input: AdminUpdateMomentCampaignInput }
  >,
) => {
  const [updateCampaign, { loading }] = useMutation<
    { adminUpdateMomentCampaign: MomentCampaign },
    { id: string; input: AdminUpdateMomentCampaignInput }
  >(ADMIN_UPDATE_MOMENT_CAMPAIGN, {
    refetchQueries: [{ query: GET_MOMENT_CAMPAIGNS }],
    ...options,
  });
  return [updateCampaign, { loading }] as const;
};

export const useAdminDeleteMomentCampaign = () => {
  const [deleteCampaign, { loading }] = useMutation(
    ADMIN_DELETE_MOMENT_CAMPAIGN,
    {
      refetchQueries: [{ query: GET_MOMENT_CAMPAIGNS }],
    },
  );
  return { deleteCampaign, loading };
};

export const useGenerateCampaignAssetUploadUrl = () => {
  const [generateUploadUrl, { loading }] = useMutation<{
    generateCampaignAssetUploadUrl: {
      uploadUrl: string;
      fileUrl: string;
      key: string;
      expiresIn: number;
    };
  }>(GENERATE_CAMPAIGN_ASSET_UPLOAD_URL);
  return [generateUploadUrl, { loading }] as const;
};

export const useCreateMomentCompositingJob = () => {
  const [createJob, { loading }] = useMutation<{
    createMomentCompositingJob: CompositingJob;
  }>(CREATE_MOMENT_COMPOSITING_JOB);
  return [createJob, { loading }] as const;
};

export const useGetMomentCompositingJobById = (
  id: string,
  pollInterval: number = 0,
) => {
  return useQuery<{ getMomentCompositingJobById: CompositingJob }>(
    GET_MOMENT_COMPOSITING_JOB_BY_ID,
    {
      variables: { id },
      skip: !id,
      pollInterval,
      fetchPolicy: "network-only",
    },
  );
};

export const useGetActiveUserMomentCampaigns = () => {
  return useQuery<{ getActiveUserMomentCampaigns: MomentCampaign[] }>(
    GET_ACTIVE_USER_MOMENT_CAMPAIGNS,
    {
      fetchPolicy: "cache-and-network",
    },
  );
};

export interface MomentsCampaignsDesignSettings {
  pageBgUrl?: string | null;
  pageBgColor?: string | null;
  pageTitle?: string | null;
  pageSubtitle?: string | null;
  defaultCtaColor?: string | null;
  defaultCtaTextColor?: string | null;
}

export interface MomentsCampaignsDesignSettingsInput {
  pageBgUrl?: string | null;
  pageBgColor?: string | null;
  pageTitle?: string | null;
  pageSubtitle?: string | null;
  defaultCtaColor?: string | null;
  defaultCtaTextColor?: string | null;
}

export interface GetMomentsCampaignsDesignSettingsResponse {
  getMomentsCampaignsDesignSettings: MomentsCampaignsDesignSettings;
}

export const useGetMomentsCampaignsDesignSettings = () => {
  return useQuery<GetMomentsCampaignsDesignSettingsResponse>(
    GET_MOMENTS_CAMPAIGNS_DESIGN_SETTINGS,
    {
      fetchPolicy: "cache-and-network",
    },
  );
};

export const useUpdateMomentsCampaignsDesignSettings = (
  options?: MutationHookOptions<
    { updateMomentsCampaignsDesignSettings: MomentsCampaignsDesignSettings },
    { input: MomentsCampaignsDesignSettingsInput }
  >,
) => {
  const [updateSettings, { loading }] = useMutation<
    { updateMomentsCampaignsDesignSettings: MomentsCampaignsDesignSettings },
    { input: MomentsCampaignsDesignSettingsInput }
  >(UPDATE_MOMENTS_CAMPAIGNS_DESIGN_SETTINGS, {
    refetchQueries: [{ query: GET_MOMENTS_CAMPAIGNS_DESIGN_SETTINGS }],
    ...options,
  });
  return [updateSettings, { loading }] as const;
};

