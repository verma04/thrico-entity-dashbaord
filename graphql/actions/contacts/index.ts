import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_CONTACTS, GET_CONTACT_STATS, UPDATE_CONTACT_STATUS } from "../../quries";

export type ContactStatus = "PENDING" | "RESOLVED" | "IN_PROGRESS";

export interface Contact {
  id: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  user: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
    };
  };
}

export interface GetAllContactsResponse {
  getAllContacts: {
    nodes: Contact[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

export interface GetContactStatsResponse {
  getContactStats: {
    totalInquiries: number;
    resolvedInquiries: number;
    responseRate: string;
    peakFrequency: string;
  };
}

export const useGetAllContacts = (variables?: { limit?: number }) =>
  useQuery<GetAllContactsResponse>(GET_ALL_CONTACTS, {
    variables,
  });

export const useGetContactStats = () =>
  useQuery<GetContactStatsResponse>(GET_CONTACT_STATS);

export const useUpdateContactStatus = (options?: any) =>
  useMutation(UPDATE_CONTACT_STATUS, {
    ...options,
    refetchQueries: [{ query: GET_ALL_CONTACTS }, { query: GET_CONTACT_STATS }],
    awaitRefetchQueries: true,
  });
