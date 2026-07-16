import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_MOMENTS, GET_MOMENT_DETAILS, GET_MOMENT_DASHBOARD_KPIs, ADMIN_DELETE_MOMENT, ADMIN_GENERATE_MOMENT_UPLOAD_URL, ADMIN_CONFIRM_MOMENT_UPLOAD } from "../../quries/moments";
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

export const useAdminConfirmMomentUpload = (options?: any) => {
  const [confirmUpload, { loading }] = useMutation(ADMIN_CONFIRM_MOMENT_UPLOAD, {
    refetchQueries: [{ query: GET_ALL_MOMENTS }],
    ...options,
  });
  return [confirmUpload, { loading }] as const;
};
