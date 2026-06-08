"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { addDiscussionForum } from "@/graphql/actions/discussion-form";
import { ForumCreationForm } from "@/components/forums/create/forum-creation-form";
import { useToast } from "@/components/ui/use-toast";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

const CreateForumPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [add, { loading }] = addDiscussionForum({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: "Discussion posted successfully!",
      });
      router.push("/forums/all");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post discussion",
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
    <div className="h-full overflow-hidden">
      <ForumCreationForm
        initialValues={{}}
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
};

export default withSubscriptionCheck(
  withModulePermission(CreateForumPage, "FORUMS", "canCreate"),
  "forums"
);
