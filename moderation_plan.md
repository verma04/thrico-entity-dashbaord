# Moderation Modernization Plan

Modernize the content moderation section (Dashboard, Banned Words, Blocked Links, Reports, and Settings) with the "SaaS 2026" design system: professional, sober, and modular.

## 1. Global Navigation & Layout
- Ensure `moderation/layout.tsx` uses the updated `MenuItemsLayout`.
- Standardize icons and navigation labels.

## 2. Moderation Dashboard
- Refactor `ModerationDashboard` component.
- Use `EcosystemHeader` with clean metrics.
- Replace high-contrast widgets with sober `SectionCard` equivalents.
- Improve information hierarchy for pending reports and system health.

## 3. Banned Words & Blocked Links
- Standardize using `EcosystemHeader` and `EcosystemActionBar`.
- Implement `SectionCard` for the main list and stats.
- Clean up the `DataTable` styling to match the new system.
- Standardize Dialogs for add/edit operations.

## 4. Reported Content Management
- Modernize the report queue with clear status badges and action dropdowns.
- Use the same `Ecosystem` primitives for consistency.
- Improve the filter UI in the `EcosystemActionBar`.

## 5. Moderation Settings
- Refactor preferences and auto-mod settings into a clean, section-based layout.

## 6. Validation
- Verify all links and routes.
- Ensure type safety and resolve any lint errors.
