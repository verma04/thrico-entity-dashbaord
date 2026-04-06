# Partner Network Settings — Design Spec

> **Route:** `/rewards/settings/*`
> **Status:** Beta
> **Last updated:** April 2026

---

## Purpose

Lets an entity admin control whether external brands can publish reward offers inside their ecosystem. Split across three focused sub-pages under a shared settings shell.

---

## Route Architecture

```
/rewards/settings                       → General tab  (toggle on/off)
/rewards/settings/partners              → Active Partners tab (approved brands + direct reward links)
/rewards/settings/requests              → Pending Requests tab (review + approve/decline flow)
```

---

## Component Architecture

```
app/(authlayout)/rewards/settings/
├── layout.tsx                          ← PlatformSettingsLayout + PartnerNetworkProvider
├── page.tsx                            ← General tab  (ExternalOfferToggle)
├── partners/
│   └── page.tsx                        ← Active Partners tab (ActivePartnersTable)
└── requests/
    └── page.tsx                        ← Pending Requests tab (PendingRequests + BrandRewardsDialog)

components/rewards/settings/
├── index.ts                            ← barrel export
├── partner-network-context.tsx         ← shared React context + Provider + seed data
├── external-offer-toggle.tsx           ← on/off switch card
├── active-partners-table.tsx           ← partners table with direct reward links
├── pending-requests.tsx                ← request cards (Review / Decline)
├── brand-rewards-dialog.tsx            ← reward selection dialog
└── DESIGN.md                           ← this file
```

---

## State Management

All mutable state lives in `PartnerNetworkProvider` (context). Pages read/write via `usePartnerNetwork()`.

```
PartnerNetworkProvider (layout.tsx)
│
├── acceptExternal: boolean             → General page toggle
├── partners: ActivePartner[]           → Active Partners page table
└── requests: BrandRequest[]            → Requests page cards
    │
    ├── confirmPartnership(id, rewardIds)  → moves request → partners
    └── declineRequest(id)                 → removes request
```

The **dialog state** (`reviewingId`) is local to `requests/page.tsx` — it doesn't need to survive navigation so it stays out of global context.

---

## Approval Flow (Step-by-step)

```
requests/page.tsx
│
1. Admin clicks [Review] on a BrandRequest card
│   └─ setReviewingId(id)
│
2. BrandRewardsDialog opens
│   ├─ Loads rewards from BRAND_REWARD_CATALOGUE[id]
│   ├─ All rewards pre-selected (opt-out model)
│   └─ Admin deselects unwanted rewards
│
3. Admin clicks [Approve Partnership]
│   └─ onConfirm(requestId, selectedRewardIds)
│       └─ confirmPartnership() in context:
│           ├─ Creates ActivePartner with acceptedRewards[]
│           ├─ Each reward has: title, value, type, directLink (URL)
│           ├─ Prepends partner to partners[]
│           └─ Removes request from requests[]
│
4. Dialog closes, request card animates out
5. Partner appears in /rewards/settings/partners table
   └─ "Published Rewards" column → each reward = clickable direct link (new tab)
```

---

## Visual Design System

### Aesthetic direction
**Sober & Refined** — neutral palette via CSS variables. Hierarchy through spacing, weight, subtle surface tones.

### Colour tokens

| Role | Token | Usage |
|---|---|---|
| Surface | `bg-card` / `bg-muted/30` | Cards, table header |
| Text primary | `text-foreground` | Labels, values |
| Text subdued | `text-muted-foreground` | Metadata, col headers |
| Primary accent | `text-primary` / `bg-primary/5` | Badges, links, toggle active |
| Success | `text-emerald-600` `bg-emerald-50` | Active status badge, toggle "On" |
| Danger | `text-destructive` | Toggle "Off" label |
| Alert dot | `bg-rose-500 animate-pulse` | Pending request indicator |

### Typography scale

| Class | Used for |
|---|---|
| `text-sm font-medium` | Body / table values |
| `text-[13px]` | Description text |
| `text-[11px] uppercase tracking-[0.18em] font-semibold` | Section labels |
| `text-[10px] uppercase tracking-widest font-semibold` | Table headers, badges, buttons |

---

## Layout (per tab)

### General tab
```
┌────────────────────────────────┐
│  ExternalOfferToggle (max-w-2xl) │
└────────────────────────────────┘
```

### Active Partners tab
```
┌─────────────────────────────────────────────────────┐
│  Section header: "Active Partners" + count badge     │
├──────────┬───────────────────┬────────┬─────┬───────┤
│  Brand   │  Published Rewards│Redeem. │Status│      │
│          │  (direct links ↗) │        │      │      │
└──────────┴───────────────────┴────────┴─────┴───────┘
```

### Pending Requests tab (max-w-xl)
```
┌──────────────────────────────┐
│  Section header + pulse dot  │
├──────────────────────────────┤
│  BrandRequest card           │
│  ┌──────────────────────┐    │
│  │ Logo  Name  Date     │    │
│  │ "message quote"      │    │
│  │ [Review] [Decline]   │    │
│  └──────────────────────┘    │
│  BrandRequest card           │
│  ...                         │
└──────────────────────────────┘
           ↓ [Review]
┌──────────────────────────────────────────┐
│  BrandRewardsDialog                       │
│  ┌──────────────────────────────────────┐│
│  │ Brand logo + name                    ││
│  │ Select all · X/N selected            ││
│  │ ──────────────────────────────────── ││
│  │ ☑ [icon] Reward title    value  type ││
│  │ ☑ [icon] Reward title    value  type ││
│  │ ☐ [icon] Reward title    value  type ││
│  │ ──────────────────────────────────── ││
│  │ "N rewards will be published..."     ││
│  │              [Cancel] [Approve ✓]    ││
│  └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
```

---

## Accessibility

- Avatars have `alt` = brand name
- All interactive elements keyboard-reachable (`Button`, `Switch`, `Checkbox`, reward `label` elements)
- Status badges use both color and text
- Dialog traps focus via Radix `Dialog`
- Reward labels are proper `<label htmlFor>` associations

---

## Planned Improvements

- [ ] Wire toggle, approve, decline to GraphQL mutations
- [ ] Replace `BRAND_REWARD_CATALOGUE` with a lazy `useQuery` inside the dialog (fetch on open)
- [ ] Show pending count badge on the "Pending Requests" tab button
- [ ] Add empty state for `ActivePartnersTable` when `partners.length === 0`
- [ ] Optimistic updates + `sonner` toasts on approve/decline
- [ ] Pause/unpause partner from the Partners table row
