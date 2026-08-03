import { QueryHookOptions, useQuery } from "@apollo/client/react";
import {
  GET_SPONSORS,
  GET_SPONSOR,
  GET_SPONSOR_CATEGORIES,
} from "../../queries/sponsors";

export interface Sponsor {
  id: string;
  title: string;
  image: string | null;
  description: string | null;
  externalUrl: string | null;
  displayOrder: number;
  entityId?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useGetSponsors = (
  options?: QueryHookOptions<{ getSponsors: Sponsor[] }, any>,
) => useQuery<{ getSponsors: Sponsor[] }, any>(GET_SPONSORS, options);

export const useGetSponsor = (
  options?: QueryHookOptions<{ getSponsor: Sponsor }, { getSponsorId: string }>,
) =>
  useQuery<{ getSponsor: Sponsor }, { getSponsorId: string }>(
    GET_SPONSOR,
    options,
  );

export interface SponsorCategory {
  id: string;
  title: string;
  displayOrder: number;
  entityId: string;
  createdAt: string;
  updatedAt: string;
  sponsors: Partial<Sponsor>[];
}

export const useGetSponsorCategories = (
  options?: QueryHookOptions<{ getSponsorCategories: SponsorCategory[] }, any>,
) =>
  useQuery<{ getSponsorCategories: SponsorCategory[] }, any>(
    GET_SPONSOR_CATEGORIES,
    options,
  );
