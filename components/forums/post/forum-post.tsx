"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MessageSquare } from "lucide-react";
import { ForumPostForm } from "./forum-post-form";
import {
  addDiscussionForum,
  getDiscussionForumCategory,
} from "../../../graphql/actions/discussion-form";

export default function Post() {
  const [open, setOpen] = useState(false);

  const { data, loading } = getDiscussionForumCategory({
    variables: { input: { status: "ALL" } },
  });

  const [add, { loading: loadBtn }] = addDiscussionForum({
    onCompleted: () => setOpen(false),
  });

  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = (values: any) => {
    add({ variables: { input: values } });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <MessageSquare className="h-4 w-4" />
        Create Post
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[900px] p-0 border-none flex flex-col overflow-hidden"
        >
          <ForumPostForm
            categories={data?.getDiscussionForumCategory || []}
            categoriesLoading={loading}
            loading={loadBtn}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
