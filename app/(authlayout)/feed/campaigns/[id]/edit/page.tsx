"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { FeedCampaignForm } from "@/components/feed/campaigns/feed-campaign-form";
import {
  useGetFeedCampaignById,
  useAdminUpdateFeedCampaign,
  CampaignStatus,
} from "@/graphql/actions/feed/campaigns";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditFeedCampaignPageProps {
  params: Promise<{ id: string }>;
}

function EditFeedCampaignPage({ params }: EditFeedCampaignPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const campaignId = resolvedParams.id;

  const { data, loading } = useGetFeedCampaignById(campaignId);
  const [updateCampaign, { loading: updating }] = useAdminUpdateFeedCampaign({
    onCompleted: () => {
      toast.success("Feed Campaign updated successfully!");
      router.push("/feed/campaigns");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update campaign.");
    },
  });

  const campaign = data?.getFeedCampaignById;

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
            placements: (values.placements as string[]) || ["FEED"],
            aspectRatio: values.aspectRatio ? String(values.aspectRatio) : "1:1",
            festiveImageUrl: values.festiveImageUrl ? String(values.festiveImageUrl) : null,
            ctaButtonText: values.ctaButtonText ? String(values.ctaButtonText).trim() : null,
            ctaBgColor: values.ctaBgColor ? String(values.ctaBgColor).trim() : null,
            ctaTextColor: values.ctaTextColor ? String(values.ctaTextColor).trim() : null,
            isFilterActive: Boolean(values.isFilterActive),
            allowCameraRecording: Boolean(values.allowCameraRecording),
            allowFileUpload: Boolean(values.allowFileUpload),
            startDate: values.startDate ? String(values.startDate) : null,
            endDate: values.endDate ? String(values.endDate) : null,
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
          <p className="text-xs text-muted-foreground mt-3">Loading campaign details...</p>
        </div>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemContainer className="py-6">
        <FeedCampaignForm
          initialValues={campaign}
          isLoading={updating}
          onSubmit={handleFinish}
          title={`Edit ${campaign?.title || "Campaign"}`}
          description="Update frame overlay, destination placements (Feed / Stories), or member participation rules."
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(EditFeedCampaignPage, "FEED", "canUpdate"),
  "feed",
);
