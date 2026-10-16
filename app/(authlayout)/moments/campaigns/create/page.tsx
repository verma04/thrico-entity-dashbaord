"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { CampaignForm } from "@/components/moments/campaigns/campaign-form";
import {
  useAdminCreateMomentCampaign,
  CampaignStatus,
  FitMode,
} from "@/graphql/actions/moments/campaigns";
import { toast } from "sonner";

function CreateMomentCampaignPage() {
  const router = useRouter();
  const [createCampaign, { loading }] = useAdminCreateMomentCampaign({
    onCompleted: () => {
      toast.success("Moment Campaign created successfully!");
      router.push("/moments/campaigns");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create campaign.");
    },
  });

  const handleFinish = async (values: Record<string, unknown>) => {
    try {
      const rawMeta = values.frameMetadata as { width?: unknown; height?: unknown } | null | undefined;
      const cleanFrameMetadata =
        rawMeta && (typeof rawMeta.width === "number" || typeof rawMeta.height === "number")
          ? {
              width: typeof rawMeta.width === "number" ? rawMeta.width : undefined,
              height: typeof rawMeta.height === "number" ? rawMeta.height : undefined,
            }
          : null;

      await createCampaign({
        variables: {
          input: {
            title: String(values.title || ""),
            slug: String(values.slug || ""),
            description: values.description ? String(values.description) : undefined,
            status: (values.status as CampaignStatus) || "ACTIVE",
            frameUrl: String(values.frameUrl || ""),
            frameMetadata: cleanFrameMetadata,
            introMomentId: values.introMomentId ? String(values.introMomentId) : null,
            outroMomentId: values.outroMomentId ? String(values.outroMomentId) : null,
            aspectRatio: values.aspectRatio ? String(values.aspectRatio) : "9:16",
            fitMode: (values.fitMode as FitMode) || "FIT",
            minUserDurationSeconds: Number(values.minUserDurationSeconds || 3),
            maxUserDurationSeconds: Number(values.maxUserDurationSeconds || 60),
            festiveImageUrl: values.festiveImageUrl ? String(values.festiveImageUrl) : null,
            ctaButtonText: values.ctaButtonText ? String(values.ctaButtonText).trim() : null,
            ctaBgColor: values.ctaBgColor ? String(values.ctaBgColor).trim() : null,
            ctaTextColor: values.ctaTextColor ? String(values.ctaTextColor).trim() : null,
            isFilterActive: Boolean(values.isFilterActive),
            allowCameraRecording: Boolean(values.allowCameraRecording),
            allowFileUpload: Boolean(values.allowFileUpload),
            autoPublishMoment: Boolean(values.autoPublishMoment),
            shareInFeed: Boolean(values.shareInFeed),
          },
        },
      });
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to create campaign.");
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemContainer className="py-6">
        <CampaignForm
          isLoading={loading}
          onSubmit={handleFinish}
          title="Create Branded Video Campaign"
          description="Pick Intro & Outro moments from your community, upload a decorative PNG frame, and set recording duration rules."
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(CreateMomentCampaignPage, "MOMENTS", "canCreate"),
  "moments",
);
