"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { useFormik, FormikProvider, FormikProps } from "formik";
import {
  useGetMediaGallerySdkSettings,
  useUpdateMediaGallerySdkSettings,
  useGetMediaGalleryAlbums,
  useGetMediaGallerySubmissions,
  useApproveMediaGallerySubmission,
  useRejectMediaGallerySubmission,
} from "@/graphql/actions/mediaGallery";
import {
  useGetEnterpriseClient,
  EnterpriseClient,
} from "@/graphql/actions/enterprise-leaderboard";
import { toast } from "sonner";
import {
  MediaGalleryPolicyFormValues,
  DEFAULT_POLICY_CONFIG,
  mediaGalleryPolicyValidationSchema,
  MediaGalleryRecipePreset,
} from "./types";

export interface MediaGalleryAlbumSummary {
  id: string;
  title: string;
  imageCount?: number;
  coverImage?: string | null;
}

export interface MediaGallerySubmissionItem {
  id: string;
  albumId: string;
  entityId?: string;
  url: string;
  caption?: string | null;
  type: string;
  status: string;
  thumbnailUrl?: string | null;
  duration?: number | null;
  source?: string | null;
  externalUploaderName?: string | null;
  externalUploaderEmail?: string | null;
  externalUserId?: string | null;
  createdAt: string;
}

export interface MediaGalleryDeveloperContextType {
  formik: FormikProps<MediaGalleryPolicyFormValues>;
  client: EnterpriseClient | null;
  clientLoading: boolean;
  refetchClient: () => Promise<unknown>;
  albums: MediaGalleryAlbumSummary[];
  albumsLoading: boolean;
  refetchAlbums: () => Promise<unknown>;
  submissions: MediaGallerySubmissionItem[];
  submissionsLoading: boolean;
  pendingCount: number;
  totalSubmissionsCount: number;
  refetchSubmissions: () => Promise<unknown>;
  approveSubmission: (id: string) => Promise<void>;
  rejectSubmission: (id: string, reason?: string) => Promise<void>;
  isApproving: boolean;
  isRejecting: boolean;
  isSaving: boolean;
  isSaved: boolean;
  isRefreshing: boolean;
  handleManualRefresh: () => Promise<void>;
  handleReset: () => void;
  startersDrawerOpen: boolean;
  setStartersDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSubmission: MediaGallerySubmissionItem | null;
  setSelectedSubmission: React.Dispatch<React.SetStateAction<MediaGallerySubmissionItem | null>>;
  submissionDrawerOpen: boolean;
  setSubmissionDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  applyPreset: (preset: MediaGalleryRecipePreset) => void;
}

const MediaGalleryDeveloperContext = createContext<MediaGalleryDeveloperContextType | null>(null);

export function useMediaGalleryDeveloper(): MediaGalleryDeveloperContextType {
  const context = useContext(MediaGalleryDeveloperContext);
  if (!context) {
    throw new Error(
      "useMediaGalleryDeveloper must be used within a MediaGalleryDeveloperProvider"
    );
  }
  return context;
}

interface MediaGalleryDeveloperProviderProps {
  children: ReactNode;
}

