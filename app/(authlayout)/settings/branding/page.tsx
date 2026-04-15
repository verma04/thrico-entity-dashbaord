"use client";

import Branding from "@/components/settings/general/branding";
import React, { useState, useEffect } from "react";
import { useGetEntity } from "@/graphql/actions";
import { PlatformContainer } from "@/components/ui/platform/container";
import { Layers, RotateCcw } from "lucide-react";

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
      <PlatformContainer className="py-0">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 pb-6 border-b border-zinc-100">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-40 bg-zinc-100 rounded-md animate-pulse" />
              <div className="h-3 w-64 bg-zinc-50 rounded-md animate-pulse" />
            </div>
          </div>
          <div className="h-[400px] w-full bg-zinc-50 rounded-xl animate-pulse" />
        </div>
      </PlatformContainer>
    );
  }

  return (
    <PlatformContainer className="py-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white shrink-0">
            <Layers size={16} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[15px] font-semibold text-zinc-900 tracking-tight leading-none">
                Branding
              </h1>
              <span className="px-1.5 py-0.5 rounded-md bg-zinc-100 text-[10px] font-medium text-zinc-500 uppercase tracking-wide border border-zinc-200/60">
                Visual Assets
              </span>
            </div>
            <p className="mt-1 text-[12.5px] text-zinc-400 font-normal leading-snug">
              Manage your entity's visual identity, logo, and favicon.
            </p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="h-8 px-3 rounded-lg text-[12px] font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw size={12} />
          Refresh
        </button>
      </div>

      <div className="mt-8">
        <Branding
          currentImage={communityImage}
          onImageUpdate={handleLogoUpdate}
          faviconImage={faviconImage}
          onFaviconUpdate={handleFaviconUpdate}
        />
      </div>
    </PlatformContainer>
  );
};

export default BrandingPage;
