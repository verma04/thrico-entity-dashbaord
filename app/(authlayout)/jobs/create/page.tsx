"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAddJob } from "@/graphql/actions/jobs";
import { useGetEntity } from "@/graphql/actions";
import { JobCreationForm } from "@/components/jobs/create/job-creation-form";
import { useToast } from "@/components/ui/use-toast";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

const CreateJobPage = () => {
  const singularName = useModuleStore((state) => state.jobSingularName);
  const router = useRouter();
  const { toast } = useToast();

  const [add, { loading }] = useAddJob({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: `${singularName} created successfully!`,
      });
      router.push("/jobs/all");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to create ${singularName.toLowerCase()}`,
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
          location: values.location
            ? {
                name: JSON.stringify(values.location.name),
                latitude: String(values.location.latitude),
                longitude: String(values.location.longitude),
                address: JSON.stringify(
                  values.location.address || values.location.name,
                ),
              }
            : null,

          company:
            typeof values.company === "string"
              ? { name: values.company }
              : {
                  id: values.company.id,
                  name: values.company.name,
                  logo: values.company.logo,
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

export default withModulePermission(CreateJobPage, "JOBS", "canCreate");
