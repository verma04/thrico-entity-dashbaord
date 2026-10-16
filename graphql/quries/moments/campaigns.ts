import { gql } from "@apollo/client";

export const GET_MOMENT_CAMPAIGNS = gql`
  query GetMomentCampaigns(
    $pagination: PaginationInput
    $status: String
    $search: String
  ) {
    getMomentCampaigns(
      pagination: $pagination
      status: $status
      search: $search
    ) {
      data {
        id
        title
        slug
        description
        status
        frameUrl
        frameMetadata {
          width
          height
        }
        introMomentId
        introVideoUrl
        outroMomentId
        outroVideoUrl
        aspectRatio
        fitMode
        minUserDurationSeconds
        maxUserDurationSeconds
        festiveImageUrl
        ctaButtonText
        ctaBgColor
        ctaTextColor
        isFilterActive
        allowCameraRecording
        allowFileUpload
        autoPublishMoment
        shareInFeed
        totalCompositions
        startDate
        endDate
        createdAt
        updatedAt
        introMoment {
          id
          caption
          thumbnailUrl
          videoUrl
        }
        outroMoment {
          id
          caption
          thumbnailUrl
          videoUrl
        }
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
        totalCompositions
        totalDownloads
      }
    }
  }
`;

export const GET_MOMENT_CAMPAIGN_BY_ID = gql`
  query GetMomentCampaignById($id: ID!) {
    getMomentCampaignById(id: $id) {
      id
      title
      slug
      description
      status
      frameUrl
      frameMetadata {
        width
        height
      }
      introMomentId
      introVideoUrl
      outroMomentId
      outroVideoUrl
      aspectRatio
      fitMode
      minUserDurationSeconds
      maxUserDurationSeconds
      festiveImageUrl
      ctaButtonText
      ctaBgColor
      ctaTextColor
      isFilterActive
      allowCameraRecording
      allowFileUpload
      autoPublishMoment
      shareInFeed
      totalCompositions
      startDate
      endDate
      createdAt
      updatedAt
      introMoment {
        id
        caption
        thumbnailUrl
        videoUrl
      }
      outroMoment {
        id
        caption
        thumbnailUrl
        videoUrl
      }
    }
  }
`;

export const ADMIN_CREATE_MOMENT_CAMPAIGN = gql`
  mutation AdminCreateMomentCampaign($input: AdminCreateMomentCampaignInput!) {
    adminCreateMomentCampaign(input: $input) {
      id
      title
      slug
      description
      status
      frameUrl
      frameMetadata {
        width
        height
      }
      introMomentId
      outroMomentId
      aspectRatio
      fitMode
      minUserDurationSeconds
      maxUserDurationSeconds
      festiveImageUrl
      ctaButtonText
      ctaBgColor
      ctaTextColor
      isFilterActive
      allowCameraRecording
      allowFileUpload
      autoPublishMoment
      shareInFeed
      createdAt
    }
  }
`;

export const ADMIN_UPDATE_MOMENT_CAMPAIGN = gql`
  mutation AdminUpdateMomentCampaign(
    $id: ID!
    $input: AdminUpdateMomentCampaignInput!
  ) {
    adminUpdateMomentCampaign(id: $id, input: $input) {
      id
      title
      slug
      description
      status
      frameUrl
      frameMetadata {
        width
        height
      }
      introMomentId
      outroMomentId
      aspectRatio
      fitMode
      minUserDurationSeconds
      maxUserDurationSeconds
      festiveImageUrl
      ctaButtonText
      ctaBgColor
      ctaTextColor
      isFilterActive
      allowCameraRecording
      allowFileUpload
      autoPublishMoment
      shareInFeed
      updatedAt
    }
  }
`;

export const ADMIN_DELETE_MOMENT_CAMPAIGN = gql`
  mutation AdminDeleteMomentCampaign($id: ID!) {
    adminDeleteMomentCampaign(id: $id)
  }
`;

export const GENERATE_CAMPAIGN_ASSET_UPLOAD_URL = gql`
  mutation GenerateCampaignAssetUploadUrl(
    $input: GenerateCampaignAssetUploadInput!
  ) {
    generateCampaignAssetUploadUrl(input: $input) {
      uploadUrl
      fileUrl
      key
      expiresIn
    }
  }
`;

export const CREATE_MOMENT_COMPOSITING_JOB = gql`
  mutation CreateMomentCompositingJob($input: CreateMomentCompositingJobInput!) {
    createMomentCompositingJob(input: $input) {
      id
      campaignId
      status
      progress
      rawVideoUrl
      frameUrl
      introVideoUrl
      outroVideoUrl
      outputVideoUrl
      thumbnailUrl
      duration
      momentId
      createdAt
    }
  }
`;

export const GET_MOMENT_COMPOSITING_JOB_BY_ID = gql`
  query GetMomentCompositingJobById($id: ID!) {
    getMomentCompositingJobById(id: $id) {
      id
      campaignId
      status
      progress
      rawVideoUrl
      frameUrl
      introVideoUrl
      outroVideoUrl
      outputVideoUrl
      thumbnailUrl
      duration
      errorMessage
      momentId
      createdAt
      completedAt
    }
  }
`;

export const GET_ACTIVE_USER_MOMENT_CAMPAIGNS = gql`
  query GetActiveUserMomentCampaigns {
    getActiveUserMomentCampaigns {
      id
      title
      slug
      description
      status
      frameUrl
      frameMetadata {
        width
        height
      }
      minUserDurationSeconds
      maxUserDurationSeconds
      festiveImageUrl
      ctaButtonText
      ctaBgColor
      ctaTextColor
      isFilterActive
      allowCameraRecording
      allowFileUpload
      autoPublishMoment
      shareInFeed
      aspectRatio
      fitMode
      createdAt
    }
  }
`;

export const GET_MOMENTS_CAMPAIGNS_DESIGN_SETTINGS = gql`
  query GetMomentsCampaignsDesignSettings {
    getMomentsCampaignsDesignSettings {
      pageBgUrl
      pageBgColor
      pageTitle
      pageSubtitle
      defaultCtaColor
      defaultCtaTextColor
    }
  }
`;

export const UPDATE_MOMENTS_CAMPAIGNS_DESIGN_SETTINGS = gql`
  mutation UpdateMomentsCampaignsDesignSettings(
    $input: MomentsCampaignsDesignSettingsInput!
  ) {
    updateMomentsCampaignsDesignSettings(input: $input) {
      pageBgUrl
      pageBgColor
      pageTitle
      pageSubtitle
      defaultCtaColor
      defaultCtaTextColor
    }
  }
`;
