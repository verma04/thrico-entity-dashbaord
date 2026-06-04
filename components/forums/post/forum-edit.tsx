"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ForumEditForm } from "./forum-edit-form";
import {
  editDiscussionForum,
  getDiscussionForumCategory,
} from "../../../graphql/actions/discussion-form";
import { discussionForm } from "../ts-types";

export default function Edit({
  forum,
  open,
  onClose,
}: {
  forum: discussionForm | null;
  open: boolean;
  onClose: () => void;
}) {
  const { data, loading } = getDiscussionForumCategory({
    variables: {
      input: {
        status: "ALL",
      },
    },
  });

  const [edit, { loading: loadBtn }] = editDiscussionForum({
    onCompleted: onClose,
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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[900px] p-0 border-none flex flex-col overflow-hidden"
      >
        <ForumEditForm
          initialValues={initialValues}
          categories={data?.getDiscussionForumCategory || []}
          categoriesLoading={loading}
          loading={loadBtn}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </SheetContent>
    </Sheet>
  );
}
