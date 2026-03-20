"use client";

import React, { useEffect } from "react";

import { useGetEntity, useGetUser } from "@/graphql/actions";
import withAuth from "@/lib/withAuth";
import NoSubscription from "@/components/subscription/no-subscription";
import TrialBanner from "@/components/subscription/trial-banner";

import { PlanDrawer } from "@/components/layout/plan-drawer";

import SidebarLayout from "@/components/layout/sidebar/sidebar";
import { useSearchParams } from "next/navigation";
import { useDrawerStore } from "@/store/drawerStore";
import { WelcomeCelebration } from "@/components/layout/welcome-celebration";
import DomainStatusAlert from "@/components/layout/domain-status-alert";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { data, loading } = useGetEntity();
  const {
    data: { getUser },
    loading: loadingUser,
  } = useGetUser();

  const searchParams = useSearchParams();
  const showDrawer = searchParams.has("choose-plan");
  const { isOpen: drawerOpen, openDrawer } = useDrawerStore();
  useEffect(() => {
    if (showDrawer) {
      openDrawer();
    }
  }, [showDrawer]);
  return (
    <>
      {!loading && !loadingUser && (
        <>
          <>
            <TrialBanner />
            <WelcomeCelebration />
            {/* <Toaster /> */}
            <>
              {!data?.getEntity?.subscription?.status && <NoSubscription />}
              <SidebarLayout>
                {data?.getEntity?.subscription?.status && <>{children}</>}
              </SidebarLayout>

              {/* Plan Drawer Component */}
              <PlanDrawer />
              <DomainStatusAlert />
            </>
          </>
        </>
      )}
    </>
  );
}

export default withAuth(RootLayout);
