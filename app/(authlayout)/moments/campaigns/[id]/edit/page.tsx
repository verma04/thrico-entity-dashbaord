"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { CampaignForm } from "@/components/moments/campaigns/campaign-form";
import {
  useGetMomentCampaignById,
  useAdminUpdateMomentCampaign,
  CampaignStatus,
  FitMode,
} from "@/graphql/actions/moments/campaigns";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditCampaignPageProps {
  params: Promise<{ id: string }>;
}

function EditMomentCampaignPage({ params }: EditCampaignPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const campaignId = resolvedParams.id;

  const { data, loading } = useGetMomentCampaignById(campaignId);
  const [updateCampaign, { loading: updating }] = useAdminUpdateMomentCampaign({
    onCompleted: () => {
      toast.success("Moment Campaign updated successfully!");
      router.push("/moments/campaigns");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update campaign.");
    },
  });

  const campaign = data?.getMomentCampaignById;

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

      await updateCampaign({
        variables: {
          id: campaignId,
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
      toast.error((err as Error).message || "Failed to update campaign.");
    }
  };

  if (loading) {
    return (
      <EcosystemWrapper>
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground mt-3">Loading campaign configuration...</p>
        </div>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemContainer className="py-6">
        <CampaignForm
          initialValues={campaign}
          isLoading={updating}
          onSubmit={handleFinish}
          title={`Edit ${campaign?.title || "Campaign"}`}
          description="Update branded sequence clips, frame overlay, or member participation rules."
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(EditMomentCampaignPage, "MOMENTS", "canUpdate"),
  "moments",
);
