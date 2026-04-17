"use client";
import * as React from "react";

import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { PlanDrawer } from "@/components/layout/plan-drawer";
import { useGetWebsite } from "@/graphql/actions";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { Skeleton } from "@/components/ui/skeleton";
import { CardContent } from "@/components/ui/card";
import { Layout, Menu, PanelBottom, Globe, Settings, Plus } from "lucide-react";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { data, loading } = useGetWebsite();
  const website = data?.getWebsite;
  const initializeWebsiteData = useWebsiteBuilderStore(
    (state) => state.initializeWebsiteData,
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

  const items = [
    {
      key: "",
      label: "Pages",
      icon: <Layout className="h-4 w-4" />,
    },
    {
      key: "create",
      label: "Create Page",
      icon: <Plus className="h-4 w-4" />,
    },
    {
      key: "navigation",
      label: "Navigation",
      icon: <Menu className="h-4 w-4" />,
    },
    {
      key: "footer",
      label: "Footer",
      icon: <PanelBottom className="h-4 w-4" />,
    },
    {
      key: "seo",
      label: "SEO",
      icon: <Globe className="h-4 w-4" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

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
      <MenuItemsLayout
        active="app-layout"
        items={items}
        hideDefaultTabs={true}
        showAdminTabs={false}
      >
        {children}
      </MenuItemsLayout>
    </>
  );
}

export default RootLayout;
