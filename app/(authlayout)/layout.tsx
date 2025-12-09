"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

import { useGetEntity, useGetUser } from "@/graphql/actions";
import withAuth from "@/lib/withAuth";
import NoSubscription from "@/components/subscription/no-subscription";
import TrialBanner from "@/components/subscription/trial-banner";
import KycForm from "@/components/kyc-form/kyc-form";

import SidebarLayout from "@/components/layout/sidebar/sidebar";
import Upgrade from "@/components/subscription/upgrade/upgrade";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { data, loading } = useGetEntity();
  const {
    data: { getUser },
    loading: loadingUser,
  } = useGetUser();
  const check = data?.getEntity;

  // Get search params
  const searchParams = useSearchParams();
  const showDrawer = searchParams.has("choose-plan");

  // Drawer state (optional, if you want to allow closing)
  const [drawerOpen, setDrawerOpen] = useState(true);

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

                {/* Button to open drawer (optional, can remove if only URL controls) */}
                {/* <button
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
                  onClick={() => setDrawerOpen(true)}
                >
                  Choose Plan
                </button> */}

                {/* Drawer only shows if ?choose-cloose is in URL and drawerOpen is true */}
                {showDrawer && drawerOpen && (
                  <div className="fixed inset-0 w-full z-[3000] flex justify-center items-start bg-black/30">
                    {/* Skip Button - absolute top right */}
                    <button
                      className="absolute top-6 right-8 z-[3100] px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 shadow"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Skip
                    </button>
                    <div className="bg-white w-full  h-[100vh]  shadow-xl relative overflow-y-auto rounded-lg">
                      <Upgrade />
                    </div>
                  </div>
                )}
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
