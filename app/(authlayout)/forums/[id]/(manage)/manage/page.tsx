"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ForumEditForm } from "@/components/forums/post/forum-edit-form";
import {
  editDiscussionForum,
  getDiscussionForumCategory,
  getDiscussionForumDetailsByID,
} from "@/graphql/actions/discussion-form";

export default function EditForumPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: categoryData, loading: categoriesLoading } =
    getDiscussionForumCategory({
      variables: {
        input: {
          status: "ALL",
        },
      },
    });

  const { data: forumData, loading: fetchingForum } =
    getDiscussionForumDetailsByID({
      variables: {
        input: {
          discussionForumId: id,
        },
      },
      skip: !id,
    });

  const forum = forumData?.getDiscussionForumDetailsByID;

  const [edit, { loading: loadBtn }] = editDiscussionForum({
    onCompleted: () => {
      // Could show toast here
    },
  });

  const handleSubmit = (values: any) => {
    edit({
      variables: {
        input: {
          id: forum?.id,
          ...values,
        },
      },
    });
  };

  const initialValues = {
    title: forum?.title || "",
    content: forum?.content || "",
    category: forum?.category?.id || "",
    isAnonymous: forum?.isAnonymous || false,
  };

  if (fetchingForum) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!forum) {
    return <div>Forum not found.</div>;
  }

  return (
    <div className="bg-background rounded-xl border border-border shadow-sm p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Edit Forum</h2>
        <p className="text-sm text-muted-foreground">
          Modify this community discussion forum
        </p>
      </div>

      <ForumEditForm
        initialValues={initialValues}
        categories={categoryData?.getDiscussionForumCategory || []}
        categoriesLoading={categoriesLoading}
        loading={loadBtn}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/forums/all")}
      />
    </div>
  );
}
