"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useGetSurvey } from "@/graphql/surveys/survey-queries";
import { useEditSurvey, EditSurveyInput } from "@/graphql/surveys/survey-mutations";
import { SurveyCreationForm } from "@/components/surveys/add/survey-creation-form";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { useModuleStore } from "@/store/useModuleStore";
import { useFormStore } from "@/store/useFormStore";
import NewFormPage from "@/components/feedback-form/create";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  ArrowLeft,
  Pencil,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

function EditSurveyPage() {
  const moduleName = useModuleStore((state) => state.surveyModuleName);
  const singularName = useModuleStore((state) => state.surveySingularName);
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState(false);

  const { loadForm } = useFormStore();

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

  useEffect(() => {
    if (survey?.form) {
      loadForm({
        title: survey.title,
        description: survey.description,
        startDate: survey.startDate,
        endDate: survey.endDate,
        previewType: survey.form.previewType,
        appearance: survey.form.appearance,
        questions: survey.form.questions,
      });
    }
  }, [survey, loadForm]);

  const initialValues = survey
    ? {
        title: survey.title || "",
        description: survey.description || "",
        startDate: survey.startDate ? new Date(survey.startDate) : null,
        endDate: survey.endDate ? new Date(survey.endDate) : null,
        communityId: survey.communityId || "",
        communityIds: survey.communityIds || elig?.communityIds || [],
        memberEligibility: elig?.memberEligibility || "ALL",
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

    editSurvey({ variables: { id, input } });
  };

  const onCancel = () => {
    router.push("/surveys/all");
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={survey?.title ? `Edit · ${survey.title}` : `Edit ${singularName}`}
        badgeText="Insights Studio"
        description={`Update ${singularName.toLowerCase()} campaign identity, active timeline, and member eligibility rules.`}
        icon={ClipboardList}
        breadcrumbs={[
          { label: moduleName, href: "/surveys/all" },
          { label: survey?.title || `Edit ${singularName}` },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="text-[12.5px] font-medium h-[34px] gap-1.5 border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-[#303030] dark:text-zinc-100 cursor-pointer rounded-[6px]"
              onClick={() => setIsQuestionEditorOpen(true)}
            >
              <Pencil className="h-3.5 w-3.5 text-[#616161]" />
              Question Builder
            </Button>
            <Link href={`/surveys/${id}/results`}>
              <Button
                variant="outline"
                size="sm"
                className="text-[12.5px] font-medium h-[34px] gap-1.5 border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-[#303030] dark:text-zinc-100 cursor-pointer rounded-[6px]"
              >
                <BarChart3 className="h-3.5 w-3.5 text-[#616161]" />
                Results
              </Button>
            </Link>
            <Link href={`/surveys/${id}/responses`}>
              <Button
                variant="outline"
                size="sm"
                className="text-[12.5px] font-medium h-[34px] gap-1.5 border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-[#303030] dark:text-zinc-100 cursor-pointer rounded-[6px]"
              >
                <MessageSquare className="h-3.5 w-3.5 text-[#616161]" />
                Responses
              </Button>
            </Link>
            <Link href="/surveys/all">
              <Button
                variant="outline"
                size="sm"
                className="text-[12.5px] font-medium h-[34px] gap-1.5 border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-[#303030] dark:text-zinc-100 cursor-pointer rounded-[6px]"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-[#616161]" />
                Back to {moduleName}
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        {fetchingSurvey ? (
          <PolarisFormSkeleton showHeader={false} />
        ) : !survey ? (
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
        ) : (
          <SurveyCreationForm
            initialValues={initialValues}
            isEdit={true}
            loading={isUpdating}
            onFinish={onFinish}
            onCancel={onCancel}
          />
        )}
      </EcosystemContainer>

      {/* Interactive Question Builder Modal */}
      <Sheet
        open={isQuestionEditorOpen}
        onOpenChange={(val) => !val && setIsQuestionEditorOpen(false)}
      >
        <SheetContent
          side="top"
          className="h-[100dvh] w-screen p-0 border-none outline-none dark:bg-zinc-950"
        >
          <div className="h-full w-full">
            <NewFormPage
              onPublish={() => {
                toast.success("Survey questions saved!");
                setIsQuestionEditorOpen(false);
                refetch();
              }}
              onClose={() => setIsQuestionEditorOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(EditSurveyPage, "SURVEYS", "canRead"),
  "surveys",
);
