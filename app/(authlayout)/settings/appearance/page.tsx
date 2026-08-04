"use client";
import { AppearanceSettings } from "@/components/settings/appearance";
import { useGetEntityTheme } from "@/graphql/actions";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PaintBucket, Loader2, AlertCircle } from "lucide-react";

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

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="flex-1 w-full px-6 py-8">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/50 rounded-xl border border-border shadow-sm space-y-4">
              <Loader2
                className="animate-spin text-muted-foreground"
                size={20}
              />
              <span className="font-medium text-muted-foreground text-[12px]">
                Synchronizing Theme Engine...
              </span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 px-4 py-4 rounded-xl border bg-destructive/10 border-destructive/20 shadow-sm">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-destructive">
                  Theme Initialization Failed
                </p>
                <p className="text-[12px] text-destructive/80 mt-1 max-w-lg">
                  {error.message}
                </p>
              </div>
            </div>
          )}

          {!loading && data && (
            <AppearanceSettings theme={data?.getEntityTheme || null} />
          )}
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
