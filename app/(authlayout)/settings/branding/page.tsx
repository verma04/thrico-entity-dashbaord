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
            description="Loading..."
            badgeText="Visual Assets"
            icon={Layers}
            breadcrumbs={[
              { label: "Settings", href: "/settings" },
              { label: "Branding" },
            ]}
          />
          <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
            <div className="px-6 py-8">
              <div className="h-[400px] w-full bg-muted/50 rounded-xl animate-pulse" />
            </div>
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
                  className="h-8 px-3 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <RotateCcw size={12} />
                  Refresh
                </button>
              </EcosystemActionBar.Group>
            </EcosystemActionBar>
          }
        />
        <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
          <div className="px-6 py-8">
            <Branding
              currentImage={communityImage}
              onImageUpdate={handleLogoUpdate}
              faviconImage={faviconImage}
              onFaviconUpdate={handleFaviconUpdate}
            />
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    </GeneralSettingsLayout>
  );
};

export default BrandingPage;
