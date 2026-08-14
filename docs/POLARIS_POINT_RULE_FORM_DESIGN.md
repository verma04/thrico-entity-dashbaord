# Polaris Form Design Standard: Point Rule Creation Engine
**Route**: `/gamification/points-and-badges/points/create`  
**Architecture**: Shopify Polaris-inspired 2-Column Responsive Layout with Sticky Simulator and Floating Bottom Action Bar.

---

## 1. Executive Summary & Design System Alignment

The Point Rule Creation Engine allows community and ecosystem managers to commission points reward rules across platform modules (feed, events, forums, chat) and third-party integrations (Shopify, retail webhooks). 

The UI implements the **Thrico Polaris Form Design Standard**, characterized by:
- **Maximum Width**: `1040px` centered canvas with responsive padding (`px-4 sm:px-6 md:px-8`).
- **Asymmetric 2-Column Grid**: 8-column main configuration pane (`lg:col-span-8`) + 4-column contextual sticky sidebar (`lg:col-span-4`).
- **Progressive Disclosure**: Numbered step cards (`PolarisFormCard`) guiding the merchant logically from event triggers to payout economics and anti-abuse safeguards.
- **Live Real-time Simulation**: Interactive customer experience toast preview that dynamically calculates point payouts, action names, and channel attribution as the user types.
- **Non-blocking Persistence**: `FloatingSavePanel` sticky bottom action bar displaying unsaved states, loading spinners, and discard options.

---

## 2. Layout Structure & Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header: "Point Engine" • Badge: "{Studio} Studio" • Zap Icon                │
│ Breadcrumbs: Gamification > Points > Add Rule                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ Max Width: 1040px Container                                                 │
│                                                                             │
│ ┌──────────────────────────────────────┬──────────────────────────────────┐ │
│ │ Main Form (8 Columns)                │ Sticky Sidebar (4 Columns)       │ │
│ │                                      │                                  │ │
│ │ ┌──────────────────────────────────┐ │ ┌──────────────────────────────┐ │ │
│ │ │ Step 1: Origin & Event Trigger   │ │ │ Customer Experience Preview  │ │ │
│ │ │  • Origin Channel Picker         │ │ │  [Live Simulator]           │ │ │
│ │ │    [Platform Module] [Connected] │ │ │  ┌────────────────────────┐  │ │ │
│ │ │  • Target Module / App Dropdown  │ │ │  │ ⚡ +50 Points Awarded!  │  │ │ │
│ │ │  • Trigger Event Dropdown        │ │ │  │ For posting a thread.  │  │ │ │
│ │ │  • Reward Cadence (1st/Recurring)│ │ │  │ Channel: Forum Module  │  │ │ │
│ │ │  • Merchant Note / Description   │ │ │  └────────────────────────┘  │ │ │
│ │ └──────────────────────────────────┘ │ │                              │ │ │
│ │                                      │ │  • Summary Breakdown Rows:   │ │ │
│ │ ┌──────────────────────────────────┐ │ │    - Channel Origin          │ │ │
│ │ │ Step 2: Points Economics         │ │ │    - Target Trigger          │ │ │
│ │ │  • Hero Point Input [ 50 ] PTS   │ │ │    - Daily Payout Cap        │ │ │
│ │ │  • Quick Preset Chips:           │ │ │    - Weekly Payout Cap       │ │ │
│ │ │    [+5][+10][+25][+50][+100][+500] │ │    - Monthly Payout Cap      │ │ │
│ │ └──────────────────────────────────┘ │ └──────────────────────────────┘ │ │
│ │                                      │                                  │ │
│ │ ┌──────────────────────────────────┐ │ ┌──────────────────────────────┐ │ │
│ │ │ Step 3: Velocity & Anti-Abuse    │ │ │ Merchant Economy Tip Card    │ │ │
│ │ │  • Frequency Cap Info Banner     │ │ │ "Calibrate point values so   │ │ │
│ │ │  • Daily Cap Input (/ day)       │ │ │  high-friction actions... "  │ │ │
│ │ │  • Weekly Cap Input (/ week)     │ │ └──────────────────────────────┘ │ │
│ │ │  • Monthly Cap Input (/ month)   │ │                                  │ │
│ │ └──────────────────────────────────┘ │                                  │ │
│ └──────────────────────────────────────┴──────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ FloatingSavePanel: [Unsaved Rule Changes] • [Reset] [Save Rule Button]      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Component Breakdown

### A. Navigation & Ecosystem Header
- **Component**: `<EcosystemHeader />`
- **Location**: `app/(authlayout)/gamification/points-and-badges/points/create/page.tsx`
- **Properties**:
  - `title`: `"Point Engine"`
  - `badgeText`: `"${gamificationModuleName} Studio"`
  - `description`: `"Define new rules for how members earn points across your community."`
  - `icon`: `Zap` (Lucide icon)
  - `breadcrumbs`:
    - `Gamification` (`/gamification`)
    - `Points` (`/gamification/points-and-badges`)
    - `Add Rule`

