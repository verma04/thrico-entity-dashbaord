"use client";
import { gql } from "@apollo/client";
import { QueryHookOptions, useQuery } from "@apollo/client/react";

// Get Seller Received Enquiries Query
export const GET_SELLER_RECEIVED_ENQUIRIES = gql`
  query GetSellerReceivedEnquiries($input: PaginationInput) {
    getSellerReceivedEnquiries(input: $input) {
      edges {
        cursor
        node {
          id
          createdAt
          listing {
            id
            title
            price
            currency
            media
          }
          seller {
            id
            firstName
            lastName
            avatar
          }
          buyer {
            id
            firstName
            lastName
            avatar
          }
          message {
            id
            content
            createdAt
            isRead
          }
          conversation {
            id
            lastMessageAt
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

// Create custom hook for Get Seller Received Enquiries
export const useGetSellerReceivedEnquiries = (
  options?: QueryHookOptions<
    GetSellerReceivedEnquiriesData,
    GetSellerReceivedEnquiriesInput
  >,
) => {
  return useQuery<
    GetSellerReceivedEnquiriesData,
    GetSellerReceivedEnquiriesInput
  >(GET_SELLER_RECEIVED_ENQUIRIES, options);
};
// Map View All Listings Query
export const MAP_VIEW_ALL_LISTINGS = gql`
  query MapViewAllListings($input: ListingCursorInput) {
    mapViewAllListings(input: $input) {
      edges {
        cursor
        node {
          id
          title
          price
          location
          latitude
          longitude
          media
          isApproved
          isExpired
          isSold
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

export const useMapViewAllListings = (options?: QueryHookOptions<any, any>) => {
  return useQuery(MAP_VIEW_ALL_LISTINGS, options);
};

// Query: GetListingEnquiryStats
export const GET_LISTING_ENQUIRY_STATS = gql`
  query GetListingEnquiryStats($listingId: ID!) {
    getListingEnquiryStats(listingId: $listingId) {
      totalEnquiries
      uniqueBuyers
      unreadEnquiries
    }
  }
`;

export function useGetListingEnquiryStats(listingId: string) {
  return useQuery<GetListingEnquiryStatsData>(GET_LISTING_ENQUIRY_STATS, {
    variables: { listingId },
    fetchPolicy: "cache-and-network",
  });
}
import type {
  GetAllListingData,
  GetAllListingInput,
  GetUserListingEnquiriesData,
  PaginationInput,
  HasContactedSellerInput,
  HasContactedSellerData,
  GetListingConversationMessagesInput,
  GetListingConversationMessagesData,
  GetMyListingsInput,
  GetMyListingsData,
  ListingStatus,
  Listing,
  GetListingStatusInput,
  GetListingStatusData,
  GetListingByIdInput,
  GetListingDetailsByIdData,
  GetRelatedListingsInput,
  GetRelatedListingsData,
  GetUserListingsInput,
  GetUserListingsData,
  GetListingEnquiriesInput,
  GetUserListingEnquiriesInput,
  GetSellerReceivedEnquiriesInput,
  GetSellerReceivedEnquiriesData,
  GetListingStatsData,
  GetListingEnquiryStatsData,
} from "./types";

export type { Listing, ListingStatus } from "./types";

// Get All Listings Query
export const GET_ALL_LISTINGS = gql`
  query GetAllListing($input: ListingCursorInput) {
    getAllListing(input: $input) {
      edges {
        cursor
        node {
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
          id
          isFeatured
          isWishList
          isTrending
          isSold
          seller {
            id
            firstName
            lastName
            avatar
            email
            cover
          }
          sellerRating {
            averageRating
            ratingDistribution
            totalRatings
          }
          numberOfViews
          numberOfContactClick
          isOwner
          canReport
          canDelete
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

// 3. Create a custom hook to use the query
export const useGetAllListings = (
  options?: QueryHookOptions<GetAllListingData, GetAllListingInput>,
) => {
  return useQuery<GetAllListingData, GetAllListingInput>(
    GET_ALL_LISTINGS,
    options,
  );
};

// Get User Listing Enquiries Query
export const GET_USER_LISTING_ENQUIRIES = gql`
  query GetUserListingEnquiries($input: PaginationInput) {
    getUserListingEnquiries(input: $input) {
      edges {
        cursor
        node {
          id
          createdAt
          listing {
            id
            title
            price
            currency
            media
            category
            condition
            location
          }
          seller {
            id
            firstName
            lastName
            avatar
          }
          buyer {
            id
            firstName
            lastName
            avatar
          }
          message {
            id
            content
            createdAt
            isRead
          }
          conversation {
            id
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

// Create custom hook for Get User Listing Enquiries
export const useGetUserListingEnquiries = (
  options?: QueryHookOptions<
    GetUserListingEnquiriesData,
    GetUserListingEnquiriesInput
  >,
) => {
  return useQuery<GetUserListingEnquiriesData, GetUserListingEnquiriesInput>(
    GET_USER_LISTING_ENQUIRIES,
    options,
  );
};

// Has Contacted Seller Query
export const HAS_CONTACTED_SELLER = gql`
  query HasContactedSeller($listingId: ID!) {
    hasContactedSeller(listingId: $listingId) {
      hasContacted
    }
  }
`;

// Create custom hook for Has Contacted Seller
export const useHasContactedSeller = (
  options?: QueryHookOptions<HasContactedSellerData, HasContactedSellerInput>,
) => {
  return useQuery<HasContactedSellerData, HasContactedSellerInput>(
    HAS_CONTACTED_SELLER,
    options,
  );
};

// Get Listing Conversation Messages Query
export const GET_LISTING_CONVERSATION_MESSAGES = gql`
  query GetListingConversationMessages(
    $conversationId: ID!
    $input: PaginationInput
  ) {
    getListingConversationMessages(
      conversationId: $conversationId
      input: $input
    ) {
      edges {
        cursor
        node {
          id
          content
          createdAt
          isRead
          readAt
          sender {
            id
            avatar
            firstName
            lastName
          }
          isMine
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

// Create custom hook for Get Listing Conversation Messages
export const useGetListingConversationMessages = (
  options?: QueryHookOptions<
    GetListingConversationMessagesData,
    GetListingConversationMessagesInput
  >,
) => {
  return useQuery<
    GetListingConversationMessagesData,
    GetListingConversationMessagesInput
  >(GET_LISTING_CONVERSATION_MESSAGES, options);
};

// Get My Listings Query
export const GET_MY_LISTINGS = gql`
  query GetMyListings($input: ListingCursorInput) {
    getMyListings(input: $input) {
      edges {
        cursor
        node {
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
          id
          isFeatured
          isWishList
          isTrending
          isSold
          status
          seller {
            id
            firstName
            lastName
            avatar
            email
            cover
          }
          sellerRating {
            averageRating
            ratingDistribution
            totalRatings
          }
          numberOfViews
          numberOfContactClick
          isOwner
          canReport
          canDelete
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

export const useGetMyListings = (
  options?: QueryHookOptions<GetMyListingsData, GetMyListingsInput>,
) => {
  return useQuery<GetMyListingsData, GetMyListingsInput>(
    GET_MY_LISTINGS,
    options,
  );
};

// Get Listing Status Query
export const GET_LISTING_STATUS = gql`
  query GetListingStatus($listingId: ID!) {
    getListingStatus(listingId: $listingId) {
      isSold
    }
  }
`;

export const useGetListingStatus = (
  options?: QueryHookOptions<GetListingStatusData, GetListingStatusInput>,
) => {
  return useQuery<GetListingStatusData, GetListingStatusInput>(
    GET_LISTING_STATUS,
    options,
  );
};

// Get Listing Details By ID Query
export const GET_LISTING_DETAILS_BY_ID = gql`
  query GetListingDetailsById($input: GetListingByIdInput!) {
    getListingDetailsById(input: $input) {
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
      id
      isFeatured
      isSold
      isTrending
      user {
        id
        lastName
        firstName
        avatar
      }
      numberOfViews
      numberOfContactClick
      sellerRating {
        averageRating
        totalRatings
        ratingDistribution
      }
      isOwner
      canDelete
      canReport
      verification {
        id
        isVerified
        verifiedBy
        isVerifiedAt
        verificationReason
      }
    }
  }
`;

export const useGetListingDetailsById = (
  options?: QueryHookOptions<GetListingDetailsByIdData, GetListingByIdInput>,
) => {
  return useQuery<GetListingDetailsByIdData, GetListingByIdInput>(
    GET_LISTING_DETAILS_BY_ID,
    options,
  );
};

// Get Related Listings Query
export const GET_RELATED_LISTINGS = gql`
  query GetRelatedListings($input: GetRelatedListingsInput!) {
    getRelatedListingsByListingId(input: $input) {
      edges {
        cursor
        node {
          id
          isSold
          details {
            title
            price
            currency
            media
            category
          }
          sellerRating {
            averageRating
            totalRatings
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

export const useGetRelatedListings = (
  options?: QueryHookOptions<GetRelatedListingsData, GetRelatedListingsInput>,
) => {
  return useQuery<GetRelatedListingsData, GetRelatedListingsInput>(
    GET_RELATED_LISTINGS,
    options,
  );
};

// Get User Listings Query
export const GET_USER_LISTINGS = gql`
  query GetUserListings($input: GetUserListingsInput!) {
    getListingsByUserId(input: $input) {
      edges {
        cursor
        node {
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
          id
          isFeatured
          isWishList
          isTrending
          isSold
          seller {
            id
            firstName
            lastName
            avatar
            email
            cover
          }

          numberOfViews
          numberOfContactClick
          isOwner
          canReport
          canDelete
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
      seller {
        id
        firstName
        lastName
        avatar
        email
        cover
      }
      sellerRating {
        averageRating
        ratingDistribution
        totalRatings
      }
    }
  }
`;

export const useGetUserListings = (
  options?: QueryHookOptions<GetUserListingsData, GetUserListingsInput>,
) => {
  return useQuery<GetUserListingsData, GetUserListingsInput>(
    GET_USER_LISTINGS,
    options,
  );
};

// Get Listing Enquiries Query
export const GET_LISTING_ENQUIRIES = gql`
  query GetListingEnquiries($input: GetListingEnquiriesInput!) {
    getListingEnquiries(input: $input) {
      edges {
        cursor
        node {
          id
          createdAt
          listing {
            id
            title
            price
            currency
            media
          }
          seller {
            id
            firstName
            lastName
            avatar
          }
          buyer {
            id
            firstName
            lastName
            avatar
          }
          message {
            id
            content
            createdAt
            isRead
          }
          conversation {
            id
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

export const useGetListingEnquiries = (
  options?: QueryHookOptions<any, GetListingEnquiriesInput>,
) => {
  return useQuery<any, GetListingEnquiriesInput>(
    GET_LISTING_ENQUIRIES,
    options,
  );
};

// Get Listing Stats Query
export const GET_LISTING_STATS = gql`
  query GetListingStats {
    getListingStats {
      totalListings
      newToday
      yourEnquiry
      savedListings
      popularCategories {
        count
        name
      }
    }
  }
`;

export const useGetListingStats = (
  options?: QueryHookOptions<GetListingStatsData>,
) => {
  return useQuery<GetListingStatsData>(GET_LISTING_STATS, options);
};
