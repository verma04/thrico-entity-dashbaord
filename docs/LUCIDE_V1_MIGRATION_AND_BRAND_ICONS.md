# Lucide React v1 Upgrade & Brand Icons Architecture

## 1. Executive Summary

When updating `lucide-react` from `0.555.0` to `1.47.0` (Lucide React v1.x), the Next.js Turbopack production build failed with export errors such as:

```text
Error: Export Github doesn't exist in target module
Error: Export Linkedin doesn't exist in target module
Error: Export Twitter doesn't exist in target module
Error: Export Slack doesn't exist in target module
```

This document explains the root cause of this breaking change in Lucide v1, the compatibility architecture created to fix it, and developer guidelines for using icons in this codebase going forward.

---

## 2. Root Cause Analysis

### 2.1 The Lucide v1 Breaking Change
In March 2026, the Lucide project released **Lucide v1.0.0** (followed by incremental releases up to `1.47.0`). As part of the major version 1.0 milestone, the Lucide maintainers formally removed all corporate brand and social platform icons from the package.

**Maintainers' rationale:**
- **Core Focus**: Lucide is designed as a consistent, stroke-based general UI icon system (navigation, actions, status, media, arrows, etc.).
- **Trademark & Brand Volatility**: Brand logos frequently update their visual identity (e.g., Twitter rebranding to X), operate under restrictive trademark guidelines, and do not always conform cleanly to the 24x24 2px stroke grid of general UI icons.
- **Package Bloat**: Deprecating external brand icons keeps the core library lightweight and focused.

### 2.2 Why the Next.js Build Failed
In `lucide-react < 1.0.0` (such as `0.555.0`), symbols like `Github`, `Linkedin`, `Twitter`, and `Slack` were still exported directly from `"lucide-react"`.

When `lucide-react` was upgraded to `1.47.0`, those exports were dropped completely. Next.js Turbopack statically analyzes ES module imports at compile time:

```tsx
// ❌ FAILS in lucide-react 1.x
import { Mail, MapPin, Twitter, Linkedin, Github } from "lucide-react";
```

Because `Twitter`, `Linkedin`, `Github`, and `Slack` no longer exist in `lucide-react/dist/esm/lucide-react.mjs`, Turbopack stopped the build immediately with:
> `The export <Icon> was not found in module ... Did you mean to import ...? All exports of the module are statically known.`

---

## 3. The Compatibility Solution

Rather than downgrading or rewriting all social/brand logic with external libraries, we established a **native Brand Icons Compatibility Layer** inside the application.

### 3.1 Architecture: `components/ui/brand-icons.tsx`

`lucide-react@1.x` still exports the factory function `createLucideIcon(iconName, iconNode)` and the type `IconNode`.

We created [`components/ui/brand-icons.tsx`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/ui/brand-icons.tsx) which recreates the official Lucide brand icons using their original SVG coordinate vectors:

```tsx
import { createLucideIcon } from "lucide-react";
import type { IconNode } from "lucide-react";

// Original SVG definition matching Lucide styling and grid
const linkedinIconNode: IconNode = [
  [
    "path",
    {
      d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
      key: "c2jq9f",
    },
  ],
  ["rect", { width: "4", height: "12", x: "2", y: "9", key: "mk3on5" }],
  ["circle", { cx: "4", cy: "4", r: "2", key: "bt5ra8" }],
];

export const Linkedin = createLucideIcon("Linkedin", linkedinIconNode);
```

#### Supported Brand Icons in `components/ui/brand-icons.tsx`:
- `Github`
- `Linkedin`
- `Twitter`
- `Slack`
- `Facebook`
- `Instagram`
- `Youtube`

### 3.2 Benefits of This Approach
1. **100% API & Prop Parity**: Because these icons are constructed via `createLucideIcon`, they accept the exact same props as all other Lucide icons (`className`, `size`, `color`, `strokeWidth`, etc.).
2. **Zero Visual Regressions**: The SVG vector paths match the existing UI dimensions, viewports, and stroke properties perfectly.
3. **No Extra Heavy Dependencies**: Avoided adding massive multi-megabyte icon libraries.
4. **TypeScript Safety**: Fully typed with Lucide's `LucideIcon` interface.

---

## 4. Updates Applied Across the Repository

### 4.1 Component Static Imports
All components that imported brand icons from `"lucide-react"` were updated to import them from `"@/components/ui/brand-icons"`:

| File | Icons Updated |
| :--- | :--- |
| [`components/members/details/user-info-card.tsx`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/members/details/user-info-card.tsx) | `Twitter`, `Linkedin`, `Github` |
| [`components/events/detail/event-team.tsx`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/events/detail/event-team.tsx) | `Linkedin` |
| [`components/settings/integrations/slack-integration-card.tsx`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/settings/integrations/slack-integration-card.tsx) | `Slack` |
| [`components/mentorship/mentor-list.tsx`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/mentorship/mentor-list.tsx) | `Linkedin` |
| [`components/shared/speakers-display-grid.tsx`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/shared/speakers-display-grid.tsx) | `Linkedin` |
| [`components/shared/team-display-grid.tsx`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/shared/team-display-grid.tsx) | `Linkedin` |
| [`components/wall-of-fame/entry-list.tsx`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/wall-of-fame/entry-list.tsx) | `Linkedin`, `Twitter` |

### 4.2 Dynamic Icon Resolution (`DynamicIcon.tsx`)
In the website layout and CMS preview renderer, icons can be rendered dynamically by name string. We updated [`components/website-layout/preview/DynamicIcon.tsx`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/website-layout/preview/DynamicIcon.tsx) to resolve from both `lucide-react` and `brand-icons`:

```tsx
import * as LucideIcons from "lucide-react";
import * as BrandIcons from "@/components/ui/brand-icons";

export const DynamicIcon = ({ name, className }: DynamicIconProps) => {
  const IconComponent = (LucideIcons as any)[name] || (BrandIcons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};
```

---

## 5. Developer Guide for Adding or Using Icons

### Standard UI Icons (Arrows, Users, Actions, Spinners)
Import directly from `lucide-react`:
```tsx
import { User, Check, ChevronRight, Loader2 } from "lucide-react";
```

### Social & Brand Icons
Import from `@/components/ui/brand-icons`:
```tsx
import { Github, Linkedin, Twitter, Slack, Facebook, Instagram, Youtube } from "@/components/ui/brand-icons";
```

### How to Add a New Brand Icon
If a new brand icon is required in the future:
1. Open [`components/ui/brand-icons.tsx`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/ui/brand-icons.tsx).
2. Define the `IconNode` SVG structure.
3. Export using `createLucideIcon("<IconName>", <iconNode>)`.

Example:
```tsx
const discordIconNode: IconNode = [
  ["path", { d: "...", key: "discord-path" }],
];

export const Discord = createLucideIcon("Discord", discordIconNode);
```

---

## 6. Git History & Commits

- **Commit `adbe25d`**: `chore(deps): update lucide-react to 1.47.0`
  - Upgraded `lucide-react` dependency and lockfile to `1.47.0`.
- **Commit `74ef906`**: `fix(icons): create brand-icons compatibility layer for lucide-react 1.x`
  - Added [`components/ui/brand-icons.tsx`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/ui/brand-icons.tsx).
  - Fixed all 7 component imports.
  - Enhanced `DynamicIcon` fallback resolution.
