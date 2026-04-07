"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAddJob } from "@/graphql/actions/jobs";
import { useGetEntity } from "@/graphql/actions";
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

  const { data: entityData } = useGetEntity();

  const onFinish = (values: any) => {
    if (!entityData?.getEntity?.id) {
      toast({
        title: "Error",
        description: "Entity identification failed. Please try again.",
        variant: "destructive",
      });
      return;
    }

    add({
      variables: {
        input: {
          ...values,
          entity: entityData.getEntity.id,
          company: {
            id: values.company?.id || values.company,
          },
          applicationDeadline: new Date().toISOString(),
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
