"use client";

import { AppearanceSettings } from "@/components/settings/appearance";
import { useGetEntityTheme } from "@/graphql/actions";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives/polaris-form-skeleton";
import { PaintBucket, AlertCircle } from "lucide-react";

export default function AppearancePage() {
  const { data, loading, error } = useGetEntityTheme();

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Visual Identity"
        description="Configure your community's visual language, theme tokens, and brand assets across all platforms."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Appearance" },
        ]}
        icon={PaintBucket}
        badgeText="Appearance"
        showLiveIndicator={false}
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        {loading && <PolarisFormSkeleton showHeader={false} />}

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-[8px] border bg-[#fff4f4] border-[#d72c0d]/20 shadow-xs max-w-xl mx-auto my-6">
            <AlertCircle className="h-5 w-5 text-[#d72c0d] shrink-0 mt-0.5" />
            <div>
              <p className="text-[13.5px] font-semibold text-[#d72c0d]">
                Theme Initialization Failed
              </p>
              <p className="text-[12.5px] text-[#616161] mt-1 leading-[18px]">
                {error.message}
              </p>
            </div>
          </div>
        )}

        {!loading && data && (
          <AppearanceSettings theme={data?.getEntityTheme || null} />
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
