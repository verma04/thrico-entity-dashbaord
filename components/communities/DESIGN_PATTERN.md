# Design Pattern: Communities Module (/communities)

This document outlines the design, architectural, and UI/UX patterns used for the Communities module in the Thrico Entity Dashboard.

---

## 1. Overview
The Communities module provides a comprehensive hub for community & group management, analytics, visual graph networks, and administrative oversight. It separates analytical insights from directory operations while maintaining unified design language with the members and core dashboard systems.

---

## 2. Directory & Component Architecture

```
components/communities/
├── dashboard/                              # Analytics & KPI Overview Components
│   ├── index.ts                            # Barrel export
│   ├── analytics.tsx                       # Dashboard view & layout orchestrator
│   ├── communities-kpi-overview.tsx        # High-level metric summary cards
│   ├── top-communities-card.tsx            # Leaderboard ranking list
│   ├── top-creators-card.tsx               # Creator ranking & spotlight
│   ├── community-status-distribution.tsx   # Status distribution donut chart & legend
│   ├── communities-status-chart.tsx        # Status pie chart visualization
│   ├── top-active-communities-chart.tsx    # Vertical bar chart visualization
│   ├── weekly-signups-chart.tsx            # Growth trend area chart
│   └── community-performance-table.tsx     # Performance analytics table
├── manage/                                 # Community Directory & Action Components
│   ├── index.ts                            # Barrel export
│   ├── communities-manage.tsx              # Main directory view (filters, search, views)
│   ├── communities-list.tsx                # TanStack / AdminTable list view
│   ├── community-card.tsx                  # Interactive grid card view
│   └── community-actions.tsx               # Status dialogs & contextual dropdown
├── add/                                    # Creation Flow
│   └── community-creation-form.tsx         # Multi-step creation form
├── details/                                # Detail Views & Tabs
├── settings/                               # Community Level Settings
├── ts-types.ts                             # Entity interfaces & type definitions
├── utils.tsx                               # Formatting & dialog helper utilities
└── DESIGN_PATTERN.md                       # Design and architecture guide
```

---

## 3. Route Mapping

| Route | Purpose | Component |
| :--- | :--- | :--- |
| `/communities` | High-level analytics & metrics overview | `CommunitiesAnalytics` (`components/communities/dashboard/analytics.tsx`) |
| `/communities/all` | Directory table & grid management | `CommunitiesManage` (`components/communities/manage/communities-manage.tsx`) |
| `/communities/graph` | Interactive network graph | `CommunitiesGraphView` |
| `/communities/create` | Community creation wizard | `CommunityCreationForm` |
| `/communities/[id]/about` | Single community profile & statistics | Community detail views |

---

## 4. UI/UX & Interaction Principles

### State Management & URL Synchronization
- **Search Query (`q`)**: Synced to URL params with a 500ms debounce.
- **Status Filter (`status`)**: Synchronized to URL query (`ALL`, `APPROVED`, `PENDING`, `DISABLED`, `REJECTED`, `PAUSED`).
- **View Toggle (`view`)**: Switches between `'grid'` and `'table'`.
- **Date Range**: Synchronized with GraphQL query variables (`LAST_24_HOURS`, `LAST_7_DAYS`, `LAST_30_DAYS`, `LAST_90_DAYS`).

### Motion & Transitions
- `framer-motion` handles page entries and view transitions using `AnimatePresence`.
- Tactile hover lift (`y: -8px`) and shadow escalation on community cards.
- Smooth radial pie charts and area gradients powered by Recharts.

### Permissions & Access Control
- All pages are guarded with `withModulePermission(..., "COMMUNITIES", "canRead" | "canCreate")`.
- Dynamic naming support via `useModuleStore` (`communityModuleName`, `communitySingularName`).
