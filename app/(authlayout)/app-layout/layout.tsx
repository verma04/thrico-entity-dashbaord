"use client";
import * as React from "react";

import PagesItemsLayout from "@/components/settings/website-admin/pages-items-layout";
import { PlanDrawer } from "@/components/layout/plan-drawer";
import { useGetWebsite } from "@/graphql/actions";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { Skeleton } from "@/components/ui/skeleton";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { data, loading } = useGetWebsite();
  const website = data?.getWebsite;
  const initializeWebsiteData = useWebsiteBuilderStore(
    (state) => state.initializeWebsiteData
  );

  React.useEffect(() => {
    if (website && !loading) {
      initializeWebsiteData({
        ...website,
        globalFooter: {
          ...website?.footer,
          id: "footer",
          type: "footer",
          name: "Footer",
        },
        globalHeader: {
          ...website?.navbar,
          id: "navbar",
          type: "navbar",
          name: "Navbar",
        },

        currentPageId: website?.pages?.[0]?.id || null,
      });
    }
  }, [website, loading, initializeWebsiteData]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <PlanDrawer />
      <PagesItemsLayout>{children}</PagesItemsLayout>
    </>
  );
}

export default RootLayout;
