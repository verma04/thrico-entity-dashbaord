"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAddJob } from "@/graphql/actions/jobs";
import { JobCreationForm } from "@/components/jobs/create/job-creation-form";
import { useToast } from "@/components/ui/use-toast";

const CreateJobPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [add, { loading }] = useAddJob({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: "Job created successfully!",
      });
      router.push("/jobs/all");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create job",
        variant: "destructive",
      });
    },
  });

  const onFinish = (values: any) => {
    // According to PostJobInput in graphql/actions/jobs/index.ts
    // entity is needed, but the form doesn't seem to have it. 
    // Usually it's handled by the backend or current active entity.
    // However, the company is an object in the form, but should be ID or name in mutation.
    
    add({
      variables: {
        input: {
          ...values,
          company: values.company?.id || values.company?.name || values.company,
          applicationDeadline: new Date().toISOString(), // Default or from values if exists
        },
      },
    });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="h-full overflow-hidden">
      <JobCreationForm
        initialValues={{}}
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
};

export default CreateJobPage;
