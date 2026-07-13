import { gql } from "@apollo/client";

export const SAVE_ANDROID_APP_INFO = gql`
  mutation SaveAndroidAppInfo($input: AndroidAppInfoInput!) {
    saveAndroidAppInfo(input: $input) {
      id
    }
  }
`;

export const SAVE_ANDROID_BRANDING = gql`
  mutation SaveAndroidBranding($input: AndroidBrandingInput!) {
    saveAndroidBranding(input: $input) {
      id
    }
  }
`;

export const SAVE_ANDROID_PUSH_NOTIFICATIONS = gql`
  mutation SaveAndroidPushNotifications($input: AndroidPushNotificationsInput!) {
    saveAndroidPushNotifications(input: $input) {
      id
    }
  }
`;

export const SAVE_ANDROID_SETUP = gql`
  mutation SaveAndroidSetup($input: AndroidSetupInput!) {
    saveAndroidSetup(input: $input) {
      id
    }
  }
`;

export const SAVE_ANDROID_GOOGLE_PLAY_CONNECT = gql`
  mutation SaveAndroidGooglePlayConnect($input: AndroidGooglePlayConnectInput!) {
    saveAndroidGooglePlayConnect(input: $input) {
      id
    }
  }
`;

export const SAVE_ANDROID_STORE_INFO = gql`
  mutation SaveAndroidStoreInfo($input: AndroidStoreInfoInput!) {
    saveAndroidStoreInfo(input: $input) {
      id
    }
  }
`;

export const SAVE_ANDROID_GRAPHICS = gql`
  mutation SaveAndroidGraphics($input: AndroidGraphicsInput!) {
    saveAndroidGraphics(input: $input) {
      id
    }
  }
`;

export const GET_ANDROID_APP_INFO = gql`
  query GetAndroidAppInfo {
    getAndroidAppInfo {
      appName
      shortName
      orgName
      website
      supportEmail
      privacyPolicyUrl
    }
  }
`;

export const GET_ANDROID_BRANDING = gql`
  query GetAndroidBranding {
    getAndroidBranding {
      primaryColor
      secondaryColor
      accentColor
      splashScreenPath
      appIconPath
    }
  }
`;

export const GET_ANDROID_PUSH_NOTIFICATIONS = gql`
  query GetAndroidPushNotifications {
    getAndroidPushNotifications {
      firebaseEnabled
      googleServicesJsonPath
    }
  }
`;

export const GET_ANDROID_SETUP = gql`
  query GetAndroidSetup {
    getAndroidSetup {
      packageName
      keystorePath
    }
  }
`;

export const GET_ANDROID_GOOGLE_PLAY_CONNECT = gql`
  query GetAndroidGooglePlayConnect {
    getAndroidGooglePlayConnect {
      serviceJsonPath
    }
  }
`;

export const GET_ANDROID_STORE_INFO = gql`
  query GetAndroidStoreInfo {
    getAndroidStoreInfo {
      appTitle
      shortDescription
      fullDescription
      copyrightText
      supportUrl
      marketingUrl
    }
  }
`;

export const GET_ANDROID_GRAPHICS = gql`
  query GetAndroidGraphics {
    getAndroidGraphics {
      appIconPath
      featureGraphicPath
      videoUrl
      phoneScreenshots
      tablet7Screenshots
      tablet10Screenshots
      chromebookScreenshots
      xrScreenshots
      spatialXrVideoUrl
      nonSpatialXrVideoUrl
    }
  }
`;
