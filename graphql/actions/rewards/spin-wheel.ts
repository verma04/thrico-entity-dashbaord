import { useMutation, useQuery } from "@apollo/client";
import {
  GET_SPIN_WHEEL_CONFIG,
  GET_SPIN_WHEEL_PRIZES,
  GET_SPIN_WHEEL_PLAYS,
} from "../../quries/rewards/spin-wheel/queries";
import {
  UPSERT_SPIN_WHEEL_CONFIG,
  CREATE_SPIN_WHEEL_PRIZE,
  UPDATE_SPIN_WHEEL_PRIZE,
  DELETE_SPIN_WHEEL_PRIZE,
} from "../../quries/rewards/spin-wheel/mutations";

export const useGetSpinWheelConfig = () => useQuery(GET_SPIN_WHEEL_CONFIG);

export const useGetSpinWheelPrizes = () => useQuery(GET_SPIN_WHEEL_PRIZES);

export const useUpdateSpinWheelConfig = (options?: any) =>
  useMutation(UPSERT_SPIN_WHEEL_CONFIG, {
    ...options,
    refetchQueries: [{ query: GET_SPIN_WHEEL_CONFIG }],
  });

export const useCreateSpinWheelPrize = (options?: any) =>
  useMutation(CREATE_SPIN_WHEEL_PRIZE, {
    ...options,
    refetchQueries: [
      { query: GET_SPIN_WHEEL_CONFIG },
      { query: GET_SPIN_WHEEL_PRIZES },
    ],
  });

export const useUpdateSpinWheelPrize = (options?: any) =>
  useMutation(UPDATE_SPIN_WHEEL_PRIZE, {
    ...options,
    refetchQueries: [
      { query: GET_SPIN_WHEEL_CONFIG },
      { query: GET_SPIN_WHEEL_PRIZES },
    ],
  });

export const useDeleteSpinWheelPrize = (options?: any) =>
  useMutation(DELETE_SPIN_WHEEL_PRIZE, {
    ...options,
    refetchQueries: [
      { query: GET_SPIN_WHEEL_CONFIG },
      { query: GET_SPIN_WHEEL_PRIZES },
    ],
  });

export const useGetSpinActivity = (variables?: {
  pagination?: { page: number; limit: number };
}) => useQuery(GET_SPIN_WHEEL_PLAYS, { variables });
