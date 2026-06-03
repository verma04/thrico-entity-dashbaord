import { useMemo } from "react";
import { useUserStore } from "@/store/store";

export type PermissionAction =
  | "canRead"
  | "canEdit"
  | "canCreate"
  | "canDelete";

export function useModulePermission(
  moduleName: string,
  action: PermissionAction = "canRead",
) {
  const user = useUserStore((state) => state.user);

  return useMemo(() => {
    if (!user) return false;
    if (user.isSuperAdmin || user.role?.isSystem) return true;

    // Check if it's a system permission
    if (user.permissions && moduleName in user.permissions) {
      return !!user.permissions[moduleName as keyof typeof user.permissions];
    }

    const modulePermission = user.modulePermissions?.find(
      (m) => m.module.toUpperCase() === moduleName.toUpperCase(),
    );

    return !!modulePermission?.[action];
  }, [user, moduleName, action]);
}
