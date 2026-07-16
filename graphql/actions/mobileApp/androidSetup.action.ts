import { useMutation, useQuery } from "@apollo/client";
import {
  SAVE_ANDROID_APP_INFO,
  SAVE_ANDROID_BRANDING,
  SAVE_ANDROID_PUSH_NOTIFICATIONS,
  SAVE_ANDROID_SETUP,
  SAVE_ANDROID_GOOGLE_PLAY_CONNECT,
  SAVE_ANDROID_STORE_INFO,
  SAVE_ANDROID_GRAPHICS,
  GET_ANDROID_APP_INFO,
  GET_ANDROID_BRANDING,
  GET_ANDROID_PUSH_NOTIFICATIONS,
  GET_ANDROID_SETUP,
  GET_ANDROID_GOOGLE_PLAY_CONNECT,
  GET_ANDROID_STORE_INFO,
  GET_ANDROID_GRAPHICS,
} from "../../quries/mobileApp/androidSetup";

export const useSaveAndroidAppInfo = (options?: any) =>
  useMutation(SAVE_ANDROID_APP_INFO, options);

export const useSaveAndroidBranding = (options?: any) =>
  useMutation(SAVE_ANDROID_BRANDING, options);

export const useSaveAndroidPushNotifications = (options?: any) =>
  useMutation(SAVE_ANDROID_PUSH_NOTIFICATIONS, options);

export const useSaveAndroidSetup = (options?: any) =>
  useMutation(SAVE_ANDROID_SETUP, options);

export const useSaveAndroidGooglePlayConnect = (options?: any) =>
  useMutation(SAVE_ANDROID_GOOGLE_PLAY_CONNECT, options);

export const useSaveAndroidStoreInfo = (options?: any) =>
  useMutation(SAVE_ANDROID_STORE_INFO, options);

export const useSaveAndroidGraphics = (options?: any) =>
  useMutation(SAVE_ANDROID_GRAPHICS, options);

export const useGetAndroidAppInfo = (options?: any) =>
  useQuery(GET_ANDROID_APP_INFO, { fetchPolicy: "network-only", ...options });

export const useGetAndroidBranding = (options?: any) =>
  useQuery(GET_ANDROID_BRANDING, { fetchPolicy: "network-only", ...options });

export const useGetAndroidPushNotifications = (options?: any) =>
  useQuery(GET_ANDROID_PUSH_NOTIFICATIONS, { fetchPolicy: "network-only", ...options });

export const useGetAndroidSetup = (options?: any) =>
  useQuery(GET_ANDROID_SETUP, { fetchPolicy: "network-only", ...options });

export const useGetAndroidGooglePlayConnect = (options?: any) =>
  useQuery(GET_ANDROID_GOOGLE_PLAY_CONNECT, { fetchPolicy: "network-only", ...options });

export const useGetAndroidStoreInfo = (options?: any) =>
  useQuery(GET_ANDROID_STORE_INFO, { fetchPolicy: "network-only", ...options });

export const useGetAndroidGraphics = (options?: any) =>
  useQuery(GET_ANDROID_GRAPHICS, { fetchPolicy: "network-only", ...options });