### B. Step 1: Origin & Event Trigger (`PolarisFormCard` Step 1)
1. **Origin Channel Picker (`PolarisOriginPicker`)**:
   - Allows switching between **Core Platform Modules** (`MODULE`) and **Connected Apps & Store** (`INTEGRATION`).
   - Displays active count badges (e.g., `8 Active`, `2 Apps`).
   - Active state highlighted with `#008060` (Shopify Emerald) border and subtle ring.
2. **Target Source Selector**:
   - Dynamically filters modules or connected integrations based on the chosen origin channel.
   - Features contextual icons via `getSourceIcon()` (e.g., Shopify bag, Feed speech bubbles, Forum message square).
3. **Trigger Event Selector**:
   - Dynamically lists triggers filtered by the chosen module/integration.
   - Renders event descriptions and formatted snake_case action titles.
4. **Reward Cadence**:
   - `FIRST_TIME`: One-off milestone rewarded only once per account lifetime.
   - `RECURRING`: Rewarded on each occurrence, constrained by frequency caps.
5. **Merchant Description**:
   - Contextual note detailing rule execution criteria.

### C. Step 2: Points Economics (`PolarisFormCard` Step 2)
1. **Hero Point Input**:
   - Prominent `h-11` input with `Zap` icon in `text-emerald-600` and `PTS` suffix badge.
   - Bold typography (`text-base font-bold`) for immediate clarity.
2. **Quick Preset Chips (`PolarisPresetChips`)**:
   - Single-click increment buttons: `+5`, `+10`, `+25`, `+50`, `+100`, `+250`, `+500`.
   - Selected preset is highlighted in dark zinc pill (`bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900`).

### D. Step 3: Velocity & Anti-Abuse Frequency Controls (`PolarisFormCard` Step 3)
1. **Informational Banner (`PolarisInfoBanner`)**:
   - Explains how frequency limits prevent point farming and gaming.
2. **Tri-column Frequency Cap Grid (`PolarisCapInput`)**:
   - **Daily Cap**: Enforces max rewards allowed in a 24-hour cycle (`/ day`).
   - **Weekly Cap**: Enforces max rewards allowed in a 7-day rolling window (`/ week`).
   - **Monthly Cap**: Enforces max rewards allowed in a 30-day billing cycle (`/ month`).
   - Includes instant `"Unlimited"` reset button to clear constraints.

### E. Sticky Contextual Sidebar (`lg:col-span-4`)
1. **Customer Experience Live Simulator (`PolarisSidebarCard`)**:
   - Live notification pill preview showing:
     - Emerald icon badge with `Zap` fill.
     - Live point counter (`+X Points Awarded!`).
     - Real-time humanized action description.
     - Origin channel attribution.
2. **Structured Summary Rows (`PolarisSummaryRow`)**:
   - Key-value breakdown of Channel, Trigger Cadence, and Caps.
3. **Merchant Economy Tip Card (`PolarisTipCard`)**:
   - Actionable gamification advice for balanced member incentives.

### F. Floating Action Bar (`FloatingSavePanel`)
- Activates automatically when `formik.dirty` is true.
- Displays save status, validation state, and handles API mutation execution.

---

## 4. Design System Tokens & Styling Specifications

| UI Element | CSS / Tailwind Tokens | Dark Mode Support |
| :--- | :--- | :--- |
| **Canvas Background** | `bg-[#fafafa]` | `dark:bg-black/10` |
| **Card Container** | `border border-zinc-200/80 bg-white rounded-xl shadow-sm` | `dark:border-zinc-800 dark:bg-zinc-900/90` |
| **Card Header** | `border-b border-zinc-100 px-6 py-4 bg-zinc-50/50` | `dark:border-zinc-800/80 dark:bg-zinc-900/40` |
| **Step Number Badge** | `h-6 w-6 rounded-md bg-zinc-900 text-white font-bold text-xs` | `dark:bg-zinc-100 dark:text-zinc-900` |
| **Form Inputs & Selects**| `h-10 bg-zinc-50/50 border-zinc-200 text-xs font-semibold` | `dark:bg-zinc-900/50 dark:border-zinc-800` |
| **Form Labels** | `text-xs font-semibold text-zinc-700` | `dark:text-zinc-300` |
| **Validation Errors** | `text-[11px] text-rose-500 font-medium` | `text-rose-400` |
| **Primary Accent Color**| `zinc-900` / `black` (Monochrome Standard) | `dark:zinc-100` |
| **Origin Picker Active**| `border-zinc-900 bg-zinc-900/[0.04] ring-2 ring-zinc-900/20` | `dark:border-zinc-100 dark:bg-zinc-100/10 dark:ring-zinc-100/20` |
| **Preset Chip (Active)**| `bg-zinc-900 text-white border-zinc-900` | `dark:bg-zinc-100 dark:text-zinc-900` |
| **Preset Chip (Inactive)**| `bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100` | `dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300` |

---

## 5. Verification & Schema Validation

- **Formik Validation Schema**:
  - `module`: Required string.
  - `action`: Required string.
  - `trigger`: Required (`FIRST_TIME` or `RECURRING`).
  - `points`: Required positive integer ($\ge 1$).
  - `dailyCap`: Nullable number ($\ge 0$).
  - `weeklyCap`: Nullable number ($\ge 0$).
  - `monthlyCap`: Nullable number ($\ge 0$).
  - `description`: Max 200 characters string.
