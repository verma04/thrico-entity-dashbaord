"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import { FixedInsetMotionContainer } from "@/components/ui/fixed-inset-motion-container";
import { JobCreationForm } from "./job-creation-form";
import { useAddJob } from "@/graphql/actions/jobs";
import { useModuleStore } from "@/store/useModuleStore";

const Create = ({}) => {
  const singularName = useModuleStore((state) => state.jobSingularName);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [add, { loading }] = useAddJob({
    onCompleted: () => {
      onClose();
    },
  });

  const onClose = () => {
    setOpen(false);
  };

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

  return (
    <>
      <CtaButton onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" />
        Post {singularName}
      </CtaButton>

      <FixedInsetMotionContainer
        open={open}
        onClose={onClose}
        zIndex="z-50"
      >
        <JobCreationForm
          initialValues={{}}
          loading={loading}
          onFinish={onFinish}
          onCancel={onClose}
        />
      </FixedInsetMotionContainer>
    </>
  );
};

export default Create;
