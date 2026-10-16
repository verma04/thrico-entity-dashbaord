"use client";

import React, { use } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { CompositorStudio } from "@/components/moments/campaigns/compositor-studio";
import {
  useGetMomentCampaignById,
} from "@/graphql/actions/moments/campaigns";
import { Camera, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ComposePageProps {
  params: Promise<{ id: string }>;
}

function ComposeMomentCampaignPage({ params }: ComposePageProps) {
  const resolvedParams = use(params);
  const campaignId = resolvedParams.id;

  const { data, loading } = useGetMomentCampaignById(campaignId);
  const campaign = data?.getMomentCampaignById;

  if (loading) {
    return (
      <EcosystemWrapper>
        <EcosystemContainer className="py-24 text-center">
          <p className="text-xs text-muted-foreground animate-pulse">
            Loading moment campaign studio...
          </p>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  if (!campaign) {
    return (
      <EcosystemWrapper>
        <EcosystemContainer className="py-24 text-center space-y-3">
          <p className="text-sm font-semibold text-foreground">
            Campaign Not Found
          </p>
          <p className="text-xs text-muted-foreground">
            The requested moment campaign could not be found.
          </p>
          <Link href="/moments/campaigns">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Back to Campaigns
            </Button>
          </Link>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Moment Video Studio"
        description="Record live in mobile portrait view with real-time frame filter or upload a video file to generate a merged composite MP4."
        icon={Camera}
      >
        <Link href="/moments/campaigns">
          <Button variant="outline" size="sm" className="h-8 text-xs cursor-pointer">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Campaigns
          </Button>
        </Link>
      </EcosystemHeader>
      <EcosystemContainer className="py-6">
        <CompositorStudio campaign={campaign} />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(ComposeMomentCampaignPage, "MOMENTS", "canRead"),
  "moments",
);
