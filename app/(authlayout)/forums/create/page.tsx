"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addDiscussionForum } from "@/graphql/actions/discussion-form";
import { ForumCreationForm } from "@/components/forums/create/forum-creation-form";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import { useModuleStore } from "@/store/useModuleStore";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { MessageSquare } from "lucide-react";

const CreateForumPage = () => {
  const router = useRouter();
  const moduleName = useModuleStore((state) => state.forumModuleName);
  const singularName = useModuleStore((state) => state.forumSingularName);

  const [add, { loading }] = addDiscussionForum({
    onCompleted: () => {
      toast.success(`${singularName} posted successfully!`);
      router.push("/forums/all");
    },
    onError: (error: any) => {
      toast.error(
        error.message || `Failed to post ${singularName.toLowerCase()}`,
      );
    },
  });

  const onFinish = (values: any) => {
    add({
      variables: {
        input: {
          title: values.title,
          content: values.content,
          category: values.category,
          isAnonymous: values.isAnonymous,
        },
      },
    });
  };

  const onCancel = () => {
    router.push("/forums/all");
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`Create ${singularName}`}
        badgeText="Community Dialogues"
        description={`Start a new discussion thread or question in your ${moduleName.toLowerCase()}.`}
        icon={MessageSquare}
        breadcrumbs={[
          { label: moduleName, href: "/forums/all" },
          { label: "Create" },
        ]}
      />
      <EcosystemContainer className="p-0 border-none shadow-none ring-0 bg-transparent">
        <ForumCreationForm
          initialValues={{}}
          loading={loading}
          onFinish={onFinish}
          onCancel={onCancel}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withSubscriptionCheck(
  withModulePermission(CreateForumPage, "FORUMS", "canCreate"),
  "forums",
);
