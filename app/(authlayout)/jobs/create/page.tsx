"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAddJob } from "@/graphql/actions/jobs";
import { useGetEntity } from "@/graphql/actions";
import { JobCreationForm } from "@/components/jobs/create/job-creation-form";
import { useToast } from "@/components/ui/use-toast";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";
import { Briefcase } from "lucide-react";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

const CreateJobPage = () => {
  const moduleName = useModuleStore((state) => state.jobModuleName);
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
        description:
          error.message || `Failed to create ${singularName.toLowerCase()}`,
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
    <EcosystemWrapper>
      <EcosystemHeader
        title={`Create ${singularName}`}
        badgeText="New Posting"
        description={`Fill in the details to publish a new ${singularName.toLowerCase()}.`}
        icon={Briefcase}
        breadcrumbs={[
          { label: moduleName, href: "/jobs/all" },
          { label: "Create" },
        ]}
      />

      <EcosystemContainer className="p-0 border-none shadow-none ring-0 bg-transparent">
        <JobCreationForm
          initialValues={{}}
          loading={loading}
          onFinish={onFinish}
          onCancel={onCancel}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withModulePermission(CreateJobPage, "JOBS", "canCreate");
