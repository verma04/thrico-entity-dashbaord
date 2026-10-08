import type { MenuItem } from "./types";

export type ActiveSidebarTab =
  | "home"
  | "members"
  | "content"
  | "gamification"
  | "modules"
  | "integrations"
  | "email"
  | "website"
  | "mobile-app"
  | "ai"
  | "team"
  | "upgrade"
  | "settings";

export function getActiveSidebarTab(pathName?: string | null): ActiveSidebarTab {
  if (!pathName) return "home";

  // Normalize pathname (strip query params and trailing slash)
  const path = pathName.split("?")[0].replace(/\/+$/, "") || "/";

  // 1. Integrations
  if (
    path.startsWith("/settings/integrations") ||
    path.startsWith("/integrations")
  ) {
    return "integrations";
  }

  // 2. Team Management
  if (path.startsWith("/settings/users")) {
    return "team";
  }

  // 3. Subscription & Upgrade
  if (
    path.startsWith("/settings/subscription") ||
    path.startsWith("/settings/billing")
  ) {
    return "upgrade";
  }

  // 4. AI Studio & Agents
  if (path.startsWith("/ai") || path.startsWith("/ai-agent")) {
    return "ai";
  }

  // 5. Gamification & Rewards
  if (path.startsWith("/gamification") || path.startsWith("/rewards")) {
    return "gamification";
  }

  // 6. Members
  if (path.startsWith("/members")) {
    return "members";
  }

  // 7. Content (Feed, Moderation, Reports, Trust Center)
  if (
    path.startsWith("/feed") ||
    path.startsWith("/moderation") ||
    path.startsWith("/reports") ||
    path.startsWith("/trust-center")
  ) {
    return "content";
  }

  // 8. Email & Marketing
  if (path.startsWith("/marketing") || path.startsWith("/email")) {
    return "email";
  }

  // 9. Website Studio
  if (path.startsWith("/app-layout") || path.startsWith("/website")) {
    return "website";
  }

  // 10. Mobile App
  if (path.startsWith("/mobile-app")) {
    return "mobile-app";
  }

  // 11. General Settings
  if (path.startsWith("/settings")) {
    return "settings";
  }

  // 12. Home / Dashboard
  if (path === "/" || path === "" || path.startsWith("/dashboard")) {
    return "home";
  }

  // 13. Modules (all other dynamic entity modules)
  return "modules";
}

/**
 * Determines whether the current route is a creation/edit form or visual studio route
 * so that the child sidebar drawer automatically collapses to give optimal workspace.
 */
export function isFormRoute(pathName?: string | null): boolean {
  if (!pathName) return false;
  const path = pathName.split("?")[0].replace(/\/+$/, "") || "/";

  // 1. Suffix or path segment matches for create/edit/add
  if (
    path.endsWith("/create") ||
    path.includes("/create/") ||
    path.endsWith("/edit") ||
    path.includes("/edit/") ||
    path.endsWith("/add-mentor") ||
    path.endsWith("/add") ||
    path.includes("/add/") ||
    path.endsWith("/new") ||
    path.includes("/new/")
  ) {
    return true;
  }

  // 2. Specific studio / configuration form pages
  const specificFormRoutes = [
    "/settings/branding",
    "/settings/appearance",
    "/gamification/currency/economics",
  ];

  return specificFormRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
}

/**
 * Resolves the first available (subscribed, enabled) module path.
 * If all modules are disabled or locked, falls back to the Module Registry settings.
 */
export function getFirstAvailableModulePath(modules: MenuItem[] = []): string {
  const firstEnabled = modules.find(
    (m) => !m.isLocked && !m.isDisabled && Boolean(m.path),
  );
  return firstEnabled?.path || "/settings/modules";
}

/**
 * Resolves the destination href for the "Modules" rail button in the Parent Sidebar.
 *
 * 1. If the user is currently inside an enabled module (e.g., on `/events/create`),
 *    returns that module's root path (`/events`) to preserve their context.
 * 2. If the user is on a non-module route or the current module is disabled/locked,
 *    returns the first available enabled module path (e.g. `/events` when communities is disabled).
 * 3. If no modules are enabled, falls back to `/settings/modules`.
 */
export function getActiveModulePath(
  pathName: string | null | undefined,
  modules: MenuItem[] = [],
): string {
  if (!pathName) {
    return getFirstAvailableModulePath(modules);
  }

  const path = pathName.split("?")[0].replace(/\/+$/, "") || "/";

  // Check if current path matches an active, enabled module
  const currentModule = modules.find((m) => {
    if (!m.path) return false;
    const moduleBasePath = m.path.split("?")[0].replace(/\/+$/, "");
    return path === moduleBasePath || path.startsWith(moduleBasePath + "/");
  });

  if (currentModule && !currentModule.isLocked && !currentModule.isDisabled) {
    return currentModule.path || "/";
  }

  // Not inside an enabled module: land on the first available module
  return getFirstAvailableModulePath(modules);
}

