# Design Pattern: Members Directory (/members/all)

This document outlines the design architectural and UI/UX patterns used for the Members Directory in the Thrico Entity Dashboard.

## 1. Overview
The Members Directory is a high-traffic administrative page designed for managing community participants. It prioritizes clarity, searchability, and quick actions through a dual-view system (Grid and Table).

## 2. UI/UX Principles
- **Premium Aesthetics**: High-contrast typography, subtle shadows, and rounded corners (2xl/xl).
- **Instant Feedback**: Hover effects on cards, real-time search filtering, and skeleton loaders.
- **Premium Animations**: Uses `framer-motion` for page entry and view switching (`AnimatePresence`) to provide a fluid, high-end feel.
- **Contextual Actions**: Action menus (Dropdowns) placed consistently for each member record.
- **Adaptability**: Responsive layout that switches from multi-column grids to single-column lists on smaller screens.

## 3. Component Architecture

### Page Level (`app/(authlayout)/members/(all-members)/all/page.tsx`)
- Lightweight client-side entry point.
- Delegates all logic to the `User` component with a default status of `"ALL"`.

### Core Logic (`components/members/users/user.tsx`)
- **State Management**:
  - `view`: Toggles between `'grid'` and `'table'`.
  - `search`: Stores the current search query.
  - `status`: Stores the lifecycle filter (e.g., APPROVED, PENDING).
- **Data Fetching**: Uses `useGetAllUser` hook for real-time member data.
- **Client-Side Filtering**: Filters data locally for instant responsiveness.

### Presentation Components
1.  **`UserList`**:
    - **Pattern**: TanStack Table implementation.
    - **Visuals**: Clean rows, semantic badges, and avatar group for "Member" column.
2.  **`MembersListCards`**:
    - **Pattern**: Responsive Flex/Grid with premium `Card` components.
    - **Visuals**: Banner backgrounds, elevated avatar positions, and summary stats.
3.  **`UserActions`**:
    - **Pattern**: Reusable Dropdown menu for member-specific operations (Edit, Message, Verify).

## 4. Visual Language

### Color System (Badges & Indicators)
- **Approved**: Emerald (`bg-emerald-50`, `text-emerald-700`)
- **Pending**: Amber (`bg-amber-50`, `text-amber-700`)
- **Blocked/Rejected**: Rose/Slate (`bg-rose-50`, `text-rose-700`)
- **Disabled**: Orange (`bg-orange-50`, `text-orange-700`)

### Header Style
- **Icon Container**: 14x14 (`h-14 w-14`) with a `linear-to-br` gradient from blue-600 to indigo-700.
- **Typography**: `font-black tracking-tight` for titles.

## 5. Implementation Pattern (Code)

To maintain consistency when creating similar directory pages, follow this JSX structure:

```tsx
<div className="space-y-6">
  {/* 1. Header with Title and View Switcher */}
  <div className="flex justify-between items-end">
    <Header title="Members Directory" description="..." />
    <ViewTabs view={view} setView={setView} />
  </div>

  {/* 2. Search and Filter Bar */}
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
    <SearchInput value={search} onChange={...} />
    <StatusFilter value={status} onChange={...} />
  </div>

  {/* 3. Conditional View Rendering with Transitions */}
  <AnimatePresence mode="wait">
    {loading ? <LoadingSkeleton key="loading" /> : (
      <motion.div key={view} ...>
        {view === 'grid' ? <GridView data={filtered} /> : <TableView data={filtered} />}
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

## 6. Motion Patterns
- **Page Entry**: `y: 20 -> 0` with `staggerChildren` for a "wave" effect on page elements.
- **View Switch**: `scale: 0.98 -> 1` and `opacity: 0 -> 1` using `AnimatePresence` to avoid layout jumps.
- **Hover State**: Icons in the header use `scale: 1.05` on hover for subtle tactile feedback.

## 7. Interaction Pattern
- **Search**: Triggered on input change (can be debounced if data set grows > 1000).
- **Status Change**: Fetches new data or filters existing set via GraphQL query variables.
- **Navigation**: Clicking an avatar or name navigates to the detailed profile: `/members/[id]`.

---

*This pattern ensures a consistent and premium experience across all member-related directories within the application.*
