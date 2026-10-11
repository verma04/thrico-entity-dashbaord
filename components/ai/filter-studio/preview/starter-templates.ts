import { FilterLayer, ThricoARManifest } from "../types/ar-manifest";

export const STARTER_LAYERS: Record<string, FilterLayer> = {
  "festive-crown": {
    id: "layer-festive-crown",
    name: "Golden Festive Crown",
    assetUrl: `data:image/svg+xml;utf8,<svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23FFF0A8"/>
          <stop offset="40%" stop-color="%23F59E0B"/>
          <stop offset="70%" stop-color="%23D97706"/>
          <stop offset="100%" stop-color="%23B45309"/>
        </linearGradient>
        <radialGradient id="ruby" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="%23FF6B6B"/>
          <stop offset="100%" stop-color="%23991B1B"/>
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <!-- Base Arch -->
      <path d="M 20 100 Q 120 70 220 100 Q 120 85 20 100 Z" fill="url(%23goldGrad)"/>
      <!-- Crown Spires -->
      <path d="M 30 95 Q 40 45 60 40 Q 75 75 80 90 Z" fill="url(%23goldGrad)"/>
      <path d="M 160 90 Q 165 75 180 40 Q 200 45 210 95 Z" fill="url(%23goldGrad)"/>
      <path d="M 75 88 Q 95 30 120 10 Q 145 30 165 88 Z" fill="url(%23goldGrad)" filter="url(%23glow)"/>
      <!-- Filigree scrolls -->
      <circle cx="120" cy="18" r="8" fill="url(%23ruby)"/>
      <circle cx="60" cy="42" r="5" fill="url(%23ruby)"/>
      <circle cx="180" cy="42" r="5" fill="url(%23ruby)"/>
      <!-- Central Gem -->
      <polygon points="120,40 128,54 120,68 112,54" fill="url(%23ruby)"/>
      <!-- Hanging Pearl -->
      <circle cx="120" cy="98" r="4.5" fill="%23FFFBEB"/>
    </svg>`,
    assetType: "sticker",
    anchor: "forehead",
    transform: {
      x: 0,
      y: -15,
      z: 10,
      scaleX: 1.1,
      scaleY: 1.1,
      uniformScale: true,
      rotation: 0,
      opacity: 0.95,
    },
    blendMode: "normal",
    tintColor: "#F59E0B",
    glowIntensity: 45,
    animation: {
      preset: "shimmer",
      speed: 1.2,
      amplitude: 15,
    },
    visible: true,
    locked: false,
  },
  "cyber-visor": {
    id: "layer-cyber-visor",
    name: "Cyberpunk Neon Visor",
    assetUrl: `data:image/svg+xml;utf8,<svg viewBox="0 0 260 90" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="%2306B6D4" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="%233B82F6" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="%23A855F7" stop-opacity="0.8"/>
        </linearGradient>
      </defs>
      <!-- Visor Shield -->
      <polygon points="15,20 245,20 230,75 150,75 130,85 110,85 90,75 30,75" fill="url(%23neonCyan)" stroke="%2322D3EE" stroke-width="2.5"/>
      <!-- Scanlines -->
      <line x1="25" y1="32" x2="235" y2="32" stroke="%23E0F2FE" stroke-width="1.5" stroke-dasharray="8,4" opacity="0.7"/>
      <line x1="30" y1="46" x2="230" y2="46" stroke="%2322D3EE" stroke-width="1.2" opacity="0.6"/>
      <line x1="35" y1="60" x2="225" y2="60" stroke="%23A855F7" stroke-width="1.2" opacity="0.5"/>
      <!-- HUD markings -->
      <text x="35" y="28" font-family="monospace" font-size="7" fill="%23FFFFFF" font-weight="bold">THRICO // AR-09</text>
      <text x="200" y="28" font-family="monospace" font-size="7" fill="%2322D3EE" font-weight="bold">REC ●</text>
      <circle cx="130" cy="50" r="14" fill="none" stroke="%23E0F2FE" stroke-width="1" stroke-dasharray="3,3"/>
    </svg>`,
    assetType: "sticker",
    anchor: "nose_bridge",
    transform: {
      x: 0,
      y: -8,
      z: 5,
      scaleX: 1.05,
      scaleY: 1.05,
      uniformScale: true,
      rotation: 0,
      opacity: 0.9,
    },
    blendMode: "screen",
    tintColor: "#06B6D4",
    glowIntensity: 70,
    animation: {
      preset: "pulse",
      speed: 1.5,
      amplitude: 12,
    },
    visible: true,
    locked: false,
  },
  "mystic-butterflies": {
    id: "layer-mystic-butterflies",
    name: "Holographic Butterfly Decal",
    assetUrl: `data:image/svg+xml;utf8,<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="wingGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="%23F472B6"/>
          <stop offset="60%" stop-color="%23818CF8"/>
          <stop offset="100%" stop-color="%23C084FC"/>
        </radialGradient>
      </defs>
      <!-- Left Wing Top -->
      <path d="M 100 70 C 60 10 10 30 20 70 C 30 100 85 85 100 70 Z" fill="url(%23wingGrad)" opacity="0.85"/>
      <!-- Right Wing Top -->
      <path d="M 100 70 C 140 10 190 30 180 70 C 170 100 115 85 100 70 Z" fill="url(%23wingGrad)" opacity="0.85"/>
      <!-- Left Wing Bottom -->
      <path d="M 100 72 C 60 75 40 115 65 130 C 85 140 95 95 100 72 Z" fill="url(%23wingGrad)" opacity="0.75"/>
      <!-- Right Wing Bottom -->
      <path d="M 100 72 C 140 75 160 115 135 130 C 115 140 105 95 100 72 Z" fill="url(%23wingGrad)" opacity="0.75"/>
      <!-- Body -->
      <ellipse cx="100" cy="72" rx="3.5" ry="24" fill="%234C1D95"/>
      <!-- Antennae -->
      <path d="M 100 50 Q 85 30 75 35" stroke="%234C1D95" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 100 50 Q 115 30 125 35" stroke="%234C1D95" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="75" cy="35" r="2.5" fill="%23F472B6"/>
      <circle cx="125" cy="35" r="2.5" fill="%23F472B6"/>
    </svg>`,
    assetType: "sticker",
    anchor: "cheeks",
    transform: {
      x: 0,
      y: 0,
      z: 0,
      scaleX: 0.95,
      scaleY: 0.95,
      uniformScale: true,
      rotation: 0,
      opacity: 0.88,
    },
    blendMode: "normal",
    tintColor: "#EC4899",
    glowIntensity: 35,
    animation: {
      preset: "floating",
      speed: 0.8,
      amplitude: 18,
    },
    visible: true,
    locked: false,
  },
  "sparkle-particles": {
    id: "layer-sparkle-particles",
    name: "Golden Stardust Particles",
    assetUrl: `data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="%23FFFBEB"/>
          <stop offset="60%" stop-color="%23FCD34D"/>
          <stop offset="100%" stop-color="%23F59E0B" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Center Star -->
      <polygon points="100,50 106,85 140,100 106,115 100,150 94,115 60,100 94,85" fill="url(%23starGlow)"/>
      <circle cx="100" cy="100" r="8" fill="%23FFFFFF"/>
      <!-- Peripheral specks -->
      <circle cx="40" cy="60" r="3.5" fill="%23FDE047"/>
      <circle cx="160" cy="65" r="4.5" fill="%23FDE047"/>
      <circle cx="35" cy="140" r="4" fill="%23FDE047"/>
      <circle cx="165" cy="145" r="3" fill="%23FDE047"/>
      <circle cx="80" cy="30" r="2.5" fill="%23FFFFFF"/>
      <circle cx="130" cy="170" r="3" fill="%23FFFFFF"/>
    </svg>`,
    assetType: "texture",
    anchor: "face_oval",
    transform: {
      x: 0,
      y: 0,
      z: 15,
      scaleX: 1.2,
      scaleY: 1.2,
      uniformScale: true,
      rotation: 15,
      opacity: 0.75,
    },
    blendMode: "screen",
    tintColor: "#FBBF24",
    glowIntensity: 50,
    animation: {
      preset: "particle_drift",
      speed: 1.0,
      amplitude: 25,
    },
    visible: true,
    locked: false,
  },
};

export const INITIAL_MANIFEST: ThricoARManifest = {
  manifestVersion: "1.0.0",
  filterId: "filter_festive_royal_001",
  name: "Festive Golden Aura & Crown",
  version: "1.0.0",
  tenantId: "tenant_demo_brand",
  category: "face-mask",
  layers: [
    STARTER_LAYERS["festive-crown"],
    STARTER_LAYERS["sparkle-particles"],
  ],
  platforms: ["web", "ios", "android"],
  budget: {
    maxTextureDim: 2048,
    maxFileSizeKb: 1024,
    polyCountLimit: 25000,
  },
  checksum: "sha256:7b92f9a2e34c98d601bce554b7321e05",
  publishedAt: "2026-10-10T14:20:00.000Z",
  releaseNotes: "Initial production release of the festive face crown and golden particle aura.",
};
