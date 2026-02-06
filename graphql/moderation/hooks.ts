import {
  QueryHookOptions,
  MutationHookOptions,
  useQuery,
  useMutation,
} from "@apollo/client";
import {
  PaginatedBannedWordResponse,
  PaginatedBlockedLinkResponse,
  PaginatedContentReportResponse,
  ModerationSettings,
  ModerationStats,
  ReportStatus,
} from "./types";
import {
  GET_BANNED_WORDS,
  GET_BLOCKED_LINKS,
  GET_CONTENT_REPORTS,
  GET_MODERATION_SETTINGS,
  GET_MODERATION_STATS,
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
    contentType?: string;
    limit?: number;
    offset?: number;
  },
  options?: QueryHookOptions<
    { getContentReports: PaginatedContentReportResponse },
    {
      status?: ReportStatus;
      contentType?: string;
      limit?: number;
      offset?: number;
    }
  >,
) {
  return useQuery<
    { getContentReports: PaginatedContentReportResponse },
    {
      status?: ReportStatus;
      contentType?: string;
      limit?: number;
      offset?: number;
    }
  >(GET_CONTENT_REPORTS, { variables, ...options });
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
  options?: QueryHookOptions<{ getModerationStats: ModerationStats }>,
) {
  return useQuery<{ getModerationStats: ModerationStats }>(
    GET_MODERATION_STATS,
    options,
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
