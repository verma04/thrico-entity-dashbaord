"use client";

import React, { useEffect } from "react";

import {
  useGetEntity,
  useGetUser,
  useCheckEntitySubscription,
} from "@/graphql/actions";
import { useModuleStore } from "@/store/useModuleStore";
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

  const { data: subData } = useCheckEntitySubscription();
  const setCommunityModuleName = useModuleStore(
    (state) => state.setCommunityModuleName,
  );
  const setJobModuleName = useModuleStore((state) => state.setJobModuleName);
  const setListingModuleName = useModuleStore(
    (state) => state.setListingModuleName,
  );
  const setMomentModuleName = useModuleStore(
    (state) => state.setMomentModuleName,
  );
  const setShopModuleName = useModuleStore((state) => state.setShopModuleName);
  const setForumModuleName = useModuleStore(
    (state) => state.setForumModuleName,
  );
  const setPollModuleName = useModuleStore((state) => state.setPollModuleName);
  const setSurveyModuleName = useModuleStore(
    (state) => state.setSurveyModuleName,
  );
  const setOfferModuleName = useModuleStore(
    (state) => state.setOfferModuleName,
  );
  const setMentorshipModuleName = useModuleStore(
    (state) => state.setMentorshipModuleName,
  );
  const setEventModuleName = useModuleStore(
    (state) => state.setEventModuleName,
  );
  const setGamificationModuleName = useModuleStore(
    (state) => state.setGamificationModuleName,
  );
  const setGamesCenterModuleName = useModuleStore(
    (state) => state.setGamesCenterModuleName,
  );
  const setCurrencyModuleName = useModuleStore(
    (state) => state.setCurrencyModuleName,
  );
  const setRewardsModuleName = useModuleStore(
    (state) => state.setRewardsModuleName,
  );

  useEffect(() => {
    if (subData?.checkEntitySubscription?.modules) {
      subData.checkEntitySubscription.modules.forEach((module: any) => {
        if (!module.customName) return;

        switch (module.name?.toUpperCase()) {
          case "COMMUNITIES":
            setCommunityModuleName(module.customName);
            break;
          case "JOBS":
            setJobModuleName(module.customName);
            break;
          case "LISTINGS":
          case "LISTING":
            setListingModuleName(module.customName);
            break;
          case "MOMENTS":
            setMomentModuleName(module.customName);
            break;
          case "SHOP":
            setShopModuleName(module.customName);
            break;
          case "FORUMS":
            setForumModuleName(module.customName);
            break;
          case "POLLS":
            setPollModuleName(module.customName);
            break;
          case "SURVEYS":
            setSurveyModuleName(module.customName);
            break;
          case "OFFERS":
            setOfferModuleName(module.customName);
            break;
          case "MENTORSHIP":
            setMentorshipModuleName(module.customName);
            break;
          case "EVENTS":
            setEventModuleName(module.customName);
            break;
          case "POINTS & BADGES":
            setGamificationModuleName(module.customName);
            break;
          case "GAMES CENTER":
            setGamesCenterModuleName(module.customName);
            break;
          case "CURRENCY":
            setCurrencyModuleName(module.customName);
            break;
          case "REWARDS":
            setRewardsModuleName(module.customName);
            break;
        }
      });
    }
  }, [subData]);

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
            <div className="auth-typography-theme">
              {!data?.getEntity?.subscription?.status && <NoSubscription />}
              <SidebarLayout>
                {data?.getEntity?.subscription?.status && <>{children}</>}
              </SidebarLayout>

              {/* Plan Drawer Component */}
              <PlanDrawer />
              <DomainStatusAlert />
            </div>
          </>
        </>
      )}
    </>
  );
}

export default withAuth(RootLayout);
