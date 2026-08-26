import { useMemo } from "react";
import { useUserStore, User, GroupedPermissionItem } from "@/store/store";

export type PermissionAction =
  | "canRead"
  | "canEdit"
  | "canCreate"
  | "canDelete"
  | "canUpdate"; // alias for canEdit

/**
 * Normalizes a module or permission key for comparison (uppercase, underscores, no spaces/hyphens).
 */
export function normalizeModuleKey(key: string): string {
  if (!key) return "";
  return key
    .toUpperCase()
    .trim()
    .replace(/[-\s&]+/g, "_");
}

/**
 * Known alias mappings to support legacy or alternative module names across categories.
 */
const MODULE_ALIASES: Record<string, string[]> = {
  // Member Engine
  MEMBERS: ["MEMBERS_ALL", "NETWORK", "USERS"],
  MEMBERS_ALL: ["MEMBERS", "NETWORK"],
  NETWORK: ["MEMBERS", "MEMBERS_ALL"],
  MEMBERS_CLASSIFICATIONS: ["CLASSIFICATIONS", "CLASSIFICATION"],
  CLASSIFICATIONS: ["MEMBERS_CLASSIFICATIONS"],
  CLASSIFICATION: ["MEMBERS_CLASSIFICATIONS"],
  MEMBERS_REFERRALS: ["REFERRALS", "REFERRAL", "REFER"],
  REFERRALS: ["MEMBERS_REFERRALS"],
  MEMBERS_GRAPH: ["GRAPH", "MEMBERS_GRAPH"],
  MEMBERS_REPORTS: ["REPORTS", "MEMBER_REPORTS"],
  MEMBERS_SETTINGS: ["SETTINGS", "GENERAL_SETTINGS"],
  MEMBERS_AUDIT: ["AUDIT_LOGS", "AUDIT_LOG", "AUDIT"],

  // Content Engine
  AI_MODERATION: ["AI_MODERTION", "MODERATION"],
  AI_MODERTION: ["AI_MODERATION", "MODERATION"],
  MODERATION: ["AI_MODERATION", "AI_MODERTION"],
  FEED: ["FEEDS"],
  MEDIA_GALLERY: ["MEDIA"],

  // Gamification Engine
  POINTS_BADGES: ["POINTS_AND_BADGES", "POINTS", "BADGES"],
  GAMES_CENTER: ["ENGAGEMENT_GAMES", "MEMBER_GAMES", "GAMES"],
  IMPACT_SCORE: ["IMPACT_SCORES"],

  // Admin Access
  GENERAL_SETTINGS: ["SETTINGS"],
  SETTINGS: ["GENERAL_SETTINGS", "MEMBERS_SETTINGS"],
  USERS_AND_PERMISSIONS: ["ADMIN_USERS", "PERMISSIONS", "USERS"],
  ADMIN_USERS: ["USERS_AND_PERMISSIONS"],
  PERMISSIONS: ["USERS_AND_PERMISSIONS"],
  AUDIT_LOGS: ["AUDIT_LOG", "AUDIT", "MEMBERS_AUDIT"],
  PLATFORM_FEATURES: ["PLATFORM_FEATURE", "FEATURES"],
  CUSTOMER_PRIVACY: ["PRIVACY"],
  TAXES_AND_DUTIES: ["TAXES", "DUTIES"],
  CONTACT_SUPPORT: ["SUPPORT"],

  // Platform Channels
  BRANDED_EMAIL: ["EMAIL"],
  MOBILE_APP: ["MOBILE"],
};

/**
 * Checks if two module keys match either exactly or via alias.
 */
export function isModuleMatch(
  queryModule: string,
  targetModule: string,
): boolean {
  const normQuery = normalizeModuleKey(queryModule);
  const normTarget = normalizeModuleKey(targetModule);

  if (normQuery === normTarget) return true;

  const aliasesForQuery = MODULE_ALIASES[normQuery] || [];
  if (aliasesForQuery.includes(normTarget)) return true;

  const aliasesForTarget = MODULE_ALIASES[normTarget] || [];
  if (aliasesForTarget.includes(normQuery)) return true;

  return false;
}

