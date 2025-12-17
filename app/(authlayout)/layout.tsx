"use client";

import React, { useEffect } from "react";

import { useGetEntity, useGetUser } from "@/graphql/actions";
import withAuth from "@/lib/withAuth";
import NoSubscription from "@/components/subscription/no-subscription";
import TrialBanner from "@/components/subscription/trial-banner";
import KycForm from "@/components/kyc-form/kyc-form";
import { PlanDrawer } from "@/components/layout/plan-drawer";

import SidebarLayout from "@/components/layout/sidebar/sidebar";
import { useSearchParams } from "next/navigation";
import { useDrawerStore } from "@/store/drawerStore";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { data, loading } = useGetEntity();
  const {
    data: { getUser },
    loading: loadingUser,
  } = useGetUser();
  const check = data?.getEntity;
  const searchParams = useSearchParams();
  const showDrawer = searchParams.has("choose-plan");
  const { isOpen: drawerOpen, openDrawer } = useDrawerStore();
  useEffect(() => {
    if (showDrawer && !drawerOpen) {
      openDrawer();
    }
  }, [showDrawer, drawerOpen, openDrawer]);
  return (
    <>
      {!loading && !loadingUser && (
        <>
          {check ? (
            <>
              <TrialBanner />
              <>
                {!data?.getEntity?.subscription?.status && <NoSubscription />}
                <SidebarLayout>
                  {data?.getEntity?.subscription?.status && <>{children}</>}
                </SidebarLayout>

                {/* Plan Drawer Component */}
                <PlanDrawer />
              </>
            </>
          ) : (
            <KycForm data={{ user: getUser }} />
          )}
        </>
      )}
    </>
  );
}

export default withAuth(RootLayout);
