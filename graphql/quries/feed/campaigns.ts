import { gql } from "@apollo/client";

export const GET_FEED_CAMPAIGNS = gql`
  query GetFeedCampaigns(
    $pagination: PaginationInput
    $status: String
    $search: String
  ) {
    getFeedCampaigns(
      pagination: $pagination
      status: $status
      search: $search
    ) {
      data {
        id
        entityId
        title
        slug
        description
        status
        frameUrl
        frameMetadata {
          width
          height
        }
        placements
        aspectRatio
        festiveImageUrl
        ctaButtonText
        ctaBgColor
        ctaTextColor
        isFilterActive
        allowCameraRecording
        allowFileUpload
        totalPosts
        startDate
        endDate
        createdAt
        updatedAt
      }
      meta {
        currentPage
        totalPages
        totalItems
        hasNextPage
      }
      stats {
        totalCampaigns
        activeCampaigns
        totalPosts
      }
    }
  }
`;

export const GET_FEED_CAMPAIGN_BY_ID = gql`
  query GetFeedCampaignById($id: ID!) {
    getFeedCampaignById(id: $id) {
      id
      entityId
      title
      slug
      description
      status
      frameUrl
      frameMetadata {
        width
        height
      }
      placements
      aspectRatio
      festiveImageUrl
      ctaButtonText
      ctaBgColor
      ctaTextColor
      isFilterActive
      allowCameraRecording
      allowFileUpload
      totalPosts
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export const ADMIN_CREATE_FEED_CAMPAIGN = gql`
  mutation AdminCreateFeedCampaign($input: AdminCreateFeedCampaignInput!) {
    adminCreateFeedCampaign(input: $input) {
      id
      entityId
      title
      slug
      description
      status
      frameUrl
      frameMetadata {
        width
        height
      }
      placements
      aspectRatio
      festiveImageUrl
      ctaButtonText
      ctaBgColor
      ctaTextColor
      isFilterActive
      allowCameraRecording
      allowFileUpload
      totalPosts
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export const ADMIN_UPDATE_FEED_CAMPAIGN = gql`
  mutation AdminUpdateFeedCampaign(
    $id: ID!
    $input: AdminUpdateFeedCampaignInput!
  ) {
    adminUpdateFeedCampaign(id: $id, input: $input) {
      id
      entityId
      title
      slug
      description
      status
      frameUrl
      frameMetadata {
        width
        height
      }
      placements
      aspectRatio
      festiveImageUrl
      ctaButtonText
      ctaBgColor
      ctaTextColor
      isFilterActive
      allowCameraRecording
      allowFileUpload
      totalPosts
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export const ADMIN_DELETE_FEED_CAMPAIGN = gql`
  mutation AdminDeleteFeedCampaign($id: ID!) {
    adminDeleteFeedCampaign(id: $id)
  }
`;

export const GENERATE_FEED_CAMPAIGN_ASSET_UPLOAD_URL = gql`
  mutation GenerateFeedCampaignAssetUploadUrl(
    $input: GenerateFeedCampaignAssetUploadInput!
  ) {
    generateFeedCampaignAssetUploadUrl(input: $input) {
      uploadUrl
      fileUrl
      key
      expiresIn
    }
  }
`;

export const GET_ACTIVE_USER_FEED_CAMPAIGNS = gql`
  query GetActiveUserFeedCampaigns($placement: String) {
    getActiveUserFeedCampaigns(placement: $placement) {
      id
      entityId
      title
      slug
      description
      status
      frameUrl
      frameMetadata {
        width
        height
      }
      placements
      aspectRatio
      festiveImageUrl
      ctaButtonText
      ctaBgColor
      ctaTextColor
      isFilterActive
      allowCameraRecording
      allowFileUpload
      totalPosts
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;