/**
 * Extracts all module permissions from a User object (from direct lists, role, or groupedModulePermissions).
 */
export function extractUserModulePermissions(
  user: User | null | undefined,
): GroupedPermissionItem[] {
  if (!user) return [];
  const list: GroupedPermissionItem[] = [];

  const addPerm = (p: any) => {
    if (!p) return;
    const mod = p.module || p.name;
    if (!mod || typeof mod !== "string") return;

    const item: GroupedPermissionItem = {
      id: p.id,
      module: mod,
      canRead: Boolean(p.canRead),
      canCreate: Boolean(p.canCreate),
      canEdit: Boolean(p.canEdit ?? p.canUpdate),
      canDelete: Boolean(p.canDelete),
      isSystem: Boolean(p.isSystem),
      isAdmin: Boolean(p.isAdmin),
    };

    list.push(item);
  };

  const processGrouped = (grouped: any) => {
    if (!grouped) return;
    if (Array.isArray(grouped)) {
      grouped.forEach((categoryObj: any) => {
        if (Array.isArray(categoryObj?.permissions)) {
          categoryObj.permissions.forEach(addPerm);
        } else if (categoryObj?.module || categoryObj?.name) {
          addPerm(categoryObj);
        }
      });
    } else if (typeof grouped === "object") {
      Object.values(grouped).forEach((groupVal: any) => {
        if (Array.isArray(groupVal)) {
          groupVal.forEach(addPerm);
        } else if (groupVal && typeof groupVal === "object") {
          addPerm(groupVal);
        }
      });
    }
  };

  // 1. Role grouped permissions (primary schema from backend)
  processGrouped(user.role?.groupedModulePermissions);

  // 2. User level grouped permissions
  processGrouped(user.groupedModulePermissions);

  // 3. User direct modulePermissions array
  if (Array.isArray(user.modulePermissions)) {
    user.modulePermissions.forEach(addPerm);
  }

  // 4. Role direct modulePermissions array
  if (Array.isArray(user.role?.modulePermissions)) {
    user.role.modulePermissions.forEach(addPerm);
  }

  return list;
}

/**
 * Evaluates whether a user has permission for a specific module and action.
 */
export function hasUserModulePermission(
  user: User | null | undefined,
  moduleName: string,
  action: PermissionAction = "canRead",
): boolean {
  if (!user) return false;

  // SuperAdmin and System roles have full unrestricted access
  if (user.isSuperAdmin || user.role?.isSystem) {
    return true;
  }

  const effectiveAction: "canRead" | "canCreate" | "canEdit" | "canDelete" =
    action === "canUpdate" ? "canEdit" : action;

  // Check legacy permissions object if present
  if (user.permissions && moduleName in user.permissions) {
    const permVal =
      user.permissions[moduleName as keyof typeof user.permissions];
    if (typeof permVal === "boolean") return permVal;
  }

  const allPermissions = extractUserModulePermissions(user);

  if (allPermissions.length > 0) {
    const matchingPerm = allPermissions.find((p) =>
      isModuleMatch(moduleName, p.module),
    );

    if (matchingPerm) {
      return Boolean(matchingPerm[effectiveAction]);
    }
  }

  // Fallback: If user role has isAdmin flag and no explicit negative match found
  if (user.role?.isAdmin) {
    return true;
  }

  return false;
}

/**
 * React hook to check module permission for the currently logged-in user.
 */
export function useModulePermission(
  moduleName: string,
  action: PermissionAction = "canRead",
): boolean {
  const user = useUserStore((state) => state.user);

  return useMemo(() => {
    return hasUserModulePermission(user, moduleName, action);
  }, [user, moduleName, action]);
}

/**
 * React hook to get all parsed module permissions for the current user.
 */
export function useUserModulePermissions(): GroupedPermissionItem[] {
  const user = useUserStore((state) => state.user);

  return useMemo(() => {
    return extractUserModulePermissions(user);
  }, [user]);
}
