"use client";

import Branding from "@/components/settings/general/branding";
import React, { useState, useEffect } from "react";
import { useGetEntity } from "@/graphql/actions";
import { Layers, RotateCcw } from "lucide-react";
import { GeneralSettingsLayout } from "@/components/settings/general/general-settings-layout";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives/polaris-form-skeleton";

const BrandingPage = () => {
  const { data: entityData, loading: entityLoading, refetch } = useGetEntity();
  const [communityImage, setCommunityImage] = useState<string>("");
  const [faviconImage, setFaviconImage] = useState<string>("");

  useEffect(() => {
    if (entityData?.getEntity) {
      setCommunityImage(
        entityData.getEntity.logo
          ? `https://cdn.thrico.network/${entityData.getEntity.logo}`
          : "",
      );
    }
  }, [entityData]);

  const handleLogoUpdate = (newUrl: string) => setCommunityImage(newUrl);
  const handleFaviconUpdate = (newUrl: string) => setFaviconImage(newUrl);

  if (entityLoading) {
    return (
      <GeneralSettingsLayout>
        <EcosystemWrapper>
          <EcosystemHeader
            title="Branding"
            description="Manage your entity's visual identity, logo, and favicon."
            badgeText="Visual Assets"
            icon={Layers}
            breadcrumbs={[
              { label: "Settings", href: "/settings" },
              { label: "Branding" },
            ]}
          />
          <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
            <PolarisFormSkeleton showHeader={false} />
          </EcosystemContainer>
        </EcosystemWrapper>
      </GeneralSettingsLayout>
    );
  }

  return (
    <GeneralSettingsLayout>
      <EcosystemWrapper>
        <EcosystemHeader
          title="Branding"
          description="Manage your entity's visual identity, logo, and favicon."
          badgeText="Visual Assets"
          icon={Layers}
          breadcrumbs={[
            { label: "Settings", href: "/settings" },
            { label: "Branding" },
          ]}
          actions={
            <EcosystemActionBar
              shadow="none"
              className="p-0 border-none bg-transparent gap-2"
            >
              <EcosystemActionBar.Group align="right">
                <button
                  onClick={() => refetch()}
                  className="h-8 px-3 rounded-[6px] text-[12px] font-semibold text-[#616161] hover:text-[#303030] dark:hover:text-zinc-100 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shrink-0 border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  Refresh
                </button>
              </EcosystemActionBar.Group>
            </EcosystemActionBar>
          }
        />
        <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
          <Branding
            currentImage={communityImage}
            onImageUpdate={handleLogoUpdate}
            faviconImage={faviconImage}
            onFaviconUpdate={handleFaviconUpdate}
          />
        </EcosystemContainer>
      </EcosystemWrapper>
    </GeneralSettingsLayout>
  );
};

export default BrandingPage;
