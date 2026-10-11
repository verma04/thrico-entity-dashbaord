import { create } from "zustand";
import {
  ThricoARManifest,
  FilterLayer,
  GenerationJob,
  GenerationOutputItem,
  FilterCategory,
  FaceAnchorType,
  TargetPlatform,
} from "@/components/ai/filter-studio/types/ar-manifest";
import {
  INITIAL_MANIFEST,
  STARTER_LAYERS,
} from "@/components/ai/filter-studio/preview/starter-templates";

export interface GenerateFilterInput {
  prompt: string;
  referenceAssetUrl?: string;
  category: FilterCategory;
  style: string;
  colorPalette?: string;
  animationPreference?: "none" | "floating" | "pulse" | "shimmer" | "particle_drift" | "orbit";
  platforms: TargetPlatform[];
}

interface FilterStudioState {
  // Active Filter
  manifest: ThricoARManifest;
  activeLayerId: string | null;
  isDirty: boolean;
  filterStatus: "draft" | "published" | "archived";

  // Preview Settings
  previewMode: "preset_face" | "live_webcam";
  activeFacePresetId: string;
  showFaceMesh: boolean;
  showAnchorPoints: boolean;
  isPlayingAnimation: boolean;
  lightingIntensity: number; // 0.5 to 1.5

  // Generation Pipeline
  generationJobs: GenerationJob[];
  activeJobId: string | null;
  isGenerating: boolean;

  // History for Undo / Redo
  history: ThricoARManifest[];
  historyIndex: number;

  // Actions
  setManifestName: (name: string) => void;
  setManifestCategory: (category: FilterCategory) => void;
  setActiveLayerId: (layerId: string | null) => void;
  updateLayer: (layerId: string, updates: Partial<FilterLayer>) => void;
  addLayer: (layer: FilterLayer) => void;
  removeLayer: (layerId: string) => void;
  reorderLayers: (newLayerIds: string[]) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;

  // Canvas Actions
  setPreviewMode: (mode: "preset_face" | "live_webcam") => void;
  setActiveFacePresetId: (presetId: string) => void;
  setShowFaceMesh: (show: boolean) => void;
  setShowAnchorPoints: (show: boolean) => void;
  setIsPlayingAnimation: (playing: boolean) => void;
  setLightingIntensity: (intensity: number) => void;

  // AI Pipeline Actions
  startGenerationJob: (input: GenerateFilterInput) => Promise<string>;
  applyVariationToCanvas: (variation: GenerationOutputItem) => void;
  publishFilter: (version: string, releaseNotes: string) => void;

  // History
  undo: () => void;
  redo: () => void;
  loadTemplate: (templateId: "festive-crown" | "cyber-visor" | "mystic-butterflies") => void;
}

const INITIAL_GENERATION_JOBS: GenerationJob[] = [
  {
    generationId: "gen_festive_001",
    tenantId: "tenant_demo_brand",
    prompt:
      "Create a premium festive face mask with golden patterns, subtle glowing particles, elegant Indian festive styling, and a transparent background.",
    category: "face-mask",
    style: "Festive Gold",
    colorPalette: "#F59E0B",
    animationPreference: "shimmer",
    platforms: ["web", "ios", "android"],
    status: "completed",
    progress: 100,
    tokenCost: 45,
    createdAt: "2026-10-10T14:15:00.000Z",
    previewOutputs: [
      {
        id: "var_gold_filigree",
        name: "Variation A — Royal Gold Filigree Crown",
        previewUrl: STARTER_LAYERS["festive-crown"].assetUrl,
        assetType: "sticker",
        suggestedAnchor: "forehead",
        suggestedStyle: "Festive Gold",
      },
      {
        id: "var_stardust_aura",
        name: "Variation B — Golden Stardust Halo",
        previewUrl: STARTER_LAYERS["sparkle-particles"].assetUrl,
        assetType: "texture",
        suggestedAnchor: "face_oval",
        suggestedStyle: "Glowing Particles",
      },
      {
        id: "var_ruby_bindi",
        name: "Variation C — Ruby Bindi & Cheek Glitter",
        previewUrl: STARTER_LAYERS["mystic-butterflies"].assetUrl,
        assetType: "sticker",
        suggestedAnchor: "cheeks",
        suggestedStyle: "Jewel Accents",
      },
    ],
  },
];

