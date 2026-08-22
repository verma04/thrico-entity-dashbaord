import { useMutation, useQuery } from "@apollo/client";
import {
  GET_MATCH_WIN_CONFIG,
  GET_MATCH_WIN_DATA,
  GET_MATCH_WIN_COMBINATION,
  GET_MATCH_WIN_PLAYS,
} from "../../quries/rewards/match-win/queries";
import {
  UPSERT_MATCH_WIN_CONFIG,
  UPSERT_MATCH_WIN_SYMBOL,
  DELETE_MATCH_WIN_SYMBOL,
  CREATE_MATCH_WIN_COMBINATION,
  UPDATE_MATCH_WIN_COMBINATION,
  UPSERT_MATCH_WIN_COMBINATION,
  DELETE_MATCH_WIN_COMBINATION,
  INITIALIZE_MATCH_WIN_CONFIG,
} from "../../quries/rewards/match-win/mutations";
import { GET_SPIN_SCRATCH_STATS } from "../../quries/rewards/stats";

export const useGetMatchWinConfig = () => useQuery(GET_MATCH_WIN_CONFIG);

export const useGetMatchWinData = () => useQuery(GET_MATCH_WIN_DATA);

export const useGetMatchWinCombination = (id: string, options?: any) =>
  useQuery(GET_MATCH_WIN_COMBINATION, {
    variables: { id },
    skip: !id,
    ...options,
  });

export const useGetMatchWinPlays = (variables?: {
  pagination?: { page: number; limit: number };
}) => useQuery(GET_MATCH_WIN_PLAYS, { variables });

export const useUpdateMatchWinConfig = (options?: any) =>
  useMutation(UPSERT_MATCH_WIN_CONFIG, {
    ...options,
    refetchQueries: [
      { query: GET_MATCH_WIN_CONFIG },
      { query: GET_MATCH_WIN_DATA },
      { query: GET_SPIN_SCRATCH_STATS },
    ],
  });

export const useUpdateMatchWinSymbol = (options?: any) =>
  useMutation(UPSERT_MATCH_WIN_SYMBOL, {
    ...options,
    refetchQueries: [
      { query: GET_MATCH_WIN_DATA },
      { query: GET_SPIN_SCRATCH_STATS },
      { query: GET_MATCH_WIN_CONFIG },
    ],
  });

export const useDeleteMatchWinSymbol = (options?: any) =>
  useMutation(DELETE_MATCH_WIN_SYMBOL, {
    ...options,
    refetchQueries: [
      { query: GET_MATCH_WIN_DATA },
      { query: GET_SPIN_SCRATCH_STATS },
      { query: GET_MATCH_WIN_CONFIG },
    ],
  });

export const useCreateMatchWinCombination = (options?: any) =>
  useMutation(CREATE_MATCH_WIN_COMBINATION, {
    ...options,
    refetchQueries: [
      { query: GET_MATCH_WIN_DATA },
      { query: GET_SPIN_SCRATCH_STATS },
      { query: GET_MATCH_WIN_CONFIG },
    ],
  });

export const useUpdateMatchWinCombination = (options?: any) =>
  useMutation(UPDATE_MATCH_WIN_COMBINATION, {
    ...options,
    refetchQueries: [
      { query: GET_MATCH_WIN_DATA },
      { query: GET_SPIN_SCRATCH_STATS },
      { query: GET_MATCH_WIN_CONFIG },
    ],
  });

export const useUpsertMatchWinCombination = (options?: any) =>
  useMutation(UPSERT_MATCH_WIN_COMBINATION, {
    ...options,
    refetchQueries: [
      { query: GET_MATCH_WIN_DATA },
      { query: GET_SPIN_SCRATCH_STATS },
      { query: GET_MATCH_WIN_CONFIG },
    ],
  });

export const useDeleteMatchWinCombination = (options?: any) =>
  useMutation(DELETE_MATCH_WIN_COMBINATION, {
    ...options,
    refetchQueries: [
      { query: GET_MATCH_WIN_DATA },
      { query: GET_SPIN_SCRATCH_STATS },
      { query: GET_MATCH_WIN_CONFIG },
    ],
  });

export const useInitializeMatchWinConfig = (options?: any) =>
  useMutation(INITIALIZE_MATCH_WIN_CONFIG, {
    ...options,
    refetchQueries: [
      { query: GET_MATCH_WIN_CONFIG },
      { query: GET_MATCH_WIN_DATA },
      { query: GET_SPIN_SCRATCH_STATS },
    ],
  });
