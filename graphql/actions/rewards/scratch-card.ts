import { useMutation, useQuery } from "@apollo/client";
import {
  GET_SCRATCH_CONFIG,
  GET_SCRATCH_PRIZES,
  GET_SCRATCH_PLAYS,
} from "../../quries/rewards/scratch-card/queries";
import {
  UPSERT_SCRATCH_CONFIG,
  CREATE_SCRATCH_PRIZE,
  UPDATE_SCRATCH_PRIZE,
  DELETE_SCRATCH_PRIZE,
} from "../../quries/rewards/scratch-card/mutations";

export const useGetScratchCardConfig = () => useQuery(GET_SCRATCH_CONFIG);

export const useGetScratchCardPrizes = () => useQuery(GET_SCRATCH_PRIZES);

export const useUpdateScratchCardConfig = (options?: any) =>
  useMutation(UPSERT_SCRATCH_CONFIG, {
    ...options,
    refetchQueries: [{ query: GET_SCRATCH_CONFIG }],
  });

export const useCreateScratchCardPrize = (options?: any) =>
  useMutation(CREATE_SCRATCH_PRIZE, {
    ...options,
    refetchQueries: [
      { query: GET_SCRATCH_CONFIG },
      { query: GET_SCRATCH_PRIZES },
    ],
  });

export const useUpdateScratchCardPrize = (options?: any) =>
  useMutation(UPDATE_SCRATCH_PRIZE, {
    ...options,
    refetchQueries: [
      { query: GET_SCRATCH_CONFIG },
      { query: GET_SCRATCH_PRIZES },
    ],
  });

export const useDeleteScratchCardPrize = (options?: any) =>
  useMutation(DELETE_SCRATCH_PRIZE, {
    ...options,
    refetchQueries: [
      { query: GET_SCRATCH_CONFIG },
      { query: GET_SCRATCH_PRIZES },
    ],
  });

export const useGetScratchActivity = (variables?: {
  pagination?: { page: number; limit: number };
}) => useQuery(GET_SCRATCH_PLAYS, { variables });
