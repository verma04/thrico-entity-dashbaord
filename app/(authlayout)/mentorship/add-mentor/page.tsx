"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { MentorCreationForm } from "@/components/mentorship/add/mentor-creation-form";
import { useAddMentor } from "@/graphql/actions/mentorship/mentorship-actions";
import { notify } from "@/lib/notify";
import { useModuleStore } from "@/store/useModuleStore";

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
      const message = error.message || `Failed to onboard ${singularName.toLowerCase()}`;
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
    <div className="h-full overflow-hidden bg-white">
      <MentorCreationForm
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
        submitError={submitError}
        onDismissError={() => setSubmitError(null)}
      />
    </div>
  );
};



export default withSubscriptionCheck(
  withModulePermission(AddMentorPage, "MENTORSHIP", "canCreate"),
  "mentorship"
);
