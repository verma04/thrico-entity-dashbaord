export type FaceAnchorType =
  | "forehead"
  | "left_eye"
  | "right_eye"
  | "nose_bridge"
  | "cheeks"
  | "mouth"
  | "chin"
  | "face_oval"
  | "free_float";

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "additive";

export type AnimationPreset =
  | "none"
  | "floating"
  | "pulse"
  | "shimmer"
  | "particle_drift"
  | "orbit";

export type FilterCategory =
  | "face-mask"
  | "face-overlay"
  | "accessory";

export type TargetPlatform = "web" | "ios" | "android";

export interface LayerTransform {
  x: number; // -100 to 100 (% offset from anchor)
  y: number; // -100 to 100 (% offset from anchor)
  z: number; // -50 to 50 (pseudo-depth)
  scaleX: number; // 0.1 to 3
  scaleY: number; // 0.1 to 3
  uniformScale: boolean;
  rotation: number; // -180 to 180 degrees
  opacity: number; // 0 to 1
}

export interface LayerAnimation {
  preset: AnimationPreset;
  speed: number; // 0.2 to 3
  amplitude: number; // 5 to 50
}

export interface FilterLayer {
  id: string;
  name: string;
  assetUrl: string;
  assetType: "image" | "sticker" | "texture" | "model3d";
  anchor: FaceAnchorType;
  transform: LayerTransform;
  blendMode: BlendMode;
  tintColor?: string;
  glowIntensity: number; // 0 to 100%
  animation: LayerAnimation;
  visible: boolean;
  locked: boolean;
}

export interface ManifestBudget {
  maxTextureDim: number;
  maxFileSizeKb: number;
  polyCountLimit?: number;
}

export interface ThricoARManifest {
  manifestVersion: "1.0.0";
  filterId: string;
  name: string;
  version: string;
  tenantId: string;
  category: FilterCategory;
  layers: FilterLayer[];
  platforms: TargetPlatform[];
  budget: ManifestBudget;
  checksum: string;
  publishedAt?: string;
  releaseNotes?: string;
}

export interface GenerationOutputItem {
  id: string;
  name: string;
  previewUrl: string;
  assetType: "image" | "sticker" | "texture" | "model3d";
  suggestedAnchor: FaceAnchorType;
  suggestedStyle?: string;
}

export interface GenerationJob {
  generationId: string;
  tenantId: string;
  prompt: string;
  referenceAssetUrl?: string;
  category: FilterCategory;
  style: string;
  colorPalette?: string;
  animationPreference?: AnimationPreset;
  platforms: TargetPlatform[];
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  previewOutputs: GenerationOutputItem[];
  tokenCost: number;
  createdAt: string;
  errorCode?: string;
}

export interface ARFilterRecord {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  category: FilterCategory;
  thumbnailUrl: string;
  status: "draft" | "published" | "archived";
  currentVersion: string;
  versionsCount: number;
  platforms: TargetPlatform[];
  impressions: number;
  captures: number;
  shares: number;
  updatedAt: string;
  createdAt: string;
}

export interface ARAssetRecord {
  id: string;
  tenantId: string;
  name: string;
  storageKey: string;
  url: string;
  type: "png_sticker" | "texture_map" | "gltf_model" | "audio_sfx";
  fileSizeKb: number;
  dimensions?: string;
  checksum: string;
  usedInFiltersCount: number;
  createdAt: string;
}

export interface ARCampaignRecord {
  id: string;
  tenantId: string;
  name: string;
  filterIds: string[];
  status: "scheduled" | "active" | "completed";
  startsAt: string;
  endsAt: string;
  utmSource: string;
  targetAudience: string;
  impressionsGoal: number;
  currentImpressions: number;
}

export interface ARSDKAppRecord {
  id: string;
  tenantId: string;
  name: string;
  platform: TargetPlatform;
  publicKey: string;
  allowedDomains: string[];
  bundleId?: string;
  status: "active" | "revoked";
  requestsThisMonth: number;
  createdAt: string;
}
