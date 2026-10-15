import { useQuery, useMutation, MutationHookOptions } from "@apollo/client";
import {
  GET_ALL_MOMENTS,
  GET_MOMENT_DETAILS,
  GET_MOMENT_DASHBOARD_KPIs,
  ADMIN_DELETE_MOMENT,
  ADMIN_EDIT_MOMENT,
  ADMIN_GENERATE_MOMENT_UPLOAD_URL,
  ADMIN_CONFIRM_MOMENT_UPLOAD,
  ADMIN_CHANGE_MOMENT_UPLOAD_TYPE,
  ADMIN_GET_MOMENT_HISTORY,
  GET_MOMENT_SETTING,
  UPDATE_MOMENT_SETTING,
} from "../../quries/moments";
import { TimeRange, DateRangeInput } from "../dashboard";

export interface Moment {
  id: string;
  caption: string;
  videoUrl: string;
  thumbnailUrl: string;
  status: string;
  totalViews: number;
  createdAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  addedBy?: string;
}

export interface MomentDetails extends Moment {
  totalViews: number;
  totalReactions: number;
  detectedCategory: string;
  extractedKeywords: string[];
  sentimentScore: number;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

export interface MomentAnalytics {
  totalMoments: number;
  totalViews: number;
  totalReactions: number;
  totalComments: number;
  activeCreators: number;
  totalWatchTime: number;
  growth: {
    date: string;
    count: number;
  }[];
  engagement: {
    name: string;
    value: number;
  }[];
}

export interface GetAllMomentsResponse {
  getAllMoments: {
    data: Moment[];
    meta: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
    };
  };
}

export interface GetMomentDetailsResponse {
  getMomentDetailsById: MomentDetails;
}

export interface GetMomentDashboardKPIsResponse {
  getMomentAnalytics: MomentAnalytics;
}

export const useGetAllMoments = (variables?: { pagination?: { page?: number; limit?: number }, sortBy?: string, sortOrder?: string }) =>
  useQuery<GetAllMomentsResponse>(GET_ALL_MOMENTS, {
    variables,
  });

export const useGetMomentDetails = (id: string) =>
  useQuery<GetMomentDetailsResponse>(GET_MOMENT_DETAILS, {
    variables: { input: { id } },
  });

export const useGetMomentDashboardKPIs = (timeRange: TimeRange, dateRange?: DateRangeInput) =>
  useQuery<GetMomentDashboardKPIsResponse, { timeRange: TimeRange, dateRange?: DateRangeInput }>(GET_MOMENT_DASHBOARD_KPIs, {
    variables: { timeRange, dateRange },
  });

export const useAdminDeleteMoment = () => {
  const [deleteMoment, { loading }] = useMutation(ADMIN_DELETE_MOMENT, {
    refetchQueries: [{ query: GET_ALL_MOMENTS }],
  });
  return { deleteMoment, loading };
};

export const useAdminGenerateMomentUploadUrl = () => {
  const [generateUploadUrl, { loading }] = useMutation(ADMIN_GENERATE_MOMENT_UPLOAD_URL);
  return [generateUploadUrl, { loading }] as const;
};

export interface AdminConfirmMomentUploadInput {
  fileUrl: string;
  caption: string;
  thumbnailUrl?: string;
  shareInFeed?: boolean;
  isAiContent?: boolean;
  userId?: string | null;
}

export interface AdminConfirmMomentUploadResponse {
  adminConfirmMomentUpload: Moment;
}

export const useAdminConfirmMomentUpload = (
  options?: MutationHookOptions<
    AdminConfirmMomentUploadResponse,
    { input: AdminConfirmMomentUploadInput }
  >,
) => {
  const [confirmUpload, { loading }] = useMutation<
    AdminConfirmMomentUploadResponse,
    { input: AdminConfirmMomentUploadInput }
  >(ADMIN_CONFIRM_MOMENT_UPLOAD, {
    refetchQueries: [{ query: GET_ALL_MOMENTS }],
    ...options,
  });
  return [confirmUpload, { loading }] as const;
};


