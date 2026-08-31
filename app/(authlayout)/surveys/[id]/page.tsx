"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useGetSurvey } from "@/graphql/surveys/survey-queries";
import { useEditSurvey, EditSurveyInput } from "@/graphql/surveys/survey-mutations";
import { SurveyCreationForm } from "@/components/surveys/add/survey-creation-form";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { useModuleStore } from "@/store/useModuleStore";
import { Button } from "@/components/ui/button";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

function EditSurveyPage() {
  const moduleName = useModuleStore((state) => state.surveyModuleName);
  const singularName = useModuleStore((state) => state.surveySingularName);
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data, loading: fetchingSurvey, refetch } = useGetSurvey({
    variables: { getSurveyId: id },
    skip: !id,
  });

  const survey = data?.getSurvey;
  const elig = survey?.eligibility || survey?.eligibilityRule;

  const [editSurvey, { loading: isUpdating }] = useEditSurvey({
    onCompleted: () => {
      toast.success(`${singularName} updated successfully!`);
      refetch();
    },
    onError: (err: any) => {
      toast.error(
        err.message || `Failed to update ${singularName.toLowerCase()}`,
      );
    },
  });

  const initialValues = survey
    ? {
        title: survey.title || "",
        description: survey.description || "",
        startDate: survey.startDate ? new Date(survey.startDate) : null,
        endDate: survey.endDate ? new Date(survey.endDate) : null,
        communityId: survey.communityId || "",
        communityIds: survey.communityIds || elig?.communityIds || [],
        memberEligibility: elig?.memberEligibility || "ALL",
        acceptAnonymousResponse: Boolean(
          elig?.acceptAnonymousResponse ?? (survey as any)?.acceptAnonymousResponse ?? false,
        ),
        membershipTierId:
          elig?.membershipTierId || elig?.eligibleTierIds || [],
        eligibleTierIds:
          elig?.eligibleTierIds || elig?.membershipTierId || [],
        eligibleUserIds: elig?.eligibleUserIds || [],
        eligibleSegmentIds: elig?.eligibleSegmentIds || [],
        eligibleCommunityIds: elig?.eligibleCommunityIds || [],
      }
    : undefined;

  const onFinish = (values: any) => {
    const isOutsidePlatform = values.memberEligibility === "OUTSIDE_PLATFORM";
    const acceptAnonymous = isOutsidePlatform
      ? Boolean(values.acceptAnonymousResponse)
      : false;

    const input: EditSurveyInput = {
      title: values.title,
      description: values.description,
      startDate: values.startDate
        ? new Date(values.startDate).toISOString()
        : undefined,
      endDate: values.endDate
        ? new Date(values.endDate).toISOString()
        : undefined,
      communityId: values.communityId || undefined,
      communityIds: values.communityIds?.length ? values.communityIds : undefined,
      memberEligibility: values.memberEligibility || "ALL",
      acceptAnonymousResponse: acceptAnonymous,
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
        acceptAnonymousResponse: acceptAnonymous,
      },
    };

    editSurvey({ variables: { id, input } });
  };

  const onCancel = () => {
    router.push("/surveys/all");
  };

  if (fetchingSurvey) {
    return <PolarisFormSkeleton showHeader={false} />;
  }

  if (!survey) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[12px] bg-white dark:bg-zinc-900 space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
          <ClipboardList className="h-7 w-7" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-bold text-[#303030] dark:text-zinc-100">
            {singularName} Not Found
          </h3>
          <p className="text-[13px] text-[#616161] dark:text-zinc-400">
            This survey may have been deleted or the link is invalid.
          </p>
        </div>
        <Link href="/surveys/all">
          <Button
            variant="outline"
            className="gap-2 text-[13px] font-medium h-[36px] border-[#aeb4b9] rounded-[6px]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {moduleName}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SurveyCreationForm
        initialValues={initialValues}
        isEdit={true}
        loading={isUpdating}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(EditSurveyPage, "SURVEYS", "canRead"),
  "surveys",
);

