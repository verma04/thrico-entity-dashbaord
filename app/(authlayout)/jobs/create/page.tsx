"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAddJob } from "@/graphql/actions/jobs";
import { JobCreationForm } from "@/components/jobs/create/job-creation-form";
import { toast } from "sonner";
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

  const [add, { loading }] = useAddJob({
    onCompleted: (data: any) => {
      toast.success(`${singularName} created successfully!`);
      router.push("/jobs/all");
    },
    onError: (error: any) => {
      toast.error(
        error.message || `Failed to create ${singularName.toLowerCase()}`,
      );
    },
  });

  const onFinish = (values: any) => {
    const memberEligibility = values.memberEligibility || "ALL";
    const membershipTierId =
      values.membershipTierId || values.eligibleTierIds || [];
    const eligibleTierIds =
      values.eligibleTierIds || values.membershipTierId || [];
    const eligibleUserIds = values.eligibleUserIds || [];
    const eligibleSegmentIds = values.eligibleSegmentIds || [];
    const eligibleCommunityIds =
      values.eligibleCommunityIds || values.communityIds || [];
    const communityIds =
      values.communityIds || values.eligibleCommunityIds || [];
    const communityId =
      values.communityId || (communityIds.length > 0 ? communityIds[0] : undefined);

    add({
      variables: {
        input: {
          title: values.title,
          description: values.description,
          jobType: values.jobType,
          salary: values.salary,
          experienceLevel: values.experienceLevel,
          workplaceType: values.workplaceType,
          communityId,
          communityIds: communityIds.length > 0 ? communityIds : undefined,
          requirements: (values.requirements || []).filter(
            (r: string) => r && r.trim() !== "",
          ),
          responsibilities: (values.responsibilities || []).filter(
            (r: string) => r && r.trim() !== "",
          ),
          benefits: (values.benefits || []).filter(
            (r: string) => r && r.trim() !== "",
          ),
          skills: (values.skills || []).filter(
            (r: string) => r && r.trim() !== "",
          ),
          location: values.location
            ? typeof values.location === "object"
              ? {
                  name: values.location.name || values.location.address || "",
                  latitude: String(values.location.latitude || 0),
                  longitude: String(values.location.longitude || 0),
                  address: values.location.address || values.location.name || "",
                }
              : {
                  name: values.location,
                  latitude: "0",
                  longitude: "0",
                  address: values.location,
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
          memberEligibility,
          eligibility: {
            memberEligibility,
            membershipTierId,
            eligibleTierIds,
            eligibleUserIds,
            eligibleSegmentIds,
            eligibleCommunityIds,
            communityIds,
          },
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
