"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGetUser } from "@/graphql/actions";

import AppLoading from "@/components/layout/loading";
import { useUserStore } from "@/store/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Options = {
  ssr?: boolean;
};

export default function withAuth<P>(
  WrappedComponent: React.ComponentType<P>,
  options: Options = { ssr: false },
) {
  const WithAuth = (props: React.PropsWithChildren<P>) => {
    const ACCOUNTS_URL =
      process.env.NEXT_PUBLIC_ACCOUNTS_URL ?? "https://accounts.thrico.com";
    const DASHBOARD_URL =
      process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "https://dashboard.thrico.com";
    const pathname = usePathname();

    const { data: { getUser } = {}, loading, error } = useGetUser();
    const setUser = useUserStore((state) => state.setUser);
    const clearUser = useUserStore((state) => state.clearUser);

    // Sync to store
    useEffect(() => {
      if (getUser) {
        setUser(getUser);
      }
    }, [getUser, setUser]);

    // ── URL Access Control ──────────────────────────────────────────────────
    // 1. Module-level check (for paths like /listing, /moments, etc.)
    const moduleMatch = pathname?.split("/")[1]?.toUpperCase();

    useEffect(() => {
      if (getUser && !loading) {
        let hasAccess = true;

        if (getUser.isSuperAdmin || getUser.role?.isSystem) return; // Master access

        // Check against modulePermissions for extended products
        const modulePerm = getUser.modulePermissions?.find(
          (mp: any) => mp.module === moduleMatch,
        );

        // If we found a module permission, respect its canRead flag
        if (modulePerm) {
          hasAccess = modulePerm.canRead;
        }

        // 2. System-level checks (using the general permissions object)
        if (moduleMatch === "APP-LAYOUT" || moduleMatch === "PAGES") {
          hasAccess = getUser.permissions?.website;
        } else if (pathname?.includes("/settings/moderation")) {
          hasAccess = getUser.permissions?.moderation;
        } else if (moduleMatch === "AUDIT-LOGS") {
          hasAccess = getUser.permissions?.auditLogs;
        }

        if (!hasAccess) {
          // Redirect to home if accessing unauthorized page
          window.location.href = "/";
        }
      }
    }, [getUser, loading, pathname, moduleMatch]);

    // Show loading spinner while fetching user
    if (loading) {
      return <AppLoading />;
    }

    // If not authenticated, redirect to login
    if ((!getUser || error) && typeof window !== "undefined") {
      localStorage.removeItem("key");
      clearUser();
      return (
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Session Expired</AlertDialogTitle>
              <AlertDialogDescription>
                Your session has expired. Please log in again to continue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  window.location.href = `${ACCOUNTS_URL}/auth?path=${DASHBOARD_URL}${pathname}&&host=${DASHBOARD_URL}`;
                }}
              >
                Log In
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }

    //  Render the protected component
    return <WrappedComponent {...props} />;
  };

  return WithAuth;
}
