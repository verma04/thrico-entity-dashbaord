"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useGetSurvey } from "@/graphql/surveys/survey-queries";
import { useFormStore } from "@/store/useFormStore";
import NewFormPage from "@/components/feedback-form/create";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { toast } from "sonner";

function SurveyQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { loadForm } = useFormStore();

  const { data, loading, refetch } = useGetSurvey({
    variables: { getSurveyId: id },
    skip: !id,
  });

  const survey = data?.getSurvey;

  useEffect(() => {
    if (survey) {
      loadForm({
        formId: survey.formId || survey.id,
        title: survey.title,
        description: survey.description,
        startDate: survey.startDate,
        endDate: survey.endDate,
        previewType: survey.form?.previewType || "SCROLL_LONG",
        appearance: survey.form?.appearance || {},
        questions: survey.form?.questions || [],
      });
    }
  }, [survey, loadForm]);

  if (loading) {
    return <PolarisFormSkeleton showHeader={false} />;
  }

  return (
    <div className=" bg-background w-full h-full overflow-hidden flex flex-col">
      <NewFormPage
        onPublish={() => {
          toast.success("Survey questions saved successfully!");
          refetch();
        }}
        onClose={() => router.push(`/surveys/${id}`)}
      />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(SurveyQuestionsPage, "SURVEYS", "canRead"),
  "surveys",
);
