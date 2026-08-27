"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React from "react";
import { useRouter } from "next/navigation";
import { SurveyCreationForm } from "@/components/surveys/add/survey-creation-form";
import { useToast } from "@/components/ui/use-toast";

import { useAddSurvey } from "@/graphql/surveys/survey-mutations";
import { useModuleStore } from "@/store/useModuleStore";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { ClipboardList } from "lucide-react";

const AddSurveyPage = () => {
  const singularName = useModuleStore((state) => state.surveySingularName);
  const moduleName = useModuleStore((state) => state.surveyModuleName);
  const router = useRouter();
  const { toast } = useToast();

  const [addSurvey, { loading }] = useAddSurvey({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: `${singularName} created successfully!`,
      });
      router.push("/surveys/all");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.message || `Failed to create ${singularName.toLowerCase()}`,
        variant: "destructive",
      });
    },
  });

  const onFinish = (values: any) => {
    const input = {
      title: values.title,
      description: values.description || undefined,
      startDate: values.startDate
        ? new Date(values.startDate).toISOString()
        : undefined,
      endDate: values.endDate
        ? new Date(values.endDate).toISOString()
        : undefined,
      communityId: values.communityId || undefined,
      communityIds: values.communityIds?.length ? values.communityIds : undefined,
      memberEligibility: values.memberEligibility || "ALL",
      eligibility: {
        memberEligibility: values.memberEligibility || "ALL",
        membershipTierId:
          values.membershipTierId || values.eligibleTierIds || [],
        eligibleTierIds:
          values.eligibleTierIds || values.membershipTierId || [],
        eligibleUserIds: values.eligibleUserIds || [],
        eligibleSegmentIds: values.eligibleSegmentIds || [],
        eligibleCommunityIds: values.eligibleCommunityIds || [],
        communityIds: values.communityIds || [],
      },
    };

    addSurvey({ variables: { input } });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`Create ${singularName}`}
        badgeText="Insights Studio"
        description={`Add a new ${singularName.toLowerCase()} to gather community insights.`}
        icon={ClipboardList}
        breadcrumbs={[
          { label: moduleName, href: "/surveys/all" },
          { label: `Create ${singularName}` },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <SurveyCreationForm
          loading={loading}
          onFinish={onFinish}
          onCancel={onCancel}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withSubscriptionCheck(
  withModulePermission(AddSurveyPage, "SURVEYS", "canCreate"),
  "surveys",
);
