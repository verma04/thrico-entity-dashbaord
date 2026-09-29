# /brag-slim Plan: Thrico Entity Dashboard

## Overview
- **Product:** Thrico Entity Dashboard (`thrico-entity-dashboard`)
- **Angle:** The All-In-One Community Operating System — replacing disjointed tools (Slack, forums, job boards, forms, spreadsheets) with a single high-performance dashboard that powers community, mentorship, jobs, gamification, and real-time analytics.
- **Tone:** `polished` / `cinematic-tech` (slick dark-mode aesthetic with Thrico's signature coral-to-electric-blue gradient voltage, crisp kinetic typography, and fluid micro-animations).
- **Format:** Landscape (1920×1080), 30 fps
- **Duration:** 20.0 seconds (600 frames)
- **Target Deliverable:** `brag-output/brag.mp4`, `brag-output/brag.jpg` (poster), `brag-output/share-copy.txt`

---

## Visual Identity
- **Primary Canvas:** Deep obsidian dark mode (`#070A0F`, `#0D1117`, `#111827`)
- **Brand Accents:**
  - Electric Blue: `#0d63f4` / `#0866ff`
  - Vibrant Coral/Orange: `#fd5531` / `#ff5733`
  - Emerald Success: `#10b981`
  - Purple Mentorship: `#8b5cf6`
  - Amber Gamification: `#f59e0b`
  - Rose Live Events: `#f43f5e`
- **Typography:** Display headlines in Roobert / Inter Bold with tight letter-spacing (`-0.03em`), clean UI body in Figtree/Inter, monospace metrics in Geist Mono.
- **Assets:** Official `thrico-logo.svg`, `thrico_ai.svg`, custom SVG icon set from Lucide, and actual product UI layouts from `components/home/`.

---

## Storyboard (20s Total)

### Scene 1: The Hook (0.0s – 3.0s | 90 frames)
- **Beat:** Entry & Problem Hook
- **Visual:** Pitch-black canvas awakens with a glowing particle-grid mesh. The iridescent 3D Thrico AI emblem radiates outward with soft neon caustic flares. Kinetic typography hits: "STOP STITCHING 10 DIFFERENT TOOLS."
- **Settled Line:** "THE ALL-IN-ONE COMMUNITY OS"
- **Audio:** Deep sub-bass swell, subtle mechanical riser, synchronized hit on title reveal.

### Scene 2: Live Command Center (3.0s – 7.5s | 135 frames)
- **Beat:** Core Vitals & Real-Time Intelligence
- **Visual:** Camera pushes smoothly into the Thrico Command Center. Real-time KPI cards animate up with rolling counters:
  - Active Members: **24,850** (+18.4% ↗)
  - Community Health Index: **98.4 / 100**
  - Member Retention: **88.6%**
  - Engagement Velocity: **94.2%**
  Luminous neon area chart draws a live upward growth trajectory with pulsating data nodes.
- **Settled Line:** "Real-time vitals. Zero guesswork."
- **Audio:** Driving 120bpm electronic pulse, soft click sequence for number rollups.

### Scene 3: The Modular Ecosystem (7.5s – 12.0s | 135 frames)
- **Beat:** Feature Density & Unification
- **Visual:** The dashboard seamlessly cascades into the 6 core ecosystem modules with live status badges:
  - 💬 **Discussion Forums:** 2,410 active threads & Q&A
  - 💼 **Job Board & Hiring:** 142 vetted opportunities
  - 🤝 **Mentorship Engine:** 89 active pairings & 1-on-1s
  - 🪙 **Wallet & Gamification:** 1.2M karma coins distributed
  - 🛡️ **Safety & Trust Radar:** 100% automated moderation
  Cursor glides across, spotlighting a module card with ambient glow and hover depth.
- **Settled Line:** "Forums. Jobs. Mentorship. Rewards. All connected."
- **Audio:** Crisp rhythmic synth arpeggios, soft swooshes on card arrivals.

### Scene 4: Member Impact & Leaderboard (12.0s – 16.5s | 135 frames)
- **Beat:** Human Connection & Motivation Loop
- **Visual:** Focus snaps to the Community Leaderboard and Live Impact Activity:
  - Live activity ticker: *"Sarah Chen unlocked Tier 3 Mentor"*, *"Alex R. claimed 500 Karma Coins"*.
  - Golden trophy badge unlocks with sparkle particle burst.
  - Conversion & retention funnel expanding outward with glowing metrics.
- **Settled Line:** "Turn passive members into active leaders."
- **Audio:** Harmonic brass/synth rise, euphoric achievement chime on badge pop.

### Scene 5: The Punchline & Outro (16.5s – 20.0s | 105 frames)
- **Beat:** Resolution & Call to Action
- **Visual:** Cinematic wide pullback showcasing the full Thrico platform inside an ultra-sleek glassmorphic frame with gentle ambient lighting.
  - Full Thrico branding: Official vector logo + "thrico communities"
  - Primary glowing CTA button: "Launch Your Community Ecosystem"
  - URL lockup: `thrico.com`
- **Settled Line:** "One platform. Every connection that matters."
- **Poster Frame:** Settled frame at t = 18.0s (Frame 540)
- **Audio:** Deep sub impact, resonant piano/synth chord resolve, gentle reverb decay.

---

## Technical Execution Plan
1. **Audio Synthesis:** Generate custom multi-track WAV (120 BPM, sub-bass, synths, chord progression, risers, click SFX, and chime) using procedural synthesis in Python.
2. **Visual Renderer:** High-fidelity HTML5/Canvas/CSS page with exact SVG assets, 1920×1080 resolution, styled with Thrico brand tokens. Driven by Puppeteer at 30 fps via deterministic `renderFrame(timestampMs)`.
3. **Quality Check:** Export and inspect test stills across all scenes and mid-transitions to guarantee zero clipping, high contrast, and flawless typographic alignment.
4. **Encoding:** FFmpeg assembly into `brag.mp4` with AAC audio, baking settled poster frame as Frame 0. Extract `brag.jpg`.
5. **Copy:** Write high-converting, punchy `share-copy.txt`.
