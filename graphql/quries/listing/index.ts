import { gql } from "@apollo/client";

const list = `
  id
    addedBy
    entityId
    title
    price
    condition
    status
    sku
    slug
    description
    category
    isApproved
    isExpired
    createdAt
    updatedAt
    tag
    isFeatured
    numberOfViews
    interests
    categories
    location
    verification {
      id
      isVerified
      verificationReason
    }
    media {
      url
    }
    currency
`;
// Query to get listings (with optional status filter)
export const GET_LISTINGS = gql`
  query GetListings($input: GetListingInput!) {
    getListing(input: $input) {
      ${list}
      # Add other fields as needed
    }
  }
`;

// Query to get a single listing by ID
export const GET_LISTING_DETAILS = gql`
  query GetListingDetailsByID($input: GetListingDetailsByIDInput!) {
    getListingDetailsByID(input: $input) {
        ${list}
      # Add other fields as needed
    }
  }
`;

// Mutation to add a new listing
export const ADD_LISTING = gql`
  mutation AddListing($input: ListingInput!) {
    addListing(input: $input) {
        ${list}
    }
  }
`;

// Mutation to edit a listing
export const EDIT_LISTING = gql`
  mutation EditListing($input: EditListingInput!) {
    editListing(input: $input) {
         ${list}
    }
  }
`;

// Mutation to change listing status
export const CHANGE_LISTING_STATUS = gql`
  mutation ChangeListingStatus($input: ChangeListingStatusInput!) {
    changeListingStatus(input: $input) {
      id
      status
      updatedAt
    }
  }
`;
export const CHANGE_LISTING_VERIFICATION = gql`
  mutation changeListingVerification($input: ChangeListingStatusInput!) {
    changeListingVerification(input: $input) {
      id
      status
      updatedAt
    }
  }
`;

export const GET_LISTINGS_STATS = gql`
  query GetListingStats {
    getListingStats {
      totalListings
      listingsDiff
      activeListings
      activePercent
      verifiedListings
      verifiedPercent
      totalViews
      viewsPercent
    }
  }
`;

export const GET_LISTINGS_STATS_BY_ID = gql`
  query GetListingStatsById($input: ListingStatsByIdInput!) {
    getListingStatsById(input: $input) {
      totalListings
      listingsDiff
      activeListings
      activePercent
      verifiedListings
      verifiedPercent
      totalViews
      viewsPercent
    }
  }
`;
