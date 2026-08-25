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
  if (path.startsWith("/ai-agent") || path.startsWith("/ai")) {
    return "ai";
  }

  // 5. Gamification & Rewards
  if (path.startsWith("/gamification")) {
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

  // 8. Email
  if (path.startsWith("/email")) {
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