export const useFilterStudioStore = create<FilterStudioState>((set, get) => ({
  manifest: INITIAL_MANIFEST,
  activeLayerId: INITIAL_MANIFEST.layers[0]?.id || null,
  isDirty: false,
  filterStatus: "published",

  previewMode: "preset_face",
  activeFacePresetId: "priya-festive",
  showFaceMesh: true,
  showAnchorPoints: true,
  isPlayingAnimation: true,
  lightingIntensity: 1.0,

  generationJobs: INITIAL_GENERATION_JOBS,
  activeJobId: INITIAL_GENERATION_JOBS[0].generationId,
  isGenerating: false,

  history: [INITIAL_MANIFEST],
  historyIndex: 0,

  setManifestName: (name) => {
    const current = get().manifest;
    const updated = { ...current, name };
    set({ manifest: updated, isDirty: true });
  },

  setManifestCategory: (category) => {
    const current = get().manifest;
    const updated = { ...current, category };
    set({ manifest: updated, isDirty: true });
  },

  setActiveLayerId: (layerId) => {
    set({ activeLayerId: layerId });
  },

  updateLayer: (layerId, updates) => {
    const { manifest, history, historyIndex } = get();
    const updatedLayers = manifest.layers.map((layer) =>
      layer.id === layerId ? { ...layer, ...updates } : layer
    );
    const updatedManifest = { ...manifest, layers: updatedLayers };

    // Record history slice
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedManifest);

    set({
      manifest: updatedManifest,
      isDirty: true,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  addLayer: (layer) => {
    const { manifest, history, historyIndex } = get();
    const updatedManifest = {
      ...manifest,
      layers: [...manifest.layers, layer],
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedManifest);

    set({
      manifest: updatedManifest,
      activeLayerId: layer.id,
      isDirty: true,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  removeLayer: (layerId) => {
    const { manifest, activeLayerId } = get();
    const updatedLayers = manifest.layers.filter((l) => l.id !== layerId);
    const nextActiveId =
      activeLayerId === layerId
        ? updatedLayers[0]?.id || null
        : activeLayerId;

    set({
      manifest: { ...manifest, layers: updatedLayers },
      activeLayerId: nextActiveId,
      isDirty: true,
    });
  },

  reorderLayers: (newLayerIds) => {
    const { manifest } = get();
    const layerMap = new Map(manifest.layers.map((l) => [l.id, l]));
    const reordered: FilterLayer[] = [];
    newLayerIds.forEach((id) => {
      const found = layerMap.get(id);
      if (found) reordered.push(found);
    });
    set({
      manifest: { ...manifest, layers: reordered },
      isDirty: true,
    });
  },

  toggleLayerVisibility: (layerId) => {
    const { manifest } = get();
    const updated = manifest.layers.map((l) =>
      l.id === layerId ? { ...l, visible: !l.visible } : l
    );
    set({ manifest: { ...manifest, layers: updated }, isDirty: true });
  },

  toggleLayerLock: (layerId) => {
    const { manifest } = get();
    const updated = manifest.layers.map((l) =>
      l.id === layerId ? { ...l, locked: !l.locked } : l
    );
    set({ manifest: { ...manifest, layers: updated } });
  },

  setPreviewMode: (mode) => set({ previewMode: mode }),
  setActiveFacePresetId: (id) => set({ activeFacePresetId: id }),
  setShowFaceMesh: (show) => set({ showFaceMesh: show }),
  setShowAnchorPoints: (show) => set({ showAnchorPoints: show }),
  setIsPlayingAnimation: (playing) => set({ isPlayingAnimation: playing }),
  setLightingIntensity: (intensity) => set({ lightingIntensity: intensity }),

  startGenerationJob: async (input) => {
    const jobId = `gen_${Date.now()}`;
    const newJob: GenerationJob = {
      generationId: jobId,
      tenantId: "tenant_demo_brand",
      prompt: input.prompt,
      referenceAssetUrl: input.referenceAssetUrl,
      category: input.category,
      style: input.style,
      colorPalette: input.colorPalette,
      animationPreference: input.animationPreference,
      platforms: input.platforms,
      status: "queued",
      progress: 10,
      tokenCost: 35,
      createdAt: new Date().toISOString(),
      previewOutputs: [],
    };

    set((state) => ({
      generationJobs: [newJob, ...state.generationJobs],
      activeJobId: jobId,
      isGenerating: true,
    }));

    // Realistic asynchronous progression simulation
    await new Promise((r) => setTimeout(r, 600));
    set((state) => ({
      generationJobs: state.generationJobs.map((j) =>
        j.generationId === jobId
          ? { ...j, status: "processing", progress: 45 }
          : j
      ),
    }));

    await new Promise((r) => setTimeout(r, 800));
    set((state) => ({
      generationJobs: state.generationJobs.map((j) =>
        j.generationId === jobId ? { ...j, progress: 85 } : j
      ),
    }));

    await new Promise((r) => setTimeout(r, 600));

    // Curated dynamic output matching user input
    const generatedVariations: GenerationOutputItem[] = [
      {
        id: `var_concept_1_${Date.now()}`,
        name: `${input.style} — Hero Effect`,
        previewUrl:
          input.category === "accessory"
            ? STARTER_LAYERS["cyber-visor"].assetUrl
            : STARTER_LAYERS["festive-crown"].assetUrl,
        assetType: "sticker",
        suggestedAnchor:
          input.category === "accessory"
            ? "nose_bridge"
            : ("forehead" as FaceAnchorType),
        suggestedStyle: input.style,
      },
      {
        id: `var_concept_2_${Date.now()}`,
        name: `${input.style} — Glow Aura`,
        previewUrl: STARTER_LAYERS["sparkle-particles"].assetUrl,
        assetType: "texture",
        suggestedAnchor: "face_oval",
        suggestedStyle: "Particle Drift",
      },
      {
        id: `var_concept_3_${Date.now()}`,
        name: `${input.style} — Cheek Decal Accent`,
        previewUrl: STARTER_LAYERS["mystic-butterflies"].assetUrl,
        assetType: "sticker",
        suggestedAnchor: "cheeks",
        suggestedStyle: "Accent",
      },
    ];

    set((state) => ({
      generationJobs: state.generationJobs.map((j) =>
        j.generationId === jobId
          ? {
              ...j,
              status: "completed",
              progress: 100,
              previewOutputs: generatedVariations,
            }
          : j
      ),
      isGenerating: false,
    }));

    return jobId;
  },

  applyVariationToCanvas: (variation) => {
    const newLayer: FilterLayer = {
      id: `layer_${Date.now()}`,
      name: variation.name,
      assetUrl: variation.previewUrl,
      assetType: variation.assetType,
      anchor: variation.suggestedAnchor,
      transform: {
        x: 0,
        y: 0,
        z: 5,
        scaleX: 1.0,
        scaleY: 1.0,
        uniformScale: true,
        rotation: 0,
        opacity: 0.95,
      },
      blendMode: "normal",
      tintColor: "#FFFFFF",
      glowIntensity: 30,
      animation: {
        preset: "floating",
        speed: 1.0,
        amplitude: 15,
      },
      visible: true,
      locked: false,
    };

    get().addLayer(newLayer);
  },

  publishFilter: (version, releaseNotes) => {
    const { manifest } = get();
    const updated: ThricoARManifest = {
      ...manifest,
      version,
      releaseNotes,
      publishedAt: new Date().toISOString(),
      checksum: `sha256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
    };
    set({
      manifest: updated,
      filterStatus: "published",
      isDirty: false,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      set({
        manifest: prev,
        historyIndex: historyIndex - 1,
        activeLayerId: prev.layers[0]?.id || null,
        isDirty: true,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      set({
        manifest: next,
        historyIndex: historyIndex + 1,
        activeLayerId: next.layers[0]?.id || null,
        isDirty: true,
      });
    }
  },

  loadTemplate: (templateId) => {
    if (templateId === "cyber-visor") {
      const manifest: ThricoARManifest = {
        manifestVersion: "1.0.0",
        filterId: "filter_cyber_visor_002",
        name: "Cyberpunk HUD Visor",
        version: "1.0.0",
        tenantId: "tenant_demo_brand",
        category: "accessory",
        layers: [STARTER_LAYERS["cyber-visor"]],
        platforms: ["web", "ios", "android"],
        budget: { maxTextureDim: 2048, maxFileSizeKb: 800 },
        checksum: "sha256:d8912aa134",
        publishedAt: new Date().toISOString(),
      };
      set({
        manifest,
        activeLayerId: STARTER_LAYERS["cyber-visor"].id,
        isDirty: true,
      });
    } else if (templateId === "mystic-butterflies") {
      const manifest: ThricoARManifest = {
        manifestVersion: "1.0.0",
        filterId: "filter_mystic_butterfly_003",
        name: "Holographic Butterfly Tiara",
        version: "1.0.0",
        tenantId: "tenant_demo_brand",
        category: "face-overlay",
        layers: [
          STARTER_LAYERS["mystic-butterflies"],
          STARTER_LAYERS["sparkle-particles"],
        ],
        platforms: ["web", "ios", "android"],
        budget: { maxTextureDim: 2048, maxFileSizeKb: 900 },
        checksum: "sha256:ee1243bb51",
        publishedAt: new Date().toISOString(),
      };
      set({
        manifest,
        activeLayerId: STARTER_LAYERS["mystic-butterflies"].id,
        isDirty: true,
      });
    } else {
      set({
        manifest: INITIAL_MANIFEST,
        activeLayerId: STARTER_LAYERS["festive-crown"].id,
        isDirty: true,
      });
    }
  },
}));
