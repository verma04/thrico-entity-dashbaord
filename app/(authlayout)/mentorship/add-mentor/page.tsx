"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { MentorCreationForm } from "@/components/mentorship/add/mentor-creation-form";
import { useAddMentor } from "@/graphql/actions/mentorship/mentorship-actions";
import { notify } from "@/lib/notify";
import { useModuleStore } from "@/store/useModuleStore";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { UserPlus } from "lucide-react";

const AddMentorPage = () => {
  const singularName = useModuleStore((state) => state.mentorshipSingularName);
  const router = useRouter();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [addMentor, { loading }] = useAddMentor({
    onCompleted: () => {
      setSubmitError(null);
      notify.success(`${singularName} onboarded successfully!`);
      router.push("/mentorship/all");
    },
    onError: (error: any) => {
      const message =
        error.message || `Failed to onboard ${singularName.toLowerCase()}`;
      setSubmitError(message);
      notify.error(message);
    },
  });

  const onFinish = (values: any) => {
    setSubmitError(null);
    const input = {
      userId: values.userId,
      displayName: values.displayName,
      category: values.category,
      skills: values.skills,
      intro: values.intro,
      about: values.about,
      description: values.description,
      featuredArticle: values.featuredArticle,
      introVideo: values.introVideo,
      whyDoWantBecomeMentor: values.whyDoWantBecomeMentor,
      greatestAchievement: values.greatestAchievement,
      agreement: values.agreement,
      isTopMentor: values.isTopMentor,
    };

    addMentor({ variables: { input } });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`Add ${singularName}`}
        badgeText="New"
        description={`Onboard a new ${singularName.toLowerCase()} to the platform.`}
        icon={UserPlus}
        breadcrumbs={[
          { label: "Mentorship", href: "/mentorship/all" },
          { label: "Add" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <MentorCreationForm
          loading={loading}
          onFinish={onFinish}
          onCancel={onCancel}
          submitError={submitError}
          onDismissError={() => setSubmitError(null)}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withSubscriptionCheck(
  withModulePermission(AddMentorPage, "MENTORSHIP", "canCreate"),
  "mentorship",
);
