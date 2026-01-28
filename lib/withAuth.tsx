"use client";

import { usePathname } from "next/navigation";
import { useGetUser } from "@/graphql/actions";
import { Redirect } from "@/components/layout/redirect";
import AppLoading from "@/components/layout/loading";
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

    // Show loading spinner while fetching user
    if (loading) {
      return <AppLoading />;
    }

    // If not authenticated, redirect to login
    if ((!getUser || error) && typeof window !== "undefined") {
      localStorage.removeItem("key");
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
