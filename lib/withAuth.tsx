"use client";

import React, { useEffect, useMemo, useRef } from "react";
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
import { Loader2, ShieldAlert } from "lucide-react";
import { hasUserModulePermission } from "@/hooks/use-module-permission";

export default function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
  const WithAuth = (props: React.PropsWithChildren<P>) => {
    const ACCOUNTS_URL =
      process.env.NEXT_PUBLIC_ACCOUNTS_URL ?? "https://accounts.thrico.com";
    const DASHBOARD_URL =
      process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "https://dashboard.thrico.com";
    const pathname = usePathname();

    const { data: { getUser } = {}, loading, error } = useGetUser();
    const setUser = useUserStore((state) => state.setUser);
    const clearUser = useUserStore((state) => state.clearUser);
    const hasHandledSessionExpiry = useRef(false);

    const loginUrl = useMemo(() => {
      const authUrl = new URL("/auth", ACCOUNTS_URL);
      authUrl.searchParams.set("path", `${DASHBOARD_URL}${pathname ?? ""}`);
      authUrl.searchParams.set("host", DASHBOARD_URL);
      return authUrl.toString();
    }, [ACCOUNTS_URL, DASHBOARD_URL, pathname]);

    const isUnauthenticated = !loading && (!!error || !getUser);

    // Sync to store
    useEffect(() => {
      if (getUser) {
        setUser(getUser);
      }
    }, [getUser, setUser]);

    // ── URL Access Control ──────────────────────────────────────────────────
    const moduleMatch = pathname?.split("/")[1]?.toUpperCase();

    useEffect(() => {
      if (getUser && !loading) {
        if (getUser.isSuperAdmin || getUser.role?.isSystem) return; // Master access
        if (!pathname || pathname === "/" || pathname === "/dashboard") return;

        let hasAccess = true;

        if (moduleMatch === "APP-LAYOUT" || moduleMatch === "PAGES") {
          hasAccess = hasUserModulePermission(getUser, "WEBSITE", "canRead");
        } else if (pathname?.includes("/settings/moderation") || moduleMatch === "MODERATION") {
          hasAccess =
            hasUserModulePermission(getUser, "MODERATION", "canRead") ||
            hasUserModulePermission(getUser, "AI_MODERATION", "canRead");
        } else if (moduleMatch === "AUDIT-LOGS" || moduleMatch === "AUDIT") {
          hasAccess = hasUserModulePermission(getUser, "AUDIT_LOGS", "canRead");
        } else if (moduleMatch) {
          hasAccess = hasUserModulePermission(getUser, moduleMatch, "canRead");
        }

        if (!hasAccess) {
          // Redirect to home if accessing unauthorized page
          window.location.href = "/";
        }
      }
    }, [getUser, loading, pathname, moduleMatch]);

    useEffect(() => {
      if (!isUnauthenticated || hasHandledSessionExpiry.current) return;

      hasHandledSessionExpiry.current = true;
      localStorage.removeItem("key");
      clearUser();

      const timer = window.setTimeout(() => {
        window.location.href = loginUrl;
      }, 1500);

      return () => window.clearTimeout(timer);
    }, [clearUser, isUnauthenticated, loginUrl]);

    // Show loading spinner while fetching user
    if (loading) {
      return <AppLoading />;
    }

    // If not authenticated, redirect to login
    if (isUnauthenticated && typeof window !== "undefined") {
      return (
        <AlertDialog open={true}>
          <AlertDialogContent className="overflow-hidden border-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-0 text-slate-100 shadow-2xl">
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-orange-400 to-amber-300" />
              <div className="space-y-6 p-6 sm:p-7">
                <AlertDialogHeader className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-rose-400/30 bg-rose-500/15 p-2.5">
                      <ShieldAlert className="h-5 w-5 text-rose-300" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-200/90">
                        Security Notice
                      </p>
                      <AlertDialogTitle className="mt-1 text-2xl font-semibold leading-tight text-white">
                        Session expired
                      </AlertDialogTitle>
                    </div>
                  </div>
                  <AlertDialogDescription className="max-w-md text-sm leading-relaxed text-slate-300">
                    For your protection, your login session ended due to
                    inactivity. We are taking you to the sign-in page now.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="rounded-xl border border-slate-700/70 bg-slate-900/80 px-4 py-3">
                  <div className="flex items-center gap-2.5 text-sm text-slate-300">
                    <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                    Redirecting securely...
                  </div>
                </div>
              </div>
            </div>
            <AlertDialogFooter className="border-t border-slate-800 bg-slate-900/70 px-6 py-4 sm:px-7">
              <AlertDialogAction
                className="w-full rounded-lg bg-white text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-amber-300"
                onClick={() => {
                  window.location.href = loginUrl;
                }}
              >
                Continue to Sign In
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
