"use client";
import { gql } from "@apollo/client";
import { ADD_LISTING } from "../../queries/marketplace";
import { MutationHookOptions, QueryHookOptions, useMutation, useQuery } from "@apollo/client/react";

// Define the types for your mutation input and result
export type AddListingInput = {
  input: {
    title: string;
    description: string;
    condition: string;
    category: string;
    price: number;
    createdAt: string;
    media: string[];
    location: string;
  };
};

export type AddListingData = {
  addListing: {
    title: string;
    description: string;
    condition: string;
    category: string;
    price: number;
    createdAt: string;
    media: string[];
    location: string;
  };
};

export const useAddListing = (
  options?: MutationHookOptions<AddListingData, AddListingInput>
) => {
  return useMutation<AddListingData, AddListingInput>(ADD_LISTING, options);
};

// 1. Define the GraphQL query
export const GET_ALL_LISTINGS = gql`
  query Listings {
    getAllListing {
      listings {
        details {
          id
          title
          description
          location
          condition
          category
          price
          createdAt
          media
          currency
        }
        isFeatured
        isWishList
        isTrending
        id
        user {
          id
          firstName
          lastName
          avatar
        }
      }
      pagination {
        currentPage
        hasNextPage
        hasPreviousPage
        limit
        totalCount
        totalPages
      }
    }
  }
`;

// 2. Define TypeScript types for the query result
export type ListingDetails = {
  id: string;
  title: string;
  description: string;
  location: string;
  condition: string;
  category: string;
  price: number;
  createdAt: string;
  media: string[];
  currency: string;
};

export type Listing = {
  details: ListingDetails;
  isFeatured: boolean;
  isWishList: boolean;
  isTrending: boolean;
  id: string;
  user: ListingUser | null;
};

export type Pagination = {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
  totalCount: number;
  totalPages: number;
};

export type GetAllListingData = {
  getAllListing: {
    listings: Listing[];
    pagination: Pagination;
  };
};

export type ListingUser = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

// 3. Create a custom hook to use the query
export const useGetAllListings = (
  options?: QueryHookOptions<GetAllListingData, any>
) => {
  return useQuery<GetAllListingData, any>(GET_ALL_LISTINGS, options);
};
