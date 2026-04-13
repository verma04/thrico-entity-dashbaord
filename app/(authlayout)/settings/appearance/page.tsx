"use client";
import { AppearanceSettings } from "@/components/settings/appearance";
import { useGetEntityTheme } from "@/graphql/actions";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { PaintBucket, Loader2, AlertCircle } from "lucide-react";

export default function AppearancePage() {
  const { data, loading, error } = useGetEntityTheme();

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Visual Identity"
        description="Configure your community's visual language, theme tokens, and brand assets across all platforms."
        breadcrumb="Interface & Branding"
        icon={PaintBucket}
        badgeText="Appearance"
        showLiveIndicator={false}
      />

      <div className="flex-1 w-full">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <Loader2 className="animate-spin text-slate-400" size={20} />
            <span className="font-medium text-slate-500 text-[12px]">Synchronizing Theme Engine...</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 px-4 py-4 rounded-xl border bg-red-50 border-red-200 shadow-sm">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <div>
              <p className="text-[13px] font-semibold text-red-800">Theme Initialization Failed</p>
              <p className="text-[12px] text-red-700/80 mt-1 max-w-lg">{error.message}</p>
            </div>
          </div>
        )}

        {!loading && data && (
          <AppearanceSettings theme={data?.getEntityTheme || null} />
        )}
      </div>
    </EcosystemWrapper>
  );
}
