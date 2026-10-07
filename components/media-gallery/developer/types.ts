import * as Yup from "yup";

export type AllowedMediaType = "ALL" | "IMAGE_ONLY" | "VIDEO_ONLY";

export interface MediaGalleryPolicyFormValues {
  allowThirdPartyUploads: boolean;
  requireModeration: boolean;
  defaultAlbumId: string;
  allowUserSelectAlbum: boolean;
  allowedMediaTypes: AllowedMediaType;
  maxImageSizeMb: number;
  maxVideoSizeMb: number;
  maxVideoDurationSeconds: number;
  maxDailyUploadsPerUploader: number;
  maxDailyUploadsTotal: number;
  requireUploaderInfo: boolean;
  requireCaption: boolean;
}

export const DEFAULT_POLICY_CONFIG: MediaGalleryPolicyFormValues = {
  allowThirdPartyUploads: true,
  requireModeration: false,
  defaultAlbumId: "",
  allowUserSelectAlbum: true,
  allowedMediaTypes: "ALL",
  maxImageSizeMb: 10,
  maxVideoSizeMb: 100,
  maxVideoDurationSeconds: 120,
  maxDailyUploadsPerUploader: 10,
  maxDailyUploadsTotal: 200,
  requireUploaderInfo: false,
  requireCaption: false,
};

export const mediaGalleryPolicyValidationSchema = Yup.object().shape({
  allowThirdPartyUploads: Yup.boolean().required(),
  requireModeration: Yup.boolean().required(),
  defaultAlbumId: Yup.string().optional(),
  allowUserSelectAlbum: Yup.boolean().required(),
  allowedMediaTypes: Yup.string()
    .oneOf(["ALL", "IMAGE_ONLY", "VIDEO_ONLY"])
    .required("Please select allowed media types"),
  maxImageSizeMb: Yup.number()
    .min(1, "Minimum image size is 1 MB")
    .max(100, "Maximum image size is 100 MB")
    .required("Max image size is required"),
  maxVideoSizeMb: Yup.number()
    .min(1, "Minimum video size is 1 MB")
    .max(500, "Maximum video size is 500 MB")
    .required("Max video size is required"),
  maxVideoDurationSeconds: Yup.number()
    .min(5, "Minimum video duration is 5 seconds")
    .max(3600, "Maximum video duration is 3600 seconds")
    .required("Max video duration is required"),
  maxDailyUploadsPerUploader: Yup.number()
    .min(1, "Must allow at least 1 upload per day")
    .max(1000, "Max 1000 uploads per uploader")
    .required("Daily uploader quota is required"),
  maxDailyUploadsTotal: Yup.number()
    .min(1, "Total community quota must be at least 1")
    .max(50000, "Max 50000 uploads total")
    .required("Total daily quota is required"),
  requireUploaderInfo: Yup.boolean().required(),
  requireCaption: Yup.boolean().required(),
});

export interface MediaGalleryRecipePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  iconName: string;
  values: Partial<MediaGalleryPolicyFormValues>;
}

export const DEVELOPER_RECIPE_PRESETS: MediaGalleryRecipePreset[] = [
  {
    id: "strict-gate",
    name: "Enterprise Moderated Gate",
    badge: "Maximum Security",
    description: "Hold all incoming uploads for staff approval. Stricter file caps and mandatory contributor identity.",
    iconName: "ShieldCheck",
    values: {
      allowThirdPartyUploads: true,
      requireModeration: true,
      allowedMediaTypes: "ALL",
      maxImageSizeMb: 5,
      maxVideoSizeMb: 50,
      maxVideoDurationSeconds: 60,
      maxDailyUploadsPerUploader: 5,
      maxDailyUploadsTotal: 100,
      requireUploaderInfo: true,
      requireCaption: true,
    },
  },
  {
    id: "open-community",
    name: "Open Community Crowdsourcing",
    badge: "Direct Publish",
    description: "High-throughput live event uploads. Directly publishes photos and videos with album selection.",
    iconName: "Sparkles",
    values: {
      allowThirdPartyUploads: true,
      requireModeration: false,
      allowUserSelectAlbum: true,
      allowedMediaTypes: "ALL",
      maxImageSizeMb: 15,
      maxVideoSizeMb: 150,
      maxVideoDurationSeconds: 180,
      maxDailyUploadsPerUploader: 25,
      maxDailyUploadsTotal: 500,
      requireUploaderInfo: false,
      requireCaption: false,
    },
  },
  {
    id: "photo-contest",
    name: "Photo Contest & UGC Campaign",
    badge: "Images Only",
    description: "Restrict submissions to high-res images with mandatory captions and contributor contact emails.",
    iconName: "Image",
    values: {
      allowThirdPartyUploads: true,
      requireModeration: true,
      allowedMediaTypes: "IMAGE_ONLY",
      maxImageSizeMb: 20,
      maxDailyUploadsPerUploader: 3,
      maxDailyUploadsTotal: 250,
      requireUploaderInfo: true,
      requireCaption: true,
    },
  },
  {
    id: "video-highlights",
    name: "Video Highlights & Reels",
    badge: "Videos Only",
    description: "Accept short-form video clips (up to 90 seconds) with mandatory titles and contributor attribution.",
    iconName: "Film",
    values: {
      allowThirdPartyUploads: true,
      requireModeration: true,
      allowedMediaTypes: "VIDEO_ONLY",
      maxVideoSizeMb: 200,
      maxVideoDurationSeconds: 90,
      maxDailyUploadsPerUploader: 5,
      maxDailyUploadsTotal: 150,
      requireUploaderInfo: true,
      requireCaption: true,
    },
  },
];
