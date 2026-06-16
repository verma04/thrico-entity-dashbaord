"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import { useRouter } from "next/navigation";
import { SurveyCreationForm } from "@/components/surveys/add/survey-creation-form";
import { useToast } from "@/components/ui/use-toast";

import { useAddSurvey } from "@/graphql/surveys/survey-mutations";
import { useModuleStore } from "@/store/useModuleStore";

const AddSurveyPage = () => {
  const singularName = useModuleStore((state) => state.surveySingularName);
  const router = useRouter();
  const { toast } = useToast();

  const [addSurvey, { loading }] = useAddSurvey({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: `${singularName} created successfully!`,
      });
      router.push(`/surveys/${data.addSurvey.id}`); // or the actual surveys list route
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to create ${singularName.toLowerCase()}`,
        variant: "destructive",
      });
    },
  });

  const onFinish = (values: any) => {
    // Map Formik values to the expected AddSurveyInput structure
    // (Note: description and status are not in the backend AddSurveyInput)
    const input = {
      title: values.title,
      startDate: values.startDate
        ? new Date(values.startDate).toISOString()
        : undefined,
      endDate: values.endDate
        ? new Date(values.endDate).toISOString()
        : undefined,
    };

    addSurvey({ variables: { input } });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="h-full overflow-hidden bg-white">
      <SurveyCreationForm
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
};



export default withSubscriptionCheck(
  withModulePermission(AddSurveyPage, "SURVEYS", "canCreate"),
  "surveys"
);