export interface AdminChangeMomentUploadTypeInput {
  addedBy: "USER" | "ENTITY";
  userId?: string;
}

export interface AdminChangeMomentUploadTypeResponse {
  adminChangeMomentUploadType: Moment;
}

export const useAdminChangeMomentUploadType = (
  options?: MutationHookOptions<
    AdminChangeMomentUploadTypeResponse,
    { id: string; input: AdminChangeMomentUploadTypeInput }
  >,
) => {
  const [changeUploadType, { loading }] = useMutation<
    AdminChangeMomentUploadTypeResponse,
    { id: string; input: AdminChangeMomentUploadTypeInput }
  >(ADMIN_CHANGE_MOMENT_UPLOAD_TYPE, {
    refetchQueries: [{ query: GET_ALL_MOMENTS }],
    ...options,
  });
  return [changeUploadType, { loading }] as const;
};

export interface AdminUpdateMomentInput {
  caption?: string;
  thumbnailUrl?: string;
  status?: string;
  addedBy?: string;
  userId?: string;
}

export interface AdminEditMomentResponse {
  adminEditMoment: Moment;
}

export const useAdminEditMoment = () => {
  const [editMoment, { loading }] = useMutation<
    AdminEditMomentResponse,
    { id: string; input: AdminUpdateMomentInput }
  >(ADMIN_EDIT_MOMENT, {
    refetchQueries: [{ query: GET_ALL_MOMENTS }],
  });
  return { editMoment, loading };
};

export interface MomentSetting {
  id?: string;
  entity: string;
  allowMomentsShareInFeed: boolean;
  momentsShareInFeedTitle?: string | null;
  momentsShareInFeedDescription?: string | null;
  allowMomentsAiLabel: boolean;
  momentsAiLabelTitle?: string | null;
  momentsAiLabelDescription?: string | null;
  momentsMaxDuration: number;
  momentsUploadTitle?: string | null;
  momentsUploadDescription?: string | null;
  momentsUploadFormat?: string | null;
  momentsUploadCardTitle?: string | null;
  momentsUploadCardDescription?: string | null;
}

export interface GetMomentSettingResponse {
  getMomentSetting: MomentSetting;
}

export interface UpdateMomentSettingResponse {
  updateMomentSetting: MomentSetting;
}

export const useGetMomentSetting = () =>
  useQuery<GetMomentSettingResponse>(GET_MOMENT_SETTING, {
    fetchPolicy: "cache-and-network",
  });

export const useUpdateMomentSetting = () => {
  const [updateMomentSetting, { loading }] = useMutation<
    UpdateMomentSettingResponse,
    { input: Partial<MomentSetting> }
  >(UPDATE_MOMENT_SETTING, {
    refetchQueries: [{ query: GET_MOMENT_SETTING }],
  });
  return [updateMomentSetting, { loading }] as const;
};


export interface MomentHistoryUser {
  id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  headline?: string;
}

export interface MomentHistoryItem {
  id: string;
  action: string;
  admin?: MomentHistoryUser | null;
  targetUser?: MomentHistoryUser | null;
  previousState?: any;
  newState?: any;
  reason?: string | null;
  createdAt: string;
}

export interface MomentHistoryData {
  momentId: string;
  currentAddedBy: "USER" | "ENTITY";
  currentOwner?: MomentHistoryUser | null;
  admin?: MomentHistoryUser | null;
  createdAt?: string;
  items: MomentHistoryItem[];
}

export interface AdminGetMomentHistoryResponse {
  adminGetMomentHistory: MomentHistoryData;
}

export const useAdminGetMomentHistory = (momentId?: string) =>
  useQuery<AdminGetMomentHistoryResponse>(ADMIN_GET_MOMENT_HISTORY, {
    variables: { momentId },
    skip: !momentId,
    fetchPolicy: "network-only",
  });
