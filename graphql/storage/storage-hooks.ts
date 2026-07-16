import { useQuery } from "@apollo/client";
import { GET_STORAGE_STATS, GET_STORAGE_SUMMARY } from "./storage-queries";

export const useGetStorageStats = () => {
  return useQuery(GET_STORAGE_STATS);
};

export const useGetStorageSummary = () => {
  return useQuery(GET_STORAGE_SUMMARY);
};
