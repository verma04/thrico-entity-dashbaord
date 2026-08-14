"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { addDiscussionForum } from "@/graphql/actions/discussion-form";
import { ForumCreationForm } from "@/components/forums/create/forum-creation-form";
import { useToast } from "@/components/ui/use-toast";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import { useModuleStore } from "@/store/useModuleStore";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { MessageSquare } from "lucide-react";

const CreateForumPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const moduleName = useModuleStore((state) => state.forumModuleName);
  const singularName = useModuleStore((state) => state.forumSingularName);

  const [add, { loading }] = addDiscussionForum({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: `${singularName} posted successfully!`,
      });
      router.push("/forums/all");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to post ${singularName.toLowerCase()}`,
        variant: "destructive",
      });
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
    router.back();
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`New ${singularName}`}
        badgeText={moduleName}
        description={`Start a new discussion thread or question in your ${moduleName.toLowerCase()}.`}
        icon={MessageSquare}
        breadcrumbs={[
          { label: moduleName, href: "/forums/all" },
          { label: `New ${singularName}` },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
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
  "forums"
);
