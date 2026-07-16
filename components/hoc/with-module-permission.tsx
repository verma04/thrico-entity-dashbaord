"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  useModulePermission,
  PermissionAction,
} from "@/hooks/use-module-permission";
import { PermissionDenied } from "@/components/shared/permission-denied";

/**
 * Higher-Order Component to check if a user has a specific module permission.
 * Redirects or shows nothing if they do not have the required permission.
 *
 * @param WrappedComponent The component to protect
 * @param moduleName The name of the module to check (e.g., 'COMMUNITIES')
 * @param action The specific action to check (e.g., 'canCreate')
 * @param fallback Optional component or path to redirect to. If string, it redirects.
 */
export function withModulePermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  moduleName: string,
  action: PermissionAction = "canRead",
  fallback?: React.ReactNode | string,
) {
  return function PermissionCheckedComponent(props: P) {
    const hasPermission = useModulePermission(moduleName, action);

    const router = useRouter();

    React.useEffect(() => {
      if (!hasPermission && typeof fallback === "string") {
        router.push(fallback);
      }
    }, [hasPermission, fallback, router]);

    if (!hasPermission) {
      if (typeof fallback === "string") {
        return null; // Redirecting
      }
      if (fallback !== undefined) {
        return <>{fallback}</>;
      }
      return <PermissionDenied moduleKey={moduleName.toLowerCase()} />;
    }

    return <WrappedComponent {...props} />;
  };
}
