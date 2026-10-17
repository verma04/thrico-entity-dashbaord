"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { FeedCampaignForm } from "@/components/feed/campaigns/feed-campaign-form";
import {
  useAdminCreateFeedCampaign,
  CampaignStatus,
} from "@/graphql/actions/feed/campaigns";
import { toast } from "sonner";

function CreateFeedCampaignPage() {
  const router = useRouter();
  const [createCampaign, { loading }] = useAdminCreateFeedCampaign({
    onCompleted: () => {
      toast.success("Feed Campaign created successfully!");
      router.push("/feed/campaigns");
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
              width: typeof rawMeta.width === "number" ? Math.round(rawMeta.width) : undefined,
              height: typeof rawMeta.height === "number" ? Math.round(rawMeta.height) : undefined,
            }
          : null;

      const res = await createCampaign({
        variables: {
          input: {
            title: String(values.title || "").trim(),
            slug: String(values.slug || "").trim(),
            description: values.description ? String(values.description).trim() : undefined,
            status: (values.status as CampaignStatus) || "ACTIVE",
            frameUrl: String(values.frameUrl || "").trim(),
            frameMetadata: cleanFrameMetadata,
            placements: (values.placements as string[]) || ["FEED"],
            aspectRatio: values.aspectRatio ? String(values.aspectRatio) : "1:1",
            festiveImageUrl: values.festiveImageUrl ? String(values.festiveImageUrl).trim() : null,
            ctaButtonText: values.ctaButtonText ? String(values.ctaButtonText).trim() : "Use Frame",
            ctaBgColor: values.ctaBgColor ? String(values.ctaBgColor).trim() : "#4F46E5",
            ctaTextColor: values.ctaTextColor ? String(values.ctaTextColor).trim() : "#FFFFFF",
            isFilterActive: Boolean(values.isFilterActive),
            allowCameraRecording: Boolean(values.allowCameraRecording),
            allowFileUpload: Boolean(values.allowFileUpload),
            startDate: values.startDate && String(values.startDate).trim() ? String(values.startDate).trim() : null,
            endDate: values.endDate && String(values.endDate).trim() ? String(values.endDate).trim() : null,
          },
        },
      });

      if (res?.data?.adminCreateFeedCampaign?.id) {
        toast.success("Feed Campaign created successfully!");
        router.push("/feed/campaigns");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to create campaign.");
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemContainer className="py-6">
        <FeedCampaignForm
          isLoading={loading}
          onSubmit={handleFinish}
          title="Create Feed Campaign"
          description="Upload a transparent PNG frame overlay and select where it applies: in Feed, Stories, or Both."
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(CreateFeedCampaignPage, "FEED", "canCreate"),
  "feed",
);
