import { FaceAnchorType } from "../types/ar-manifest";

export interface FaceLandmarkMap {
  forehead: { x: number; y: number };
  left_eye: { x: number; y: number };
  right_eye: { x: number; y: number };
  nose_bridge: { x: number; y: number };
  cheeks: { x: number; y: number }; // center-between
  mouth: { x: number; y: number };
  chin: { x: number; y: number };
  face_oval: { x: number; y: number };
  free_float: { x: number; y: number };
}

export interface SampleFacePreset {
  id: string;
  name: string;
  gender: "female" | "male" | "neutral";
  expression: string;
  tone: string;
  avatarSvg: string; // inline SVG avatar representation
  landmarks: FaceLandmarkMap;
}

export const SAMPLE_FACE_PRESETS: SampleFacePreset[] = [
  {
    id: "priya-festive",
    name: "Priya — Festive Glamour",
    gender: "female",
    expression: "Warm Smile",
    tone: "Golden Warm",
    avatarSvg: `<svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skin1" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#F2C5A0"/>
          <stop offset="70%" stop-color="#DDA078"/>
          <stop offset="100%" stop-color="#BA7750"/>
        </radialGradient>
        <radialGradient id="hair1" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stop-color="#2D1A16"/>
          <stop offset="100%" stop-color="#140A08"/>
        </radialGradient>
      </defs>
      <!-- Background glow -->
      <rect width="400" height="500" fill="#18181B"/>
      <circle cx="200" cy="220" r="180" fill="#27272A" opacity="0.4"/>
      <!-- Hair back -->
      <path d="M 100 200 C 70 300 70 420 120 480 L 280 480 C 330 420 330 300 300 200 Z" fill="url(#hair1)"/>
      <!-- Neck -->
      <path d="M 160 330 L 160 440 L 240 440 L 240 330 Z" fill="#BA7750"/>
      <!-- Face Oval -->
      <ellipse cx="200" cy="235" rx="88" ry="115" fill="url(#skin1)"/>
      <!-- Hair front / bangs -->
      <path d="M 112 210 C 130 110 270 110 288 210 C 265 160 220 145 200 145 C 180 145 135 160 112 210 Z" fill="url(#hair1)"/>
      <!-- Eyebrows -->
      <path d="M 140 190 Q 165 178 182 188" stroke="#3A2016" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <path d="M 218 188 Q 235 178 260 190" stroke="#3A2016" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <!-- Eyes -->
      <ellipse cx="160" cy="210" rx="16" ry="9" fill="#FFFFFF"/>
      <circle cx="162" cy="210" r="6" fill="#3D2012"/>
      <circle cx="164" cy="208" r="2" fill="#FFFFFF"/>
      <ellipse cx="240" cy="210" rx="16" ry="9" fill="#FFFFFF"/>
      <circle cx="238" cy="210" r="6" fill="#3D2012"/>
      <circle cx="240" cy="208" r="2" fill="#FFFFFF"/>
      <!-- Nose -->
      <path d="M 200 215 Q 198 250 193 256 Q 200 260 207 256" stroke="#9E5D3B" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Cheeks blush -->
      <circle cx="145" cy="255" r="20" fill="#E86C65" opacity="0.22"/>
      <circle cx="255" cy="255" r="20" fill="#E86C65" opacity="0.22"/>
      <!-- Lips -->
      <path d="M 175 295 Q 200 286 225 295 Q 200 318 175 295 Z" fill="#D44955"/>
      <path d="M 175 295 Q 200 300 225 295" stroke="#941E28" stroke-width="1.5" fill="none"/>
    </svg>`,
    landmarks: {
      forehead: { x: 0.5, y: 0.28 },
      left_eye: { x: 0.4, y: 0.42 },
      right_eye: { x: 0.6, y: 0.42 },
      nose_bridge: { x: 0.5, y: 0.49 },
      cheeks: { x: 0.5, y: 0.53 },
      mouth: { x: 0.5, y: 0.61 },
      chin: { x: 0.5, y: 0.72 },
      face_oval: { x: 0.5, y: 0.48 },
      free_float: { x: 0.5, y: 0.15 },
    },
  },
  {
    id: "kai-cyber",
    name: "Kai — Cyber Modern",
    gender: "male",
    expression: "Neutral Focus",
    tone: "Cool Neutral",
    avatarSvg: `<svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skin2" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#F5D8C4"/>
          <stop offset="70%" stop-color="#DEB095"/>
          <stop offset="100%" stop-color="#9C6B52"/>
        </radialGradient>
        <radialGradient id="hair2" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stop-color="#3F3F46"/>
          <stop offset="100%" stop-color="#18181B"/>
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill="#09090B"/>
      <!-- Cyber background grid lines -->
      <line x1="0" y1="250" x2="400" y2="250" stroke="#27272A" stroke-width="1" stroke-dasharray="4,4"/>
      <line x1="200" y1="0" x2="200" y2="500" stroke="#27272A" stroke-width="1" stroke-dasharray="4,4"/>
      <!-- Neck -->
      <path d="M 155 330 L 155 450 L 245 450 L 245 330 Z" fill="#9C6B52"/>
      <!-- Strong Jaw Face Oval -->
      <polygon points="120,190 125,270 155,340 245,340 275,270 280,190 200,140" fill="url(#skin2)"/>
      <!-- Hair Short Fade -->
      <path d="M 115 190 Q 200 95 285 190 Q 260 140 200 135 Q 140 140 115 190 Z" fill="url(#hair2)"/>
      <!-- Eyebrows Angular -->
      <path d="M 138 185 L 180 185" stroke="#261A14" stroke-width="5" stroke-linecap="round"/>
      <path d="M 220 185 L 262 185" stroke="#261A14" stroke-width="5" stroke-linecap="round"/>
      <!-- Eyes Sharp -->
      <polygon points="144,205 178,202 176,214 146,215" fill="#FFFFFF"/>
      <circle cx="162" cy="208" r="5" fill="#1E293B"/>
      <polygon points="222,202 256,205 254,215 224,214" fill="#FFFFFF"/>
      <circle cx="238" cy="208" r="5" fill="#1E293B"/>
      <!-- Nose Chiseled -->
      <path d="M 200 200 L 195 248 L 208 248" stroke="#7A4E38" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Mouth Neutral -->
      <path d="M 178 290 L 222 290" stroke="#854636" stroke-width="4.5" stroke-linecap="round"/>
    </svg>`,
    landmarks: {
      forehead: { x: 0.5, y: 0.27 },
      left_eye: { x: 0.4, y: 0.41 },
      right_eye: { x: 0.6, y: 0.41 },
      nose_bridge: { x: 0.5, y: 0.48 },
      cheeks: { x: 0.5, y: 0.54 },
      mouth: { x: 0.5, y: 0.60 },
      chin: { x: 0.5, y: 0.70 },
      face_oval: { x: 0.5, y: 0.47 },
      free_float: { x: 0.5, y: 0.15 },
    },
  },
  {
    id: "elena-studio",
    name: "Elena — Studio Chic",
    gender: "female",
    expression: "Playful Angle",
    tone: "Porcelain Fair",
    avatarSvg: `<svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skin3" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#FFF0E5"/>
          <stop offset="70%" stop-color="#FCD5BD"/>
          <stop offset="100%" stop-color="#EAA684"/>
        </radialGradient>
        <radialGradient id="hair3" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#92400E"/>
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill="#1C1917"/>
      <!-- Hair curls back -->
      <path d="M 90 190 C 50 320 60 450 110 490 L 290 490 C 340 450 350 320 310 190 Z" fill="url(#hair3)"/>
      <!-- Neck -->
      <path d="M 165 330 L 165 440 L 235 440 L 235 330 Z" fill="#EAA684"/>
      <!-- Soft Oval -->
      <ellipse cx="200" cy="230" rx="84" ry="110" fill="url(#skin3)"/>
      <!-- Hair front swept -->
      <path d="M 116 200 C 130 110 270 100 284 190 C 250 140 210 130 180 140 C 140 150 120 180 116 200 Z" fill="url(#hair3)"/>
      <!-- Eyebrows Arched -->
      <path d="M 142 188 Q 166 172 182 184" stroke="#78350F" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 218 184 Q 234 172 258 188" stroke="#78350F" stroke-width="4" fill="none" stroke-linecap="round"/>
      <!-- Eyes Big / Cat-eye -->
      <ellipse cx="160" cy="206" rx="15" ry="9" fill="#FFFFFF"/>
      <circle cx="162" cy="206" r="6" fill="#047857"/>
      <circle cx="164" cy="204" r="2" fill="#FFFFFF"/>
      <ellipse cx="240" cy="206" rx="15" ry="9" fill="#FFFFFF"/>
      <circle cx="238" cy="206" r="6" fill="#047857"/>
      <circle cx="240" cy="204" r="2" fill="#FFFFFF"/>
      <!-- Nose small -->
      <path d="M 200 210 Q 198 244 195 248 Q 200 252 205 248" stroke="#D97706" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Cheeks peach -->
      <circle cx="145" cy="250" r="18" fill="#F43F5E" opacity="0.25"/>
      <circle cx="255" cy="250" r="18" fill="#F43F5E" opacity="0.25"/>
      <!-- Lips Berry -->
      <path d="M 178 290 Q 200 282 222 290 Q 200 310 178 290 Z" fill="#BE123C"/>
    </svg>`,
    landmarks: {
      forehead: { x: 0.5, y: 0.28 },
      left_eye: { x: 0.4, y: 0.41 },
      right_eye: { x: 0.6, y: 0.41 },
      nose_bridge: { x: 0.5, y: 0.48 },
      cheeks: { x: 0.5, y: 0.52 },
      mouth: { x: 0.5, y: 0.60 },
      chin: { x: 0.5, y: 0.71 },
      face_oval: { x: 0.5, y: 0.47 },
      free_float: { x: 0.5, y: 0.15 },
    },
  },
];

export function getAnchorCoordinates(
  anchor: FaceAnchorType,
  landmarks: FaceLandmarkMap
): { x: number; y: number } {
  return landmarks[anchor] || landmarks.forehead;
}
