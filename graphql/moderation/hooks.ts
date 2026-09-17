import {
  QueryHookOptions,
  LazyQueryHookOptions,
  MutationHookOptions,
  useQuery,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import {
  PaginatedBannedWordResponse,
  PaginatedBlockedLinkResponse,
  PaginatedContentReportResponse,
  ModerationSettings,
  ModerationStats,
  AiModerationDashboard,
  PaginatedAiModerationLogResponse,
  ReportStatus,
  PaginatedModerationLogResponse,
  PaginatedAiTokenUsageResponse,
  ModerationContentType,
  AiClassification,
  AiModerationSettings,
  AiModerationSettingsInput,
  PaginatedUserStatusTimeline,
  UserStatusEvent,
  UserModerationEvent,
  PaginatedUserModerationTimeline,
  UserModerationSummary,
} from "./types";
import {
  TimeRange,
  DateRangeInput,
} from "../actions/dashbaord/dashboard-quries";
export { TimeRange };
export type { DateRangeInput };

import {
  GET_BANNED_WORDS,
  GET_BLOCKED_LINKS,
  GET_CONTENT_REPORTS,
  GET_MODERATION_SETTINGS,
  GET_MODERATION_STATS,
  GET_AI_MODERATION_DASHBOARD,
  GET_AI_MODERATION_LOGS,
  GET_HISTORY,
  GET_MODERATION_LOGS,
  GET_AI_MODERATION_SETTINGS,
  GET_AI_TOKEN_USAGE,
  GET_USER_STATUS_TIMELINE,
  GET_USER_MODERATION_TIMELINE,
  GET_USER_MODERATION_SUMMARY,
} from "./queries";
import {
  ADD_BANNED_WORD,
  UPDATE_BANNED_WORD,
  DELETE_BANNED_WORD,
  ADD_BLOCKED_LINK,
  UPDATE_BLOCKED_LINK,
  DELETE_BLOCKED_LINK,
  RESOLVE_REPORT,
  DISMISS_REPORT,
  UPDATE_MODERATION_SETTINGS,
  UPDATE_AI_MODERATION_SETTINGS,
} from "./mutations";

// Queries
export function useGetBannedWords(
  variables?: { limit?: number; offset?: number },
  options?: QueryHookOptions<{ getBannedWords: PaginatedBannedWordResponse }>,
) {
  return useQuery<{ getBannedWords: PaginatedBannedWordResponse }>(
    GET_BANNED_WORDS,
    { variables, ...options },
  );
}

export function useGetBlockedLinks(
  variables?: { limit?: number; offset?: number },
  options?: QueryHookOptions<{ getBlockedLinks: PaginatedBlockedLinkResponse }>,
) {
  return useQuery<{ getBlockedLinks: PaginatedBlockedLinkResponse }>(
    GET_BLOCKED_LINKS,
    { variables, ...options },
  );
}

export function useGetContentReports(
  variables?: {
    status?: ReportStatus;
    contentType?: ModerationContentType;
    limit?: number;
    offset?: number;
  },
  options?: QueryHookOptions<{ getContentReports: PaginatedContentReportResponse }>,
) {
  return useQuery<{ getContentReports: PaginatedContentReportResponse }>(
    GET_CONTENT_REPORTS,
    { variables, ...options },
  );
}

export function useGetModerationSettings(
  options?: QueryHookOptions<{ getModerationSettings: ModerationSettings }>,
) {
  return useQuery<{ getModerationSettings: ModerationSettings }>(
    GET_MODERATION_SETTINGS,
    options,
  );
}

export function useGetModerationStats(
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
  options?: QueryHookOptions<{ getModerationStats: ModerationStats }>,
) {
  return useQuery<{ getModerationStats: ModerationStats }>(
    GET_MODERATION_STATS,
    { variables: { timeRange, dateRange }, ...options },
  );
}

export function useGetAiModerationDashboard(
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
  options?: QueryHookOptions<{
    getAiModerationDashboard: AiModerationDashboard;
  }>,
) {
  return useQuery<{ getAiModerationDashboard: AiModerationDashboard }>(
    GET_AI_MODERATION_DASHBOARD,
    { variables: { timeRange, dateRange }, ...options },
  );
}

export function useGetAiModerationLogs(
  variables?: { limit?: number; offset?: number },
  options?: QueryHookOptions<{
    getAiModerationLogs: PaginatedAiModerationLogResponse;
  }>,
) {
  return useQuery<{ getAiModerationLogs: PaginatedAiModerationLogResponse }>(
    GET_AI_MODERATION_LOGS,
    { variables, ...options },
  );
}

export function useGetHistory(
  variables?: {
    limit?: number;
    offset?: number;
    contentType?: ModerationContentType;
    userId?: string;
    aiLabel?: AiClassification;
  },
  options?: QueryHookOptions<{
    getModerationLogs: PaginatedModerationLogResponse;
    getAiTokenUsage: PaginatedAiTokenUsageResponse;
  }>,
) {
  return useQuery<{
    getModerationLogs: PaginatedModerationLogResponse;
    getAiTokenUsage: PaginatedAiTokenUsageResponse;
  }>(GET_HISTORY, { variables, ...options });
}

export function useGetModerationLogs(
  variables?: {
    limit?: number;
    offset?: number;
    contentType?: ModerationContentType;
    userId?: string;
    aiLabel?: AiClassification;
  },
  options?: QueryHookOptions<{
    getModerationLogs: PaginatedModerationLogResponse;
  }>,
) {
  return useQuery<{ getModerationLogs: PaginatedModerationLogResponse }>(
    GET_MODERATION_LOGS,
    { variables, ...options },
  );
}

// Mutations
export function useAddBannedWord(options?: MutationHookOptions) {
  return useMutation(ADD_BANNED_WORD, {
    refetchQueries: [
      { query: GET_BANNED_WORDS },
      { query: GET_MODERATION_STATS },
    ],
    ...options,
  });
}

export function useUpdateBannedWord(options?: MutationHookOptions) {
  return useMutation(UPDATE_BANNED_WORD, {
    refetchQueries: [{ query: GET_BANNED_WORDS }],
    ...options,
  });
}

export function useDeleteBannedWord(options?: MutationHookOptions) {
  return useMutation(DELETE_BANNED_WORD, {
    refetchQueries: [
      { query: GET_BANNED_WORDS },
      { query: GET_MODERATION_STATS },
    ],
    ...options,
  });
}

export function useAddBlockedLink(options?: MutationHookOptions) {
  return useMutation(ADD_BLOCKED_LINK, {
    refetchQueries: [
      { query: GET_BLOCKED_LINKS },
      { query: GET_MODERATION_STATS },
    ],
    ...options,
  });
}

export function useUpdateBlockedLink(options?: MutationHookOptions) {
  return useMutation(UPDATE_BLOCKED_LINK, {
    refetchQueries: [{ query: GET_BLOCKED_LINKS }],
    ...options,
  });
}

export function useDeleteBlockedLink(options?: MutationHookOptions) {
  return useMutation(DELETE_BLOCKED_LINK, {
    refetchQueries: [
      { query: GET_BLOCKED_LINKS },
      { query: GET_MODERATION_STATS },
    ],
    ...options,
  });
}

export function useResolveReport(options?: MutationHookOptions) {
  return useMutation(RESOLVE_REPORT, {
    refetchQueries: [
      { query: GET_CONTENT_REPORTS },
      { query: GET_MODERATION_STATS },
    ],
    ...options,
  });
}

export function useDismissReport(options?: MutationHookOptions) {
  return useMutation(DISMISS_REPORT, {
    refetchQueries: [
      { query: GET_CONTENT_REPORTS },
      { query: GET_MODERATION_STATS },
    ],
    ...options,
  });
}

export function useUpdateModerationSettings(options?: MutationHookOptions) {
  return useMutation(UPDATE_MODERATION_SETTINGS, {
    refetchQueries: [{ query: GET_MODERATION_SETTINGS }],
    ...options,
  });
}

export function useGetAiModerationSettings(
  options?: QueryHookOptions<{ getAiModerationSettings: AiModerationSettings }>
) {
  return useQuery<{ getAiModerationSettings: AiModerationSettings }>(
    GET_AI_MODERATION_SETTINGS,
    options
  );
}

export function useUpdateAiModerationSettings(
  options?: MutationHookOptions<
    { updateAiModerationSettings: AiModerationSettings },
    { input: AiModerationSettingsInput }
  >
) {
  return useMutation<
    { updateAiModerationSettings: AiModerationSettings },
    { input: AiModerationSettingsInput }
  >(UPDATE_AI_MODERATION_SETTINGS, {
    refetchQueries: [{ query: GET_AI_MODERATION_SETTINGS }],
    ...options,
  });
}

export function useGetAiTokenUsage(
  variables?: { limit?: number; offset?: number },
  options?: QueryHookOptions<{ getAiTokenUsage: PaginatedAiTokenUsageResponse }>
) {
  return useQuery<{ getAiTokenUsage: PaginatedAiTokenUsageResponse }>(
    GET_AI_TOKEN_USAGE,
    { variables, ...options }
  );
}

export function useGetUserStatusTimeline(
  variables?: { userId: string; limit?: number; offset?: number },
  options?: QueryHookOptions<
    { getUserStatusTimeline: PaginatedUserStatusTimeline },
    { userId: string; limit?: number; offset?: number }
  >
) {
  return useQuery<
    { getUserStatusTimeline: PaginatedUserStatusTimeline },
    { userId: string; limit?: number; offset?: number }
  >(GET_USER_STATUS_TIMELINE, { variables, ...options });
}

export function useLazyGetUserStatusTimeline(
  options?: LazyQueryHookOptions<
    { getUserStatusTimeline: PaginatedUserStatusTimeline },
    { userId: string; limit?: number; offset?: number }
  >
) {
  return useLazyQuery<
    { getUserStatusTimeline: PaginatedUserStatusTimeline },
    { userId: string; limit?: number; offset?: number }
  >(GET_USER_STATUS_TIMELINE, options);
}

export interface GetUserModerationTimelineVariables {
  userId: string;
  limit?: number;
  offset?: number;
  decision?: string;
  contentType?: ModerationContentType;
}

export function useGetUserModerationTimeline(
  variables?: GetUserModerationTimelineVariables,
  options?: QueryHookOptions<
    { getUserModerationTimeline: PaginatedUserModerationTimeline },
    GetUserModerationTimelineVariables
  >
) {
  return useQuery<
    { getUserModerationTimeline: PaginatedUserModerationTimeline },
    GetUserModerationTimelineVariables
  >(GET_USER_MODERATION_TIMELINE, { variables, ...options });
}

export function useLazyGetUserModerationTimeline(
  options?: LazyQueryHookOptions<
    { getUserModerationTimeline: PaginatedUserModerationTimeline },
    GetUserModerationTimelineVariables
  >
) {
  return useLazyQuery<
    { getUserModerationTimeline: PaginatedUserModerationTimeline },
    GetUserModerationTimelineVariables
  >(GET_USER_MODERATION_TIMELINE, options);
}

export function useGetUserModerationSummary(
  variables?: { userId: string },
  options?: QueryHookOptions<
    { getUserModerationSummary: UserModerationSummary },
    { userId: string }
  >
) {
  return useQuery<
    { getUserModerationSummary: UserModerationSummary },
    { userId: string }
  >(GET_USER_MODERATION_SUMMARY, { variables, ...options });
}


