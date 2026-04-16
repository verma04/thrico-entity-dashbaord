"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SurveyCreationForm } from "@/components/surveys/add/survey-creation-form";
import { useToast } from "@/components/ui/use-toast";

import { useAddSurvey } from "@/graphql/surveys/survey-mutations";

const AddSurveyPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [addSurvey, { loading }] = useAddSurvey({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: "Survey created successfully!",
      });
      router.push(`/surveys/${data.addSurvey.id}`); // or the actual surveys list route
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create survey",
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

export default AddSurveyPage;