export function MediaGalleryDeveloperProvider({ children }: MediaGalleryDeveloperProviderProps) {
  const {
    data: settingsData,
    refetch: refetchSettings,
  } = useGetMediaGallerySdkSettings();

  const {
    data: clientData,
    loading: clientLoading,
    refetch: refetchClient,
  } = useGetEnterpriseClient();

  const {
    data: albumsData,
    loading: albumsLoading,
    refetch: refetchAlbums,
  } = useGetMediaGalleryAlbums();

  const {
    data: submissionsData,
    loading: submissionsLoading,
    refetch: refetchSubmissions,
  } = useGetMediaGallerySubmissions({
    page: 1,
    limit: 100,
  });

  const [updateSettings, { loading: isSaving }] = useUpdateMediaGallerySdkSettings({});

  const [approveItemMutation, { loading: isApproving }] = useApproveMediaGallerySubmission({
    onCompleted: () => {
      toast.success("Submission approved and published to gallery!");
      refetchSubmissions();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to approve submission";
      toast.error(msg);
    },
  });

  const [rejectItemMutation, { loading: isRejecting }] = useRejectMediaGallerySubmission({
    onCompleted: () => {
      toast.success("Submission rejected");
      refetchSubmissions();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to reject submission";
      toast.error(msg);
    },
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startersDrawerOpen, setStartersDrawerOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<MediaGallerySubmissionItem | null>(null);
  const [submissionDrawerOpen, setSubmissionDrawerOpen] = useState(false);

  const client = clientData?.getEnterpriseClient || null;
  const albums: MediaGalleryAlbumSummary[] = useMemo(
    () => albumsData?.getMediaGalleryAlbums || [],
    [albumsData]
  );
  const submissions: MediaGallerySubmissionItem[] = submissionsData?.getMediaGallerySubmissions?.items || [];
  const pendingCount = submissionsData?.getMediaGallerySubmissions?.pendingCount || 0;
  const totalSubmissionsCount = submissionsData?.getMediaGallerySubmissions?.totalCount || 0;

  const serverConfig = useMemo<MediaGalleryPolicyFormValues>(() => {
    const raw = settingsData?.getMediaGallerySdkSettings;
    if (raw) {
      return {
        allowThirdPartyUploads: raw.allowThirdPartyUploads ?? true,
        requireModeration: raw.requireModeration ?? false,
        defaultAlbumId: raw.defaultAlbumId || (albums[0]?.id ?? ""),
        allowUserSelectAlbum: raw.allowUserSelectAlbum ?? true,
        allowedMediaTypes: (raw.allowedMediaTypes as "ALL" | "IMAGE_ONLY" | "VIDEO_ONLY") || "ALL",
        maxImageSizeMb: Number(raw.maxImageSizeMb ?? 10),
        maxVideoSizeMb: Number(raw.maxVideoSizeMb ?? 100),
        maxVideoDurationSeconds: Number(raw.maxVideoDurationSeconds ?? 120),
        maxDailyUploadsPerUploader: Number(raw.maxDailyUploadsPerUploader ?? 10),
        maxDailyUploadsTotal: Number(raw.maxDailyUploadsTotal ?? 200),
        requireUploaderInfo: raw.requireUploaderInfo ?? false,
        requireCaption: raw.requireCaption ?? false,
      };
    }
    return DEFAULT_POLICY_CONFIG;
  }, [settingsData, albums]);

  const formik = useFormik<MediaGalleryPolicyFormValues>({
    initialValues: serverConfig,
    validationSchema: mediaGalleryPolicyValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await updateSettings({
          variables: {
            input: {
              allowThirdPartyUploads: values.allowThirdPartyUploads,
              requireModeration: values.requireModeration,
              defaultAlbumId: values.defaultAlbumId || null,
              allowUserSelectAlbum: values.allowUserSelectAlbum,
              allowedMediaTypes: values.allowedMediaTypes,
              maxImageSizeMb: Number(values.maxImageSizeMb),
              maxVideoSizeMb: Number(values.maxVideoSizeMb),
              maxVideoDurationSeconds: Number(values.maxVideoDurationSeconds),
              maxDailyUploadsPerUploader: Number(values.maxDailyUploadsPerUploader),
              maxDailyUploadsTotal: Number(values.maxDailyUploadsTotal),
              requireUploaderInfo: values.requireUploaderInfo,
              requireCaption: values.requireCaption,
            },
          },
        });
        toast.success("Upload policy and daily limits saved successfully!");
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
        resetForm({ values });
        refetchSettings();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to save upload policy.";
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.allSettled([
        refetchSettings(),
        refetchClient(),
        refetchAlbums(),
        refetchSubmissions(),
      ]);
      toast.success("Developer & SDK settings refreshed.");
    } catch {
      toast.error("Failed to refresh developer data.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReset = () => {
    formik.resetForm();
    toast.info("Unsaved modifications reverted.");
  };

  const applyPreset = (preset: MediaGalleryRecipePreset) => {
    formik.setValues((prev) => ({
      ...prev,
      ...preset.values,
    }));
    toast.success(`Preset "${preset.name}" applied to upload policy.`);
  };

  const approveSubmission = async (id: string) => {
    await approveItemMutation({ variables: { id } });
  };

  const rejectSubmission = async (id: string, reason?: string) => {
    await rejectItemMutation({ variables: { id, reason: reason || null } });
  };

  const value: MediaGalleryDeveloperContextType = {
    formik,
    client,
    clientLoading,
    refetchClient: async () => refetchClient(),
    albums,
    albumsLoading,
    refetchAlbums: async () => refetchAlbums(),
    submissions,
    submissionsLoading,
    pendingCount,
    totalSubmissionsCount,
    refetchSubmissions: async () => refetchSubmissions(),
    approveSubmission,
    rejectSubmission,
    isApproving,
    isRejecting,
    isSaving,
    isSaved,
    isRefreshing,
    handleManualRefresh,
    handleReset,
    startersDrawerOpen,
    setStartersDrawerOpen,
    selectedSubmission,
    setSelectedSubmission,
    submissionDrawerOpen,
    setSubmissionDrawerOpen,
    applyPreset,
  };

  return (
    <MediaGalleryDeveloperContext.Provider value={value}>
      <FormikProvider value={formik}>{children}</FormikProvider>
    </MediaGalleryDeveloperContext.Provider>
  );
}
